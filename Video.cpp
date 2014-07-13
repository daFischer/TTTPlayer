/* 
 * File:   Video.cpp
 * Author: user
 * 
 * Created on April 30, 2014, 8:36 PM
 */

#include "Video.h"

Video::Video(const char* path) {
    
    original=true;
    failed=false;
    FILE* f = fopen (path , "r");
    fread(prefs.versionMsg, 1, 12, f);
    // TODO: test version
    
    Inflater* inflater=new Inflater(f);
    
    if(readServerInit(inflater))
    printf("Video Initialization success: \n%s\n", prefs.name);
    
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
    
    printf("%d x %d, color depth: %d\n",prefs.framebufferWidth, prefs.framebufferHeight, prefs.bytesPerPixel);
    screen = SDL_SetVideoMode(prefs.framebufferWidth, prefs.framebufferHeight, prefs.bitsPerPixel, SDL_ANYFORMAT);
    prefs.format=screen->format;
    
    if (screen == NULL)
    {
        printf("Unable to set video mode: %s\n", SDL_GetError());
        failed=true;
        return;
    }
}

void Video::update(int zeit)
{
    //printf("%d\n",zeit);
    //printf("%d>=%d || %d>%d\n",currentMessage,numMessages,messages[currentMessage]->timestamp,timestamp);
    while(currentMessage<numMessages)
    {
        if(messages[currentMessage]->timestamp>zeit)
            break;
        printf("Stamp: %d, #Messages: %d, current Message: %d\n",messages[currentMessage]->timestamp,numMessages,currentMessage);
        messages[currentMessage]->paint(screen, &prefs);
        currentMessage++;
    }
}

SDL_Surface* Video::getScreen(){
    return screen;
}

void Video::toggleFullscreen(){
    return; //doesn't work yet, but not really important
    {
        printf("toggle fullscreen %d,%d\n",screen->flags,screen->flags & SDL_FULLSCREEN);
        screen=SDL_SetVideoMode(screen->w, screen->h, screen->format->BitsPerPixel, screen->flags ^ SDL_FULLSCREEN);
    }
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
        char name[nameLength+1];
        in->readCharArray(name,nameLength);
        prefs.name=(char*)malloc(nameLength+1);
        prefs.name=name;
        //printf("%s, %d\n", name, nameLength);
        return true;
    }
    return false;
}

void Video::readExtensions(Inflater* in){
    // new format without total length of all extensions
    int len;
    in->readInt(&len);
    while (len > 0) {
        SizedArray* extension=new SizedArray(len);
        printf("About to read #bytes: %d\n", len);
        in->readSizedArray(extension);
        //if (TTT.verbose)
        printf("Extension: Tag[%d] %d bytes\n", extension->array[0], len);
        //TODO:
        //extensions.push_back(extension);
        delete extension;
        
        in->readInt(&len);
    }
    /*TODO:
    //if (TTT.verbose)
        printf("%d extensions found.\n", extensions.size());
    parseExtensions();

    // no original, but modified recording
    if (extensions.size() > 0)
        original = false;
    */
}

Video::~Video() {
}

