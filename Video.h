/* 
 * File:   Video.h
 * Author: Johannes Fischer
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

#include "Inflater.h"
#include "ProtocolPreferences.h"
#include "Messages/Message.h"
#include "SizedArray.h"
#include "Index.h"
//#include "Controls.h"
class Controls;

//#include "ProtocolPreferences.h"

using namespace std;

class Video {
public:
    Video(const char* path);
    virtual ~Video();
    bool loadAsync();
    void update(int zeit, Controls* controls);
    void redrawScreen(Controls* controls, bool fully);
    void toggleFullscreen();
    void seekPosition(int position, Controls* controls);
    void drawThumbnail(int zeit,int x,int y);
    
    bool failed;
    bool hasThumbnails;
    
private:    
    void readExtension(Inflater* in);
    void showProgress();
    long int fileSize;          //size of the .ttt FILE. needed to show parsing progress
    long int progress;
    
    SDL_Surface* screen;	//Pointer to the main screen surface
    SDL_Surface* rawScreen;     //SDL_Surface that buffers FrameBuffer Messages
    SDL_Surface* annScreen;     //SDL_Surface that buffers Annotations
    list<Message*> m;
    Message** messages;
    int numMessages;
    int currentMessage;
    
    Index* index;
    SDL_Rect lastThumbnail;     //Bounding Box of the last drawn IndexEntry. needed when redrawing screen 
    bool original;
    int lastTime;               //Milliseconds since the last IndexEntry has been filled
    ProtocolPreferences prefs;
    
    Inflater* inflater;
    char loadPhase;
};
bool readServerInit(Inflater* in);

#endif	/* VIDEO_H */

