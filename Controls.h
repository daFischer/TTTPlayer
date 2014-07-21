/* 
 * File:   Controls.h
 * Author: user
 *
 * Created on July 13, 2014, 6:40 PM
 */

#ifndef CONTROLS_H
#define	CONTROLS_H

#include <SDL/SDL.h>

#include "AudioInterface.h"
//#include "Video.h"
class Video;
#include "ProtocolPreferences.h"

#ifndef _STDIO_H
using namespace std;
#endif

#ifdef EMSCRIPTEN
#include <emscripten/emscripten.h>
#endif

using namespace std;

class Controls {
public:
    Controls(Video* video, AudioInterface* audio);
    void update();
    void registerClick(Uint16 mx, Uint16 my);
    void registerMouseUp();
    void registerMovement(Uint16 mx, Uint16 my);
    void draw(SDL_Surface *screen, bool hasDrawn);
    
    SDL_Rect videoUpdate;
    
private:

    Video* video;
    AudioInterface* audio;
    bool visible;
    int y;
    int width, height, screenHeight;
    int timeLineHeight;
    bool timeLineClicked;
    int timeLineChange;         //For when the user seeks through the video
    bool volumeClicked;
    float volume;
    int duration;
    
    SDL_Surface* surfPlay;
    SDL_Surface* surfVolume;
    SDL_Surface* surfVolume2;
    SDL_Surface* surfFullscreen;
    
    void togglePlay();
    void toggleFullscreen();
    void skipTo(int position);
    Uint32 emColor(Uint32);
    void redefineRect(SDL_Rect* rect, int x, int y, int w, int h);
    void changeVolume(float volume);
};

//#ifdef EMSCRIPTEN
extern "C" bool getOnFullScreenButton();
//#endif


#endif	/* CONTROLS_H */

