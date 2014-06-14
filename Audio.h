/* 
 * File:   Audio.h
 * Author: user
 *
 * Created on April 30, 2014, 3:39 PM
 */

#ifndef AUDIO_H
#define	AUDIO_H

#include <stdio.h>
#include <time.h>
#include <string>

#include <SDL/SDL.h>
#include <SDL/SDL_mixer.h>

using namespace std;

static void audioFinished();

class Audio {
public:
    Audio(const char*);
    void play();
    virtual ~Audio();
    //void finished();
    int getTime();
    int setPosition(double pos);
    double getDuration();
    
    bool failed;
    bool finished;
private:
    int audio_rate;			//Frequency of audio playback
    Uint16 audio_format;                //Format of the audio we're playing
    int audio_channels;			//2 channels = stereo
    int audio_buffers;                  //Size of the audio buffers in memory
    int musicPlaying;
    Mix_Music *music;                   //Pointer to our music, in memory
    int startTime;
    int currentTime;
};

#endif	/* AUDIO_H */

