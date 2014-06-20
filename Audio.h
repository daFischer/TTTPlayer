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
#include <sys/stat.h>

#include <AL/al.h>
#include <AL/alut.h>

#define BUFFER_SIZE 4096

using namespace std;

static void audioFinished();

class Audio {
public:
    Audio(const char*);
    void play();
    void finished();
    int getTime();
    bool setPosition(int time);
    int getDuration();

    bool failed;
private:
    bool readAudio(const char* path, string type);
    
    ALuint source;
    ALuint buffer;
    ALCdevice *device;
    ALCcontext *context;
    //ALsizei size;
    //ALsizei frequency; //Frequency of audio playback
    //ALenum format; //Format of the audio we're playing
    //ALvoid* data;

    //unsigned char *buf;
    //int pid;
    //int files[2];
    //FILE *f;

    int playing;
    //int startTime;
    //int currentTime;
};

#endif	/* AUDIO_H */

