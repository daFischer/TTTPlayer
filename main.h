/* 
 * File:   main.h
 * Author: Johannes Fischer
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
const string path = "TTT";
string filename = "Virtual_Machines_2014_04_08";// Diskrete_Strukturen_2013_11_26 , Programmiersprachen_2013_10_21 , GAD_2014_04_08-merged , Programmoptimierung_2013_10_16 , ZUE_Diskrete_Strukturen_2013_10_30
#endif

int main();


#endif	/* MAIN_H */

