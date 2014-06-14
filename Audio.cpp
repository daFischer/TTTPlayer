/* 
 * File:   Audio.cpp
 * Author: user
 * 
 * Created on April 30, 2014, 3:39 PM
 */

#include "Audio.h"

Audio::Audio(const char* path) {
    
    //settings
    audio_rate = 22050;
    audio_format = AUDIO_S16SYS;
    audio_channels = 2;
    audio_buffers = 4096;
    musicPlaying=0;
    failed=false;
    finished=true;//TODO: false
    
    //Initialize SDL_mixer with settings as above
    if(Mix_OpenAudio(audio_rate, audio_format, audio_channels, audio_buffers) != 0) 
    {
        printf("Unable to initialize audio: %s\n", Mix_GetError());
        failed=true;
        return;
    }
    /*
    //Load audio file
    string extension[6] = {".mp3", ".MP3", ".mp2", ".MP2", ".ogg"};//.wav don't work
    
    string filename;
    for(int i=0;i<sizeof(extension);i++)
    {
        filename=path+extension[i];
        music = Mix_LoadMUS(filename.c_str());
        
        if(music == NULL) 
        {
            printf("No %s file loaded: %s\n", extension[i].c_str(), Mix_GetError());
        }
        else
            break;
    }
    if(music == NULL) 
    {
        printf("Unable to load audio file.\n");
        failed=true;
        return;
    }
    */
    
}

void Audio::play(){
    //Play the audio file
    /*if(Mix_PlayMusic(music, 0) == -1) 
    {
        printf("Unable to play audio file: %s\n", Mix_GetError());
        return;
    }*/
    
    //The music is playing!
    musicPlaying = 1;
    
    startTime=0;
    
    /*printf("Setting time\n");
    if(setPosition(30)==0)
        printf("Unable to set Position\n");*/
    
    //Make sure that the finished() function is called when the music stops playing
    Mix_HookMusicFinished(audioFinished);
}

Audio::~Audio() {
    //Release the memory allocated to our music
    Mix_HaltMusic();
    Mix_FreeMusic(music);

    //Need to make sure that SDL_mixer and SDL have a chance to clean up
    Mix_CloseAudio();
}

static void audioFinished()
{
    printf("Finished the Audio\n");
}

/*void Audio::finished()
{
    //Music is done!
    printf("Finished the Audio2\n");
    musicPlaying = 0;
}*/

int Audio::getTime()
{
    //might help: http://stackoverflow.com/questions/10110905/simple-wave-generator-with-sdl-in-c
    currentTime=SDL_GetTicks();
    if(startTime==0)
        startTime=currentTime;
    //currentTime-=startTime;
    
    //printf("%d\n",currentTime);
    return currentTime;
}


int Audio::setPosition(double pos)
{
    return Mix_SetMusicPosition(pos);
}

double Audio::getDuration()
{
    //not possible with sdl, try openAL?
    return 0.0;
}
