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
//extern "C" const char* set_path(const char* p);

bool paused=false;
#ifdef EMSCRIPTEN
const string path = "TTT";
string filename = "";
#else
const string path = "/home/user/NetBeansProjects/TTTPlayer/emBuild/TTT";
string filename = "Programmiersprachen_2013_10_21";
#endif

int main();


#endif	/* MAIN_H */

