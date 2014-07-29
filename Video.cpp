/* 
 * File:   Video.cpp
 * Author: user
 * 
 * Created on April 30, 2014, 8:36 PM
 */

#include "Video.h"
#include "Controls.h"
#include "Messages/Annotation.h"
#include "Messages/CursorMessage.h"
#include "Messages/WhiteboardMessage.h"

Video::Video(const char* path) {
    
    original=true;
    failed=true;
    FILE* f = fopen (path , "r");
    fread(prefs.versionMsg, 1, 12, f);
    // TODO: test version
    
    Inflater* inflater=new Inflater(f);
    
    if(readServerInit(inflater))
        if(VERBOSE)
            printf("Video Initialization success: \n%s\n", prefs.name);
    
    index=NULL;
    
    readExtensions(inflater);
    if(inflater->readInt(&prefs.starttime)!=Z_OK)
        return;
    inflater->readInt(&prefs.starttime);
    //printf("Sizeof long = %d\n",sizeof(long));
    
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
    
    if(VERBOSE)
        printf("Read %d messages successfully\n", numMessages);
    delete(inflater);
    
    if(VERBOSE)
        printf("%d x %d, color depth: %d\n",prefs.framebufferWidth, prefs.framebufferHeight, prefs.bytesPerPixel);
    screen = SDL_SetVideoMode(prefs.framebufferWidth, prefs.framebufferHeight, prefs.bitsPerPixel, SDL_ANYFORMAT|SDL_DOUBLEBUF);
    //prefs.format->Amask=0xffffffff-screen->format->Rmask-screen->format->Gmask-screen->format->Bmask;
    rawScreen=SDL_CreateRGBSurface(screen->flags,screen->w,screen->h,screen->format->BitsPerPixel,screen->format->Rmask,screen->format->Gmask,screen->format->Bmask,0xffffffff-screen->format->Rmask-screen->format->Gmask-screen->format->Bmask);
    prefs.format=rawScreen->format;
    if(containsAnnotations)
    {
        annScreen=SDL_CreateRGBSurface(screen->flags,screen->w,screen->h,screen->format->BitsPerPixel,screen->format->Rmask,screen->format->Gmask,screen->format->Bmask,0xffffffff-screen->format->Rmask-screen->format->Gmask-screen->format->Bmask);
    }
    
    if (screen == NULL)
    {
        printf("Unable to set video mode: %s\n", SDL_GetError());
        return;
    }
    if(index==NULL)
        index=new Index(messages,numMessages);
    lastThumbnail.w=0;
    failed=false;
}

void Video::update(int zeit, Controls* controls)
{
    bool blitRaw=false;
    bool blitAnn=false;
    //check whether audio has restarted
    if(zeit<=2 && (currentMessage>0 && messages[currentMessage-1]->timestamp>zeit*1000+5000))
        currentMessage=0;
    
    if(zeit>=2)
        index->fillSurface(screen,messages,numMessages,&prefs);
    
    while(currentMessage<numMessages)
    {
        if(messages[currentMessage]->timestamp > zeit*1000)
            break;
        //printf("%d\n",messages[currentMessage]->encoding);
        switch(messages[currentMessage]->type){
            case ANNOTATION:
                blitAnn=true;
                messages[currentMessage]->paint(annScreen, &prefs);
                break;
            case RAW:
                blitRaw=true;
                messages[currentMessage]->paint(rawScreen, &prefs);
                break;
            case CURSOR:
                SDL_Rect cm=CursorMessage::getMask();
                cm.x=max(min((int)cm.x,(int)screen->w-cm.w),0);
                cm.y=max(min((int)cm.y,(int)screen->h-cm.h),0);
                if(CursorMessage::showCursor){
                    // repair place on screen, where the cursor was
                    SDL_BlitSurface(rawScreen,&cm,screen,&cm);
                    SDL_BlitSurface(annScreen,&cm,screen,&cm);
                }
                messages[currentMessage]->paint(screen, &prefs);
                //printf("CURSOR encoding = %d\n",messages[currentMessage]->encoding);
                SDL_BlitSurface(CursorMessage::cursor,NULL,screen,&cm);
                break;
        }
        currentMessage++;
    }
    if(blitAnn)
    {
        //redraw annScreen if needed, doesn't matter which annotation does it
        if(Annotation::mustRedraw)
            Annotation::redraw(annScreen,&prefs);
    }
    redrawScreen(controls, blitAnn||blitRaw);
}

void Video::redrawScreen(Controls* controls, bool fully) {
    if(fully)
    {
        //redraw screen completely
        SDL_Rect rect = {0,0,screen->w,controls->videoUpdate.y+controls->videoUpdate.h};
        if(WhiteboardMessage::number>0)
            SDL_FillRect(screen,&rect,SDL_MapRGBA(ProtocolPreferences::format,0xff,0xff,0xff,0xff));
        else
            SDL_BlitSurface(rawScreen,&rect,screen,&rect);
        SDL_BlitSurface(annScreen,&rect,screen,&rect);
        if(CursorMessage::showCursor)
        {
            SDL_Rect cm=CursorMessage::getMask();
            SDL_BlitSurface(CursorMessage::cursor,NULL,screen,&cm);
        }
    }
    else
    {
        if(lastThumbnail.w!=0)
        {
            //redraw screen where thumbnail was before
            if(WhiteboardMessage::number>0)
                SDL_FillRect(screen,&lastThumbnail,SDL_MapRGBA(ProtocolPreferences::format,0xff,0xff,0xff,0xff));
            else
                SDL_BlitSurface(rawScreen,&lastThumbnail,screen,&lastThumbnail);
            SDL_BlitSurface(annScreen,&lastThumbnail,screen,&lastThumbnail);
            if(CursorMessage::showCursor)
            {
                SDL_Rect cm=CursorMessage::getMask();
                SDL_BlitSurface(CursorMessage::cursor,NULL,screen,&cm);
            }
            lastThumbnail.w=0;
        }
        if(controls->videoUpdate.h!=0)
        {
            //only redraw the part that controls releases when moving downwards
            if(WhiteboardMessage::number>0)
                SDL_FillRect(screen,&controls->videoUpdate,SDL_MapRGBA(ProtocolPreferences::format,0xff,0xff,0xff,0xff));
            else
                SDL_BlitSurface(rawScreen,&controls->videoUpdate,screen,&controls->videoUpdate);
            SDL_BlitSurface(annScreen,&controls->videoUpdate,screen,&controls->videoUpdate);
            if(CursorMessage::showCursor)
            {
                SDL_Rect cm=CursorMessage::getMask();
                SDL_BlitSurface(CursorMessage::cursor,NULL,screen,&cm);
            }
        }
    }
    //always redraw controls
    controls->draw(screen, fully);
    SDL_Flip(screen);
}

void Video::drawThumbnail(int timestamp, int x, int y) {
    if(index!=NULL)
    {
        index->lastBefore(timestamp)->paintThumbnail(screen,x,y);
        lastThumbnail=index->lastBefore(timestamp)->getRect(screen,x,y);
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
    min--;
    IndexEntry* indexEntry=index->lastBefore(messages[min]->timestamp);
    int lastEntry=indexEntry->timestamp;
    
    WhiteboardMessage::number=std::min(WhiteboardMessage::number,0);
    int firstAnnotation=0;
    int firstRaw=0;
    bool foundCursor=false;
    for(int i= min;i>=0;i--)
    {
        //printf("%s\n",messages[i]->type);
        if(     (firstRaw!=0 || (lastEntry >= messages[i]->timestamp && indexEntry->hasImages)) &&
                (firstAnnotation!=0 || !containsAnnotations) &&
                (foundCursor || !containsCursorMessages))
            break;
        if(i==currentMessage && currentMessage<=min)
        {
            firstRaw=std::max(i,firstRaw);
            firstAnnotation=std::max(i,firstAnnotation);
            break;
        }
        
        switch(messages[i]->type){
            case ANNOTATION:
                if(firstAnnotation==0 && messages[i]->completeScreen(prefs.framebufferWidth, prefs.framebufferHeight))
                    firstAnnotation=i;
                break;
            case RAW:
                if((lastEntry >= messages[i]->timestamp && indexEntry->hasImages) || (firstRaw==0 && messages[i]->completeScreen(prefs.framebufferWidth, prefs.framebufferHeight)))
                    firstRaw=i;
                break;
            case CURSOR:
                if(!foundCursor)
                    messages[i]->paint(screen,&prefs);
                foundCursor=true;
                break;
        }
    }
    
    //printf("IndexEntry at %d has%s Images\n",lastEntry, indexEntry->hasImages ? "" : " no");
    if(lastEntry>=messages[firstRaw]->timestamp && indexEntry->hasImages)
    {
        indexEntry->paintWaypoint(rawScreen);
        //firstRaw=lastEntry;
    }
    for(int i=firstRaw;i<min;i++)
        if(messages[i]->type==RAW)
            messages[i]->paint(rawScreen,&prefs);
    
    if(firstAnnotation!=currentMessage)
    {
        //after the search, Annotations must be redrawn
        Annotation::mustRedraw=true;
        Annotation::annotations.clear();
    }
    for(int i=firstAnnotation;i<min;i++)
        if(messages[i]->type==ANNOTATION)
            messages[i]->paint(annScreen,&prefs);
    
    if(firstAnnotation!=currentMessage||Annotation::mustRedraw)
        Annotation::redraw(annScreen,&prefs);
    
    currentMessage=min;
    
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
                //printf("read EXTENSION_INDEX_TABLE\n");
                int error;
                // no original, but modified recording
                original = false;
                index=new Index(in, len-1);
                break;
                
                //TODO: EXTENSION_SEARCHBASE_TABLE_WITH_COORDINATES
            /*case EXTENSION_SEARCHBASE_TABLE_WITH_COORDINATES:
                // no original, but modified recording
                original = false;
                
                break;*/
                
            default:
                //'tag' is the first byte, so skip one less than len
                printf("Unknown extension: %d. Skipping %d bytes.\n",tag,len-1);
                if(in->skipBytes(len-1)!=Z_OK)
                {
                    printf("killed by extensions\n");
                    return;
                }
                break;
        }
        in->readInt(&len);
    }
}

Video::~Video() {
    SDL_FreeSurface(screen);
    SDL_FreeSurface(rawScreen);
    SDL_FreeSurface(annScreen);
    for(int i=0;i<numMessages;i++)
    {
        delete(messages[i]);
        messages[i]=NULL;
    }
    free(messages);
    messages=NULL;
    delete(index);
}

