/* 
 * File:   Audio.cpp
 * Author: user
 * http://wiki.delphigl.com/index.php/OpenAL-Funktions%C3%BCbersicht
 * Created on April 30, 2014, 3:39 PM
 */

#include "Audio.h"

Audio::Audio(const char* path) {
    
    //settings
    playing=0;
    failed=true;
    int error;
    struct stat statbuf;
    
    if(!(device = alcOpenDevice(NULL)))
    {
        printf("no device\n");
        return;
    }
    if(!(context = alcCreateContext(device, NULL)))
    {
        printf("no context\n");
        return;
    }
    if(!alcMakeContextCurrent(context))
    {
        printf("no current\n");
        return;
    }
    if((error = alcGetError(device)) != ALC_NO_ERROR)
    {
        printf("alc error: %d\n", error);
        return;
    }
    
    alGenBuffers(1, &buffer); //Generate buffer
    alGenSources(1, &source);           //Generate source
    if(alGetError() != AL_NO_ERROR)
    {
        printf("Error (Audio)\n");
        return;
    }
    //Load our audio file from disk
    string extension[4] = {".mp3", ".mp2", ".ogg", ".wav"};
    
    ALboolean loop=false;
    string filename;
    for(int i=0;i<sizeof(extension);i++)                //try loading audio of all possible extensions
    {
        filename=path+extension[i];
        if(readAudio(filename.c_str(),extension[i]))        
        {
            printf("loaded %s\n",filename.c_str());
            break;
        }
        if(i == sizeof(extension) -1)
            alDeleteBuffers(1, &buffer);
    }
    
    //alBufferData(buffer,format,data,size,frequency);        //fill buffer with audio data
    
    alSourcei (source, AL_BUFFER, buffer);
    
    if (alGetError() != AL_NO_ERROR)
    {
        printf("Audio last error\n");
        return;
    }
    
    failed=false;
}

void Audio::play(){
    //Play the audio file
    alSourcePlay(source);
    printf("Start playing for %d ms\n",getDuration());
    
    /*if(Mix_PlayMusic(audio, 0) == -1) 
    {
        printf("Unable to play audio file: %s\n", Mix_GetError());
        return;
    }*/
    
    //The audio is playing!
    playing = 1;
    
    //startTime=0;
    
    /*printf("Setting time\n");
    if(setPosition(30)==0)
        printf("Unable to set Position\n");*/
    
    //Make sure that the finished() function is called when the audio stops playing
    //Mix_HookMusicFinished(audioFinished);
}

bool Audio::readAudio(const char* path, string type){
    
    struct stat statbuf;
    if(stat(path, &statbuf) != 0 || !S_ISREG(statbuf.st_mode))
    {
        printf("No %s file found.\n", type.c_str());
        continue;
    }
    int error;
    
    switch(type)
    {
        case ".mp3":
            return false;
            break;
        case ".mp2":
            return false;
            break;
        case ".ogg":
            return false;
            break;
        case ".wav":
            FILE* f = fopen (path , "r");
            alBufferData(buffer,format,data,size,freq);
            
            if((error = alGetError()) != AL_NO_ERROR)
            {
                printf("No %s file loaded: %d\n", type.c_str(), error);
                continue;
            }
            break;
    }
}

/*static void audioFinished()
{
    printf("Finished the Audio\n");
}

void Audio::finished()
{
    //Audio is done!
    printf("Finished the Audio2\n");
    playing = 0;
}*/

int Audio::getTime()
{
    ALfloat time;
    alGetSourcef(source, AL_SEC_OFFSET, &time);
    
    if(alGetError()!= AL_NO_ERROR)
        printf("getTime error\n");
    //printf("%f\n",(float) time);
    return (int)(time*1000);
}


bool Audio::setPosition(int time)
{
    ALfloat pos=(ALfloat)pos/1000.0;
    alSourcef(source, AL_SEC_OFFSET, pos);
    if(alGetError()== AL_NO_ERROR)
        return true;
    else
        return false;
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
