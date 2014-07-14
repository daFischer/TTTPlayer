/* 
 * File:   Audio.cpp
 * Author: user
 * http://wiki.delphigl.com/index.php/OpenAL-Funktions%C3%BCbersicht
 * http://www.codeproject.com/Articles/656543/The-LAME-wrapper-An-audio-converter
 * https://github.com/sopel39/audioconverter.js
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
    string extension[4] = {".mp3", ".mp2", ".ogg", ".wav"};
    
    ALboolean loop=false;
    string filename;
    for(int i=0;i<sizeof(extension);i++)                //try loading audio of all possible extensions
    {
        filename=path+extension[i];
        buffer=alutCreateBufferFromFile(filename.c_str());
        if((error=alutGetError())==ALUT_ERROR_NO_ERROR)
            break;
        printf("Couldn't load %s: %d\n",filename.c_str(),error);
        if(i == sizeof(extension) -1)
        {
            alDeleteBuffers(1, &buffer);
        }
    }
    
    alSourcei (source, AL_BUFFER, buffer);
    
    if (alGetError() != AL_NO_ERROR)
    {
        printf("Audio last error\n");
        return;
    }
    
    failed=false;
}

void Audio::togglePlay(){
    ALint state;
    alGetSourcei(source, AL_SOURCE_STATE, &state);
    if (state != AL_PLAYING)
    {
        //Play the audio file
        alSourcePlay(source);
        printf("play2\n");
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
    return (int)time;
}


void Audio::setPosition(int pos)
{
    ALfloat time=(ALfloat)pos;
    alSourcef(source, AL_SEC_OFFSET, time);
    uint error;
    if((error=alGetError()) != AL_NO_ERROR)
        printf("Audio.cpp: set Position error: %d\n", error);
}

void Audio::changeVolume(float volume){
    ALfloat v=volume;
    alSourcef(source,AL_GAIN,v);
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
    
    return (int)seconds;
}

bool Audio::hasFailed()
{
    return failed;
}
