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
    //Video(const Video& orig);
    virtual ~Video();
    void update(int zeit, Controls* controls);
    void redrawScreen(Controls* controls, bool fully);
    void toggleFullscreen();
    void seekPosition(int position, Controls* controls);
    void drawThumbnail(int zeit,int x,int y);
    
    bool failed;
    bool hasThumbnails;
    
private:    
    SDL_Surface* screen;			//Pointer to the main screen surface
    SDL_Surface* rawScreen;                     //Pointer to screen for messages with type RAW
    SDL_Surface* annScreen;                     //Screen that buffers Annotations
    Message** messages;
    int numMessages;
    int currentMessage;
    void readExtensions(Inflater* in);
    Index* index;
    SDL_Rect lastThumbnail;
    bool original;
    ProtocolPreferences prefs;
};
bool readServerInit(Inflater* in);

#endif	/* VIDEO_H */

