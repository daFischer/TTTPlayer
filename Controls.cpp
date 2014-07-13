/* 
 * File:   Controls.cpp
 * Author: user
 * 
 * Created on July 13, 2014, 6:40 PM
 */

#include "Controls.h"

bool mouseOnFullScreenButton;

Controls::Controls(Video* video, AudioInterface* audio) {
    this->video=video;
    this->audio=audio;
    
    ProtocolPreferences prefs;
    
    //TODO: might make these relative to video's height
    timeLineHeight=16;
    height=32;
    
    y=prefs.framebufferHeight - height;
    width=prefs.framebufferWidth;
    
    timeLineClicked=false;
    timeLineChange=-1;
    
    volumeClicked=false;
    volume=1;

    mouseOnFullScreenButton=false;
#ifdef EMSCRIPTEN
    EM_ASM_INT({
        x_setupFullScreen($0, $1);
    }, 48, height);
#endif
}

void Controls::registerClick(Uint16 mx, Uint16 my){
    if(my<y-timeLineHeight)
        return;
    if(my<y)
    {
        timeLineClicked=true;
    }
    else
    {
        if(mx<48)
            togglePlay();
        else if(mx>=width-48)
            toggleFullscreen();
        else if(mx<=128 && mx>=64)
            volumeClicked=true;
    }
}

void Controls::registerMouseUp(){
    timeLineClicked=false;
    volumeClicked=false;
}

void Controls::registerMovement(Uint16 mx, Uint16 my) {
    if(timeLineClicked)
        timeLineChange=mx;
    if(volumeClicked)
        changeVolume(max(min((float)(mx-64),(float)64),(float)0)/64);
//#ifdef EMSCRIPTEN
        mouseOnFullScreenButton=(mx>=width-48 && my>=y);
//#endif
    
}

//#ifdef EMSCRIPTEN
extern "C" bool getOnFullScreenButton(){
    return mouseOnFullScreenButton;
}
//#endif


void Controls::update(){
    if(!timeLineClicked && timeLineChange>=0)
    {
        skipTo(audio->getDuration()*timeLineChange/width);
        timeLineChange=-1;
    }
    
    draw();
}

void Controls::togglePlay(){
    audio->togglePlay();
}

void Controls::toggleFullscreen(){
    
#ifndef EMSCRIPTEN
    video->toggleFullscreen();
#endif
    
}

void Controls::draw(){
    SDL_Surface *screen=video->getScreen();
    
    //main body
    SDL_Rect rect = {0, y, width, height};
    SDL_FillRect(screen, &rect, 0xff000000);
    
    //play/pause
    redefineRect(&rect, 0, y, 48, height);
    SDL_FillRect(screen, &rect, 0xff338844);
    
    //volume
    redefineRect(&rect, 64, y, 64, height);
    SDL_FillRect(screen, &rect, 0xff338844);
    redefineRect(&rect, 64, y, (int)(volume*64.0), height);
    SDL_FillRect(screen, &rect, 0xff0000aa);
    
    //fullscreen button
    redefineRect(&rect, width-48, y, 48, height);
    SDL_FillRect(screen, &rect, 0xff338844);
    
    //timeLine background
    redefineRect(&rect, 0, y-timeLineHeight+2, width, timeLineHeight-2);
    SDL_FillRect(screen, &rect, 0xff333333);
    
    //timeLine foreground
    redefineRect(&rect, 0, y-timeLineHeight, width*audio->getPosition()/audio->getDuration(), timeLineHeight);
    SDL_FillRect(screen, &rect, 0xffaa0000);
    
    SDL_UpdateRect(screen, 0,y-timeLineHeight,width,height+timeLineHeight); 
}

void Controls::redefineRect(SDL_Rect* rect, int x, int y, int w, int h){
    rect->x=x;
    rect->y=y;
    rect->w=w;
    rect->h=h;
}

void Controls::skipTo(int position){
    
}

void Controls::changeVolume(float volume){
    this->volume=volume;
    audio->changeVolume(volume);
}
