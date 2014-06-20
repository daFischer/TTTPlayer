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
    
    player=this;
    
    //Initialize BOTH SDL video and SDL audio
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO) != 0)
    {
        printf("Unable to initialize SDL: %s\n", SDL_GetError());
        return;
    }
    
    std::string filename=cfilename;
    std::string path=cpath;
    
    audio=new Audio((path+"/"+filename+"_a/"+filename).c_str());
    video=new Video((path+"/"+filename+"_a/"+filename+".ttt").c_str());
    
    if(video->failed||audio->failed)
    {
        printf("Audio failed: %s\nVideo failed: %s\n",audio->failed ? "true" : "false",video->failed ? "true" : "false");
        return;
    }
    
    audio->play();
    
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
    video->update(audio->getTime());
    
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

