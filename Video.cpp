/* 
 * File:   Video.cpp
 * Author: user
 * 
 * Created on April 30, 2014, 8:36 PM
 */

#include "Video.h"
#include "Controls.h"
#include "Messages/Annotation.h"

Video::Video(const char* path) {
    
    original=true;
    failed=false;
    FILE* f = fopen (path , "r");
    fread(prefs.versionMsg, 1, 12, f);
    // TODO: test version
    
    Inflater* inflater=new Inflater(f);
    
    if(readServerInit(inflater))
    printf("Video Initialization success: \n%s\n", prefs.name);
    
    index=NULL;
    
    readExtensions(inflater);
    inflater->readInt(&prefs.starttime);
    inflater->readInt(&prefs.starttime);
    
    //Start reading Messages
    setUp();
    list<Message*> m = readMessages(inflater, &prefs);
    numMessages=m.size();
    messages=(Message**) malloc(numMessages*sizeof(Message*));
    currentMessage=0;
    for(int i=0; i<numMessages; i++)
    {
        messages[i] = m.front();
        m.pop_front();
    }
    printf("Read %d messages successfully\n", numMessages);
    //if(index==NULL)
    //    index=new Index(messages,numMessages);
    
    printf("%d x %d, color depth: %d\n",prefs.framebufferWidth, prefs.framebufferHeight, prefs.bytesPerPixel);
    screen = SDL_SetVideoMode(prefs.framebufferWidth, prefs.framebufferHeight, prefs.bitsPerPixel, SDL_ANYFORMAT|SDL_DOUBLEBUF);
    prefs.format=screen->format;
    rawScreen=SDL_CreateRGBSurface(SDL_SRCALPHA,screen->w,screen->h,screen->format->BitsPerPixel,screen->format->Rmask,screen->format->Gmask,screen->format->Bmask,screen->format->Amask);
    if(containsAnnotations)
    {
        annScreen=SDL_CreateRGBSurface(screen->flags,screen->w,screen->h,screen->format->BitsPerPixel,screen->format->Rmask,screen->format->Gmask,screen->format->Bmask,0xffffffff-screen->format->Rmask-screen->format->Gmask-screen->format->Bmask);
    }
    
    if (screen == NULL)
    {
        printf("Unable to set video mode: %s\n", SDL_GetError());
        failed=true;
        return;
    }
}

void Video::update(int zeit, Controls* controls)
{
    bool blitRaw=false;
    bool blitAnn=false;
    Annotation* annotation;
    //check whether audio has restarted
    if(zeit<=2 && (currentMessage>=numMessages || (currentMessage>0 && messages[currentMessage-1]->timestamp>zeit-2)))
        currentMessage=0;
    
    while(currentMessage<numMessages)
    {
        if(messages[currentMessage]->timestamp > zeit*1000)
            break;
        switch(messages[currentMessage]->type){
            case ANNOTATION:
                blitAnn=true;
                annotation=reinterpret_cast<Annotation*>(messages[currentMessage]);
                annotation->paint(annScreen, &prefs);
                break;
            case RAW:
                blitRaw=true;
                messages[currentMessage]->paint(rawScreen, &prefs);
                break;
            case CURSOR:
                
                break;
            case WHITEBOARD:
                messages[currentMessage]->paint(rawScreen, &prefs);
                break;
        }
        currentMessage++;
    }
    if(blitAnn)
    {
        //redraw annScreen if needed, doesn't matter which annotation does it
        if(annotation->mustRedraw)
            annotation->redraw(annScreen,&prefs);
    }
    redrawScreen(controls, blitAnn||blitRaw);
}

void Video::redrawScreen(Controls* controls, bool fully) {
    if(fully)
    {
        //redraw screen completely
        SDL_Rect rect = {0,0,screen->w,controls->videoUpdate.y+controls->videoUpdate.h};
        SDL_BlitSurface(rawScreen,&rect,screen,&rect);
        SDL_BlitSurface(annScreen,&rect,screen,&rect);
    }
    else
    {
        if(lastThumbnail.w!=0)
        {
            //redraw screen where thumbnail was before
            SDL_BlitSurface(rawScreen,&lastThumbnail,screen,&lastThumbnail);
            SDL_BlitSurface(annScreen,&lastThumbnail,screen,&lastThumbnail);
            lastThumbnail.w=0;
        }
        if(controls->videoUpdate.h!=0)
        {
            //only redraw the part that controls releases when moving downwards
            SDL_BlitSurface(rawScreen,&controls->videoUpdate,screen,&controls->videoUpdate);
            SDL_BlitSurface(annScreen,&controls->videoUpdate,screen,&controls->videoUpdate);
        }
    }
    //always redraw controls
    controls->draw(screen, fully);
    SDL_Flip(screen);
}

void Video::drawThumbnail(int zeit, int x, int y) {
    if(index!=NULL)
    {
        index->lastBefore(zeit)->paintAt(screen,x,y);
        lastThumbnail=index->lastBefore(zeit)->getRect(screen,x,y);
    }
}


void Video::toggleFullscreen(){
    return; //doesn't work yet, but not really important
    {
        printf("toggle fullscreen %d,%d\n",screen->flags,screen->flags & SDL_FULLSCREEN);
        screen=SDL_SetVideoMode(screen->w, screen->h, screen->format->BitsPerPixel, screen->flags ^ SDL_FULLSCREEN);
    }
}

void Video::seekPosition(int position, Controls* controls){
    
    //binary search for message closest to position
    int min, max;
    min=1;
    max= numMessages;
    while(min!=max)
        if(messages[(min+max)/2]->timestamp > position*1000)
            max=(min+max)/2;
        else
            min=(min+max)/2+1;
    currentMessage=min-1;
    
    int firstAnnotation=0;
    int firstRaw=0;
    bool foundCursor=false;
    bool foundWhiteBoard=false;
    for(int i= currentMessage;i>=0;i--)
    {
        //printf("%s\n",messages[i]->type);
        if(     (firstRaw!=0 || foundWhiteBoard) &&
                (firstAnnotation!=0 || !containsAnnotations) &&
                (foundCursor || !containsCursorMessages))
            break;
        
        switch(messages[i]->type){
            case ANNOTATION:
                if(firstAnnotation==0 && messages[i]->completeScreen(prefs.framebufferWidth, prefs.framebufferHeight))
                    firstAnnotation=i;
                break;
            case RAW:
                if(firstRaw==0 && messages[i]->completeScreen(prefs.framebufferWidth, prefs.framebufferHeight))
                    firstRaw=i;
                break;
            case CURSOR:
                if(!foundCursor)
                    messages[i]->paint(screen,&prefs);
                foundCursor=true;
                break;
            case WHITEBOARD:
                if(!foundWhiteBoard)
                {
                    messages[i]->paint(rawScreen,&prefs);
                    firstAnnotation=i;
                }
                foundWhiteBoard=true;
                break;
        }
    }
    
    //after the search, Annotations must be redrawn
    Annotation::mustRedraw=true;
    Annotation::annotations.clear();
    
    for(int i=firstRaw;i<currentMessage;i++)
        if(messages[i]->type==RAW)
            messages[i]->paint(rawScreen,&prefs);
    
    for(int i=firstAnnotation;i<currentMessage;i++)
        if(messages[i]->type==ANNOTATION)
            messages[i]->paint(annScreen,&prefs);
    
    Annotation::redraw(annScreen,&prefs);
    
    redrawScreen(controls,true);
    
    /*//search backwards for raw message that changes the whole screen
    printf("From %d ",currentMessage);
    for(currentMessage;currentMessage>0;currentMessage--)
    {
        if(messages[currentMessage]->completeScreen((int)prefs.framebufferWidth, (int)prefs.framebufferHeight))
            break;
    }
    printf("back to %d(%d)\n",currentMessage, messages[currentMessage]->encoding);*/
}

bool readServerInit(Inflater* in)
{
    ProtocolPreferences prefs;
    in->readShort(&prefs.framebufferWidth);
    in->readShort(&prefs.framebufferHeight);
    in->readByte(&prefs.bitsPerPixel);
    switch(prefs.bitsPerPixel){
        case 8:
            prefs.bytesPerPixel=1;
            break;
        case 16:
            prefs.bytesPerPixel=2;
            break;
        default:
            prefs.bytesPerPixel=4;
            break;
    }
    in->readByte(&prefs.depth);
    char toRead;
    in->readByte(&toRead);
    prefs.bigEndian = toRead != 0;
    in->readByte(&toRead);
    prefs.trueColour = toRead != 0;
    in->readShort(&prefs.redMax);
    in->readShort(&prefs.greenMax);
    in->readShort(&prefs.blueMax);
    in->readByte(&prefs.redShift);
    in->readByte(&prefs.greenShift);
    in->readByte(&prefs.blueShift);
    
    for(int i=0;i<3;i++)        //padding
        in->readByte(&toRead);
    
    int nameLength;
    if(in->readInt(&nameLength)==Z_OK)
    {
        prefs.name=in->readCharArray(nameLength,true);
        //printf("%s, %d\n", name, nameLength);
        return true;
    }
    return false;
}

void Video::readExtensions(Inflater* in){
    int len;
    in->readInt(&len);
    char tag;
    while (len > 0) {
        in->readByte(&tag);
        switch(tag){
            case EXTENSION_INDEX_TABLE:
                // no original, but modified recording
                original = false;
                index=new Index(in, len-1);
                break;
                
            /*case EXTENSION_SEARCHBASE_TABLE_WITH_COORDINATES:
                // no original, but modified recording
                original = false;
                
                break;*/
                
            default:
                //'tag' is the first byte, so skip one less than len
                printf("Unknown extension: %d. Skipping %d bytes.\n",tag,len-1);
                in->skipBytes(len-1);
                break;
        }
        in->readInt(&len);
    }
    /*// new format without total length of all extensions
    int len;
    in->readInt(&len);
    while (len > 0) {
        SizedArray* extension=new SizedArray(len);
        printf("About to read #bytes: %d\n", len);
        in->readSizedArray(extension);
#if VERBOSE
        printf("Extension: Tag[%d] %d bytes\n", extension->array[0], len);
#endif
        extensions.push_back(extension);
        //delete extension;
        
        in->readInt(&len);
    }
    //TODO:
#if VERBOSE
        printf("%d extensions found.\n", extensions.size());
#endif
    // no original, but modified recording
    original =  extensions.size() == 0;
    
    parseExtensions();*/
}

/*void Video::parseExtensions() {
    SizedArray* ext;
    while(extensions.size()>0)
    {
        ext=extensions.front();
        switch(ext->array[0]){
            case EXTENSION_INDEX_TABLE:
                
                break;
            case EXTENSION_SEARCHBASE_TABLE_WITH_COORDINATES:
                
                break;
            default:
                
                break;
        }
        delete ext;
        extensions.pop_front();
    }  
}*/


Video::~Video() {
}

