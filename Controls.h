/* 
 * File:   Controls.h
 * Author: Johannes Fischer
 *
 * Created on July 13, 2014, 6:40 PM
 */

#ifndef CONTROLS_H
#define	CONTROLS_H

#include <SDL/SDL.h>
#include <sstream>

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
    ~Controls();
    void update();
    void registerClick(Uint16 mx, Uint16 my);
    void registerMouseUp();
    void registerMovement(Uint16 mx, Uint16 my);
    void draw(SDL_Surface *screen);
    
    int progress;           //timestamp of next to be filled IndexEntry, -1 if all have been filled
    
private:
    
    void togglePlay();
    void toggleFullscreen();
    void skipTo(int position);
    Uint32 emColor(Uint32);
    void redefineRect(SDL_Rect* rect, int x, int y, int w, int h);
    void changeVolume(float volume);
    void changeSpeed(float volume);
    void drawScaledText(SDL_Surface* screen, SDL_Surface* text, short x, short y, char factor);
    Uint32 readPixel(SDL_Surface* source, int x, int y);

    Video* video;
    AudioInterface* audio;
    int y;
    int width, height, screenHeight;
    int timeLineHeight;
    bool timeLineClicked;
    int mouseX, mouseY;
    bool volumeClicked;
    float volume;
    bool speedClicked;
    float speed;
    int duration;
    
    SDL_Surface* surfPlay;
    SDL_Surface* surfVolume;
    SDL_Surface* surfVolume2;
    SDL_Surface* surfFullscreen;
    SDL_Surface* surfSpeed;
    SDL_Surface* surfSpeed2;
};

//#ifdef EMSCRIPTEN
extern "C" bool getOnFullScreenButton();
extern "C" bool getOnPlayButton();
//#endif


#endif	/* CONTROLS_H */

