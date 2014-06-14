/* 
 * File:   Player.h
 * Author: user
 *
 * Created on April 30, 2014, 4:30 PM
 */

#ifndef PLAYER_H
#define	PLAYER_H

#ifdef EMSCRIPTEN
#include <emscripten/emscripten.h>
#else
#endif

#include <SDL/SDL.h>
#include <SDL/SDL_mixer.h>

#include <stdio.h>
#include <fstream>
#include <time.h>

#include "Audio.h"
#include "Video.h"

using namespace std;

class Player {
public:
    Player(const char*, const char*);
    void loop();
    virtual ~Player();
    
private:
    Downloader* downloader;
    string audioURL;
    int progress;
    Audio *audio;
    Video *video;
    bool paused;
#ifndef EMSCRIPTEN
    bool quit;
#endif
};

extern Player *player;
void emLoop();

#endif	/* PLAYER_H */

