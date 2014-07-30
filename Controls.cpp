/* 
 * File:   Controls.cpp
 * Author: user
 * 
 * Created on July 13, 2014, 6:40 PM
 */

#include "Controls.h"
#include "Video.h"
#include "Player.h"

bool mouseOnFullScreenButton;

Controls::Controls(Video* video, AudioInterface* audio) {
    this->video=video;
    this->audio=audio;
    
    duration=audio->getDuration();
    ProtocolPreferences prefs;
    progress=0;
    
    //TODO: might make these relative to video's height
    timeLineHeight=16;
    height=timeLineHeight+32;
    
    width=prefs.framebufferWidth;
    screenHeight=prefs.framebufferHeight;
    y=screenHeight;
    visible=false;
    redefineRect(&videoUpdate,0,0,width,screenHeight);
    
    timeLineClicked=false;
    volumeClicked=false;
    volume=1;

    mouseOnFullScreenButton=false;
#ifdef EMSCRIPTEN
    EM_ASM(
        x_setupFullScreen();
    );
    surfPlay=SDL_LoadBMP("Assets/PlayPause.bmp");
    surfVolume=SDL_LoadBMP("Assets/volume.bmp");
    surfVolume2=SDL_LoadBMP("Assets/volume2.bmp");
    surfFullscreen=SDL_LoadBMP("Assets/fullscreen.bmp");
#else
    surfPlay=SDL_LoadBMP("/home/user/NetBeansProjects/TTTPlayer/emBuild/Assets/PlayPause.bmp");
    surfVolume=SDL_LoadBMP("/home/user/NetBeansProjects/TTTPlayer/emBuild/Assets/volume.bmp");
    surfVolume2=SDL_LoadBMP("/home/user/NetBeansProjects/TTTPlayer/emBuild/Assets/volume2.bmp");
    surfFullscreen=SDL_LoadBMP("/home/user/NetBeansProjects/TTTPlayer/emBuild/Assets/fullscreen.bmp");
#endif
    if(surfPlay==NULL||surfVolume==NULL||surfVolume2==NULL||surfFullscreen==NULL)
        printf("BMPs ARE NULL\n");
}

Controls::~Controls() {
    SDL_FreeSurface(surfPlay);
    SDL_FreeSurface(surfVolume);
    SDL_FreeSurface(surfVolume2);
    SDL_FreeSurface(surfFullscreen);
    audio=NULL;
    video=NULL;
}

void Controls::registerClick(Uint16 mx, Uint16 my){
    if(my<y)
        return;
    if(my<y+timeLineHeight)
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
    registerMovement(mx,my);
}

void Controls::registerMouseUp(){
    if(timeLineClicked)
    {
        redefineRect(&videoUpdate,0,0,width,screenHeight-height);
        skipTo(duration*mouseX/width);
    }
    timeLineClicked=false;
    volumeClicked=false;
}

void Controls::registerMovement(Uint16 mx, Uint16 my) {
    visible=(my>=screenHeight-height)||timeLineClicked||volumeClicked;
    mouseX=mx;
    mouseY=my;
    if(volumeClicked)
        changeVolume(max(min((float)(mx-64),(float)64),(float)0)/64);
//#ifdef EMSCRIPTEN
    mouseOnFullScreenButton=(mx>=width-48 && my>=y+timeLineHeight);
//#endif
    
}

//#ifdef EMSCRIPTEN
extern "C" bool getOnFullScreenButton(){
    return mouseOnFullScreenButton;
}
//#endif


void Controls::update(){
    if(visible)
    {
        if(y>screenHeight-height)
            y-=4;
        redefineRect(&videoUpdate,0,y,width,0);
    }
    else
    {
        if(y>=screenHeight)
            redefineRect(&videoUpdate,0,screenHeight,width,0);
        else
        {
            redefineRect(&videoUpdate,0,y,width,4);
            y+=4;
        }
    }
}

void Controls::togglePlay(){
    audio->togglePlay();
}

void Controls::toggleFullscreen(){
    
#ifndef EMSCRIPTEN
    video->toggleFullscreen();
#endif
    
}

void Controls::draw(SDL_Surface *screen, bool hasDrawn){
    if(y>=screenHeight)
    {
        return;
    }
    
    SDL_Rect srcRect={0,0,48,32};
    
    //main body
    SDL_Rect rect = {0, y+timeLineHeight, width, height-timeLineHeight};
    if(SDL_FillRect(screen, &rect, emColor(0x000000))==-1)
        printf("fill rect error\n");
    
    //play/pause
    redefineRect(&rect, 0, y+timeLineHeight, 48, height-timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0x338844));
    if(surfPlay!=NULL)
    {
        if(audio->isPlaying())
            srcRect.x=48;
        else
            srcRect.x=0;
        SDL_BlitSurface(surfPlay,&srcRect,screen,&rect);
    }
    
    //volume
    redefineRect(&rect, 64, y+timeLineHeight, 64, height-timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0x333333));
    redefineRect(&rect, 64, y+timeLineHeight, (int)(volume*64.0), height-timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0x00ff00));
    if(surfVolume!=NULL && surfVolume2!=NULL)
    {
        redefineRect(&rect, 64, y+timeLineHeight, 64, 32);
        redefineRect(&srcRect,0,0,64, 32);
        SDL_BlitSurface(surfVolume2,&srcRect,screen,&rect);
        redefineRect(&srcRect,0,0,(int)(volume*64.0),32);
        redefineRect(&rect,64,y+timeLineHeight,(int)(volume*64.0),32);
        if((int)(volume*64.0)>=1)
                SDL_BlitSurface(surfVolume,&srcRect,screen,&rect);
    }
    
    //fullscreen button
    redefineRect(&rect, width-48, y+timeLineHeight, 48, height-timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0x338844));
    if(surfFullscreen!=NULL)
    {
        redefineRect(&srcRect,0,0,48, 32);
        SDL_BlitSurface(surfFullscreen,&srcRect,screen,&rect);
    }
    
    //timeLine background
    redefineRect(&rect, 0, y, width, timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0x333333));
    if(progress>=0)
    {
        redefineRect(&rect, progress/1000*width/duration, y, width-progress/1000*width/duration, timeLineHeight);
        SDL_FillRect(screen, &rect, emColor(0x000000));
    }
    
    int currentPosition=audio->getPosition();
    //timeLine foreground
    if(!timeLineClicked)
        redefineRect(&rect, 0, y, currentPosition*width/duration, timeLineHeight);
    else
        redefineRect(&rect, 0, y, mouseX, timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0xaa0000));
    
    //draw "time / duration"
    SDL_Color white = {0xff,0xff,0xff,0xff};
    ostringstream oss;
    oss << currentPosition/60 << ":" << ((currentPosition%60<10) ? "0" : "") << currentPosition%60 << "/" << duration/60 << ":" << ((duration%60<10) ? "0" : "") << duration%60;
    
    SDL_Surface* times=TTF_RenderText_Solid(Player::font,oss.str().c_str(),white);
#ifdef EMSCRIPTEN
    drawScaledText(screen,times,width-64-times->w*2,y+timeLineHeight+8,2);
#else
    redefineRect(&rect,width-64-times->w,y+timeLineHeight+4,times->w+4,times->h+4);
    SDL_BlitSurface(times,NULL,screen,&rect);
#endif
    SDL_FreeSurface(times);
    
    if(mouseY>=y&&mouseY<y+timeLineHeight)
    {
        video->drawThumbnail(duration*mouseX/width*1000,mouseX,y);
        //draw time at cursor position
        ostringstream oss2;
        oss2 << duration*mouseX/width/60 << ":" << (((duration*mouseX/width)%60<10) ? "0" : "") << (duration*mouseX/width)%60;
        SDL_Color black={0,0,0,0xff};
        /*TTF_SetFontOutline(Player::font,2);
        times=TTF_RenderText_Solid(Player::font,oss2.str().c_str(),black);
        redefineRect(&rect,max(0,min(width-times->w,mouseX-times->w/2 - 2)),y-24,times->w+4,times->h+4);
        SDL_BlitSurface(times,NULL,screen,&rect);
        SDL_FreeSurface(times);
        TTF_SetFontOutline(Player::font,0);*/
        times=TTF_RenderText_Solid(Player::font,oss2.str().c_str(),white);
#ifdef EMSCRIPTEN
        drawScaledText(screen,times,max(0,min(width-times->w*2,mouseX-times->w - 2)),y,2);
#else
        redefineRect(&rect,max(0,min(width-times->w,mouseX-times->w/2 - 2)),y-3,times->w+4,times->h+4);
        SDL_BlitSurface(times,NULL,screen,&rect);
#endif
        SDL_FreeSurface(times);
    }
    
    SDL_UpdateRect(screen, 0,y,width,screenHeight-y);
    //SDL_Flip(screen);
}

Uint32 Controls::emColor(unsigned int color){
    return SDL_MapRGBA(ProtocolPreferences::format,(color & 0xff0000)>>16,(color & 0x00ff00)>>8,color & 0x0000ff,0xff);
#if EMSCRIPTEN
    unsigned int r = (color & 0xff0000)>>16;
    unsigned int g = color & 0x00ff00;
    unsigned int b = (color & 0x0000ff)<<16;
    return 0xff000000|b|g|r ;
#else
    return 0xff000000|color;
#endif
}

Uint32 Controls::readPixel(SDL_Surface* source, int x, int y){
    switch(source->format->BytesPerPixel)
    {
        case 1:
            return ((unsigned char*)source->pixels)[x+source->w*y];
        case 2:
            return ((unsigned short*)source->pixels)[x+source->w*y];
        default:
            return ((unsigned int*)source->pixels)[x+source->w*y];
    }
}

void Controls::drawScaledText(SDL_Surface* screen, SDL_Surface* text, short x, short y, char factor) {
    SDL_Rect rect={0,0,factor,factor};
    SDL_LockSurface(text);
    for(int i=0;i<text->w;i++)
        for(int j=0;j<text->h;j++)
        {
            rect.x=x+i*factor;
            rect.y=y+j*factor;
            SDL_FillRect(screen,&rect,readPixel(text,i,j));
        }
    SDL_UnlockSurface(text);
}

void Controls::redefineRect(SDL_Rect* rect, int x, int y, int w, int h){
    rect->x=x;
    rect->y=y;
    rect->w=w;
    rect->h=h;
}

void Controls::skipTo(int position){
    audio->setPosition(position);
    video->seekPosition(position, this);
}

void Controls::changeVolume(float volume){
    this->volume=volume;
    audio->changeVolume(volume);
}
