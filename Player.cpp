/* 
 * File:   Player.cpp
 * Author: user
 * 
 * Created on April 30, 2014, 4:30 PM
 */

#include "Player.h"
#include "AudioJS.h"
#include "Controls.h"

Player *player;
TTF_Font* Player::font;

Player::Player(const char* cpath, const char* cfilename) {
    
    atexit(cleanUp);
    paused=false;
    
    player=this;
    
    std::string filename=cfilename;
    std::string path=cpath;
    
    //Initialize BOTH SDL video and SDL audio
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO) != 0)
    {
        printf("Unable to initialize SDL: %s\n", SDL_GetError());
        return;
    }
    
    if(TTF_Init()<0){
        printf("Unable to initialize TTF: %s\n", TTF_GetError());
        return;
    }
    
#ifdef EMSCRIPTEN
    font = TTF_OpenFont("/Assets/arial.ttf",20);
#else
    font = TTF_OpenFont("/home/user/NetBeansProjects/TTTPlayer/emBuild//Assets/arial.ttf",20);
#endif
    if(font==NULL)
    {
        printf("No font\n");
        return;
    }
    
#ifdef EMSCRIPTEN
    audio=new AudioJS();
#else
    audio=new Audio((path+"/"+filename+"_a/"+filename).c_str());
#endif
    
    if(audio->hasFailed())
    {
        printf("Audio failed.\n");
        return;
    }
    
    video=new Video((path+"/"+filename+"_a/"+filename+".ttt").c_str());
#ifdef EMSCRIPTEN
    emscripten_set_main_loop(loadAsync,0,0);
#else
    while(loadAsync()){}
#endif
}

#ifdef EMSCRIPTEN
void Player::loadAsync() {
    if(player->video->loadAsync())
        return;    //continue loading
    else        //finished loading
    {
        emscripten_cancel_main_loop();
        player->videoCallback();
    }
}
#else
bool Player::loadAsync() {
    if(player->video->loadAsync())
        return true;    //continue loading
    else        //finished loading
    {
        player->videoCallback();
        return false;
    }
}
#endif

void Player::videoCallback() {
    if(video->failed)
    {
        printf("Video failed.\n");
        return;
    }
    
    controls=new Controls(video,audio);
    
    audio->togglePlay();
    
    printf("start looping\n");
#ifdef EMSCRIPTEN
    emscripten_set_main_loop(emLoop,0,0);
#else
    quit = false;
    while(true)
    {
        emLoop();
        if(quit)
            break;
        SDL_Delay(30);
    }
    if(player!=NULL)
        delete(player);
#endif
}


void Player::loop()
{
    SDL_Event event;
    while (SDL_PollEvent(&event)) 
    {
        if (event.type == SDL_KEYDOWN) {
            switch(event.key.keysym.sym) {
#ifndef EMSCRIPTEN
                case SDLK_ESCAPE:
                    quit=true;
                    return;
#endif
                default:
                    break;
            }
        }
        else if(event.type == SDL_MOUSEBUTTONDOWN && event.button.button == SDL_BUTTON_LEFT)
            controls->registerClick(event.button.x,event.button.y);
        else if(event.type == SDL_MOUSEBUTTONUP && event.button.button == SDL_BUTTON_LEFT)
            controls->registerMouseUp();
        else if(event.type == SDL_MOUSEMOTION)
            controls->registerMovement(event.motion.x,event.motion.y);
    }
    controls->update();
    
    video->update(audio->getPosition(), controls);
}

void emLoop()
{
    if(player!=NULL)
        player->loop();
}

void cleanUp(){
    if(player!=NULL)
        delete(player);
}

Player::~Player() {
    delete(video);
    video=NULL;
    delete(audio);
    audio=NULL;
    delete(controls);
    controls=NULL;
    TTF_CloseFont(font);
#ifdef EMSCRIPTEN
    emscripten_cancel_main_loop();
#else
    //function doesn't exist in emscripten for some reason
    TTF_Quit();
#endif
    SDL_Quit();
    player=NULL;
    printf("Deleted everything\n");
}

