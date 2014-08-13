/* 
 * File:   Player.h
 * Author: Johannes Fischer
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
#include <SDL/SDL_ttf.h>

#include <stdio.h>
#include <fstream>
#include <time.h>

#include "AudioInterface.h"
#ifdef EMSCRIPTEN
#include "AudioJS.h"
#else
#include "Audio.h"
#endif
#include "Video.h"
#include "Controls.h"

using namespace std;

class Player {
public:
    Player(string filename);
    void loop();
    virtual ~Player();
#ifdef EMSCRIPTEN
    static void loadAsync();
#else
    static bool loadAsync();
#endif
    void videoCallback();
    
    static TTF_Font* font;
    
private:
    AudioInterface *audio;
    Video *video;
    Controls* controls;
    bool paused;
#ifndef EMSCRIPTEN
    bool quit;
#endif
};

extern Player *player;
void emLoop();
void cleanUp();

#endif	/* PLAYER_H */

