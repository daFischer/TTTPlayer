/* 
 * File:   Audio.cpp
 * Author: Johannes Fischer
 * Created on April 30, 2014, 3:39 PM
 */

#include "Audio.h"

ALbyte Audio::fileBuffer[100000];

Audio::Audio(const char* path) {
    
    //settings
    failed=true;
    int error;
    struct stat statbuf;
    
    int n=0;
    char c=0;
    char* cc=&c;
    alutInit(&n,&cc);
    if((error=alutGetError()) != ALUT_ERROR_NO_ERROR)
    {
        printf("Error0 (Audio): %d\n",error);
        return;
    }
    
    alGenBuffers(1, &buffer); //Generate buffer
    alGenSources(1, &source);           //Generate source
    if((error=alGetError()) != AL_NO_ERROR)
    {
        printf("Error2 (Audio): %d\n",error);
        return;
    }
    //Load our audio file from disk
    string extension[EXTSIZE] = {".mp3", ".mp2", ".ogg", ".wav"};
    
    ALboolean loop=false;
    string filename;
    for(int i=0;i<EXTSIZE;i++)                //try loading audio of all possible extensions
    {
        filename=path+extension[i];
        buffer=alutCreateBufferFromFile(filename.c_str());
        if((error=alutGetError())==ALUT_ERROR_NO_ERROR)
            break;
        //printf("Couldn't load %s: %d\n",filename.c_str(),error);
        if(i == EXTSIZE -1)
        {
            alDeleteBuffers(1, &buffer);
            return;
        }
    }
    
    alSourcei (source, AL_BUFFER, buffer);
    
    if ((error=alGetError()) != AL_NO_ERROR)
    {
        printf("Audio error: %d\n",error);
        return;
    }
    
    failed=false;
}

Audio::~Audio() {
    alDeleteBuffers(1,&buffer);
    alDeleteSources(1,&source);
    alutExit();
}

void Audio::togglePlay(){
    ALint state;
    alGetSourcei(source, AL_SOURCE_STATE, &state);
    if (state != AL_PLAYING)
    {
        //Play the audio file
        alSourcePlay(source);
    }
    else
    {
        alSourcePause(source);
    }
}

int Audio::getPosition()
{
    ALfloat time;
    alGetSourcef(source, AL_SEC_OFFSET, &time);
    
    int error;
    if((error = alGetError())!= AL_NO_ERROR)
        printf("getTime error: %d\n", error);
    //printf("%f\n",(float) time);
    return (int)(time*1000);
}


void Audio::setPosition(int pos)
{
    ALfloat time=(ALfloat)(pos/1000);
    alSourcef(source, AL_SEC_OFFSET, time);
    uint error;
    if((error=alGetError()) != AL_NO_ERROR)
        printf("Audio.cpp: set Position error: %d\n", error);
}

void Audio::changeVolume(float volume){
    ALfloat v=volume;
    alSourcef(source,AL_GAIN,v);
}

void Audio::changeSpeed(float speed){
    ALfloat s=speed;
    alSourcef(source,AL_PITCH,s);
}

int Audio::getDuration()
{
    ALint numBytes;
    ALint channels;
    ALint bits;

    alGetBufferi(buffer, AL_SIZE, &numBytes);
    alGetBufferi(buffer, AL_CHANNELS, &channels);
    alGetBufferi(buffer, AL_BITS, &bits);

    int numSamples = numBytes * 8 / (channels * bits);
    
    ALint frequency;

    alGetBufferi(buffer, AL_FREQUENCY, &frequency);
    double seconds = (double)numSamples / (double)frequency;
    
    if(alGetError()!= AL_NO_ERROR)
        printf("getDuration error\n");
    
    return (int)(seconds*1000);
}

bool Audio::hasFailed()
{
    return failed;
}

bool Audio::isPlaying() {
    ALint state;
    alGetSourcei(source,AL_SOURCE_STATE,&state);
    return state==AL_PLAYING;
}
