/* 
 * File:   Video.h
 * Author: user
 *
 * Created on April 30, 2014, 8:36 PM
 */

#ifndef VIDEO_H
#define	VIDEO_H

#include <SDL/SDL.h>

#include <stdio.h>
#include <list>
#include <fstream>
#include <zlib.h>
#include <time.h>
#include <assert.h>
#include <curl/curl.h>

#include "Inflater.h"
#include "ProtocolPreferences.h"
#include "Message.h"
#include "SizedArray.h"

//#include "ProtocolPreferences.h"

using namespace std;

class Video {
public:
    Video(Downloader*);
    //Video(const Video& orig);
    virtual ~Video();
    void startReading();
    bool isReady();
    void update(int zeit);
    
    bool failed;
    bool finished;
    
private:
    void ready();
    
    Downloader* downloader;
    SDL_Surface *screen;			//Pointer to the main screen surface
    Message** messages;
    int numMessages;
    int currentMessage;
    void readExtensions(Inflater* in);
    //list<char[]> extensions;
    bool original;
    ProtocolPreferences prefs;
};
bool readServerInit(Inflater* in);

#endif	/* VIDEO_H */

