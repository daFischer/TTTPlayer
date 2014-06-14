/* 
 * File:   main.h
 * Author: user
 *
 * Created on May 6, 2014, 10:59 AM
 */

#ifndef MAIN_H
#define	MAIN_H

#ifdef EMSCRIPTEN
#include <emscripten/emscripten.h>
#else
#endif

#include <SDL/SDL.h>
#include <SDL/SDL_mixer.h>

#include <math.h>
#include <stdio.h>
#include <fstream>      // std::ifstream

#include "Player.h"

using namespace std;

extern "C" void on_pause();
extern "C" void on_play();
extern "C" void set_path(string p);

bool paused=false;
#ifdef EMSCRIPTEN
const string path = "http://www.theether.heliohost.org";
#else
const string path = "http://www.theether.heliohost.org";
#endif
string filename = "Diskrete_Strukturen_2013_11_21";

extern "C" void set_path(string p);

int main();


#endif	/* MAIN_H */

