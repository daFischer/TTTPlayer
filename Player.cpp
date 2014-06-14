/* 
 * File:   Player.cpp
 * Author: user
 * 
 * Created on April 30, 2014, 4:30 PM
 */

#include "Player.h"

Player *player;

Player::Player(const char* cpath, const char* cfilename) {
    
    paused=false;
    progress=0;
    player=this;
    
    //Initialize BOTH SDL video and SDL audio
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO) != 0)
    {
        printf("Unable to initialize SDL: %s\n", SDL_GetError());
        return;
    }
    
    std::string filename=cfilename;
    std::string path=cpath;
    
    downloader = new Downloader((char*) (path+"/"+filename+"_a/"+filename+".ttt").c_str());
    video=new Video(downloader);
    audioURL=(path+"/"+filename+"_a/"+filename);
    
    printf("start looping\n");
#ifdef EMSCRIPTEN
    emscripten_set_main_loop(emLoop,30,1);
#else
    quit = false;
    while(true)
    {
        emLoop();
        if(quit)
            break;
        SDL_Delay(30);
    }
#endif
}


void Player::loop()
{
    switch(progress)
    {
        case 0:
            if(video->failed)
            {
                printf("Video failed\n");
                progress=-1;
                delete(downloader);
            }
            else
            if(video->isReady())
            {
                printf("Video ready\n");
                progress++;
                video->startReading();
                //downloader->retarget((char*) audioURL.c_str());
                audio=new Audio(audioURL.c_str());
            }
            break;
        case 1:
            if(audio->failed)
            {
                printf("Audio failed\n");
                progress=-1;
                delete(downloader);
            }
            else
            if(downloader->ready)
            {
                printf("both finished\n");
                progress++;
                delete(downloader);
                audio->play();
                video->update(audio->getTime());
            }
            break;
        case 2:
            video->update(audio->getTime());
            break;
    }
    
    SDL_Event event;
    while (SDL_PollEvent(&event)) 
        if (event.type == SDL_KEYDOWN) {
            switch(event.key.keysym.sym) {
#ifndef EMSCRIPTEN
                case SDLK_ESCAPE:
                    SDL_Quit();
                    quit=true;
                    break;
#endif
                default:
                    break;
            }
    }
}

void emLoop()
{
    player->loop();
}

Player::~Player() {
}

