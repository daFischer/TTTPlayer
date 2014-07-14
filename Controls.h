/* 
 * File:   Controls.h
 * Author: user
 *
 * Created on July 13, 2014, 6:40 PM
 */

#ifndef CONTROLS_H
#define	CONTROLS_H

#include "AudioInterface.h"
#include "Video.h"
#include "ProtocolPreferences.h"

#include <stdio.h>
#include <SDL/SDL.h>

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
    
private:

    Video* video;
    AudioInterface* audio;
    int width, height;
    int timeLineHeight;
    bool timeLineClicked;
    int timeLineChange;         //For when the user seeks through the video
    bool volumeClicked;
    float volume;
    int y;
    int duration;
    void togglePlay();
    void toggleFullscreen();
    void skipTo(int position);
    void draw();
    void redefineRect(SDL_Rect* rect, int x, int y, int w, int h);
    void changeVolume(float volume);
};

//#ifdef EMSCRIPTEN
extern "C" bool getOnFullScreenButton();
//#endif


#endif	/* CONTROLS_H */

