/* 
 * File:   Audio.h
 * Author: Johannes Fischer
 *
 * Created on April 30, 2014, 3:39 PM
 */

#ifndef AUDIO_H
#define	AUDIO_H

#define EXTSIZE 4

#include <stdio.h>
#include <time.h>
#include <string>
#include <sys/stat.h>

#include <AL/al.h>
#ifdef EMSCRIPTEN
#include "alut.h"
#else
#include <AL/alut.h>
#endif
#include <SDL/SDL.h>
#include <SDL/SDL_mixer.h>

#include "AudioInterface.h"

#define BUFFER_SIZE 100000

using namespace std;

//static void audioFinished();

class Audio: public AudioInterface{
public:
    Audio(const char*);
    ~Audio();
    void togglePlay();
    int getPosition();
    void setPosition(int pos);
    int getDuration();
    bool hasFailed();
    void changeVolume(float volume);
    void changeSpeed(float volume);
    bool isPlaying();

private:
    bool failed;
    ALuint source;
    ALuint buffer;
    static ALbyte fileBuffer[100000];
};

#endif	/* AUDIO_H */

