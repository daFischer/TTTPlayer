/* 
 * File:   AudioJS.h
 * Author: user
 *
 * Created on July 13, 2014, 2:51 PM
 */

#ifndef EMSCRIPTEN
#define	AUDIOJS_H
#endif	/* EMSCRIPTEN */

#ifndef AUDIOJS_H
#define	AUDIOJS_H

#include <emscripten/emscripten.h>
#include <stdio.h>

#include "AudioInterface.h"

using namespace std;

class AudioJS: public AudioInterface{
public:
    AudioJS();
    void play();
    int getPosition();
    int getDuration();
    bool hasFailed();
private:
    int duration;
    

};

#endif	/* AUDIOJS_H */

