/* 
 * File:   Controls.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 13, 2014, 6:40 PM
 */

#include "Controls.h"
#include "Video.h"
#include "Player.h"

bool mouseOnFullScreenButton;
bool mouseOnPlayButton;

Controls::Controls(Video* video, AudioInterface* audio) {
    this->video=video;
    this->audio=audio;
    
    duration=audio->getDuration();
    ProtocolPreferences prefs;
    progress=0;
    
    //TODO: maybe make these relative to the screen's height
    timeLineHeight=16;
    height=timeLineHeight+32;
    
    width=prefs.framebufferWidth;
    screenHeight=prefs.framebufferHeight;
    y=screenHeight-height;
    visible=true;
    
    //In the beginning, the whole screen should be redrawn
    redefineRect(&videoUpdate,0,0,width,screenHeight);
    
    timeLineClicked=false;
    volumeClicked=false;
    volume=1;
    speedClicked=false;
    speed=1;

    mouseOnFullScreenButton=false;
    mouseOnPlayButton=false;
#ifdef EMSCRIPTEN
    //Make Fullscreen and starting the <audio> element possible
    
    EM_ASM(
        x_setupListener();
    );
#endif
    surfPlay=SDL_LoadBMP("Assets/PlayPause.bmp");
    surfVolume=SDL_LoadBMP("Assets/volume.bmp");
    surfVolume2=SDL_LoadBMP("Assets/volume2.bmp");
    surfFullscreen=SDL_LoadBMP("Assets/fullscreen.bmp");
    surfSpeed=SDL_LoadBMP("Assets/speed.bmp");
    surfSpeed2=SDL_LoadBMP("Assets/speed2.bmp");
    
    if(surfPlay==NULL||surfVolume==NULL||surfVolume2==NULL||surfFullscreen==NULL||surfSpeed==NULL||surfSpeed2==NULL)
        printf("BMPs ARE NULL\n");
}

Controls::~Controls() {
    SDL_FreeSurface(surfPlay);
    SDL_FreeSurface(surfVolume);
    SDL_FreeSurface(surfVolume2);
    SDL_FreeSurface(surfSpeed);
    SDL_FreeSurface(surfSpeed2);
    SDL_FreeSurface(surfFullscreen);
    audio=NULL;
    video=NULL;
}

/**
 * Will be called after the user presses the left mouse button
 */
void Controls::registerClick(Uint16 mx, Uint16 my){
    if(my<y)
        return;
    if(my<y+timeLineHeight)
    {
        timeLineClicked=true;
    }
    else
    {
#ifndef EMSCRIPTEN
        if(mx<48)
            togglePlay();
        else if(mx>=width-48)
            toggleFullscreen();
        else
#endif
        if(mx<=128 && mx>=64)
            volumeClicked=true;
        else if(mx<=196 && mx>=160)
            speedClicked=true;
    }
    registerMovement(mx,my);
}

/**
 * Will be called after the user releases the left mouse button
 */
void Controls::registerMouseUp(){
    if(timeLineClicked)
    {
        redefineRect(&videoUpdate,0,0,width,screenHeight-height);
        skipTo(duration/width*mouseX);
    }
    timeLineClicked=false;
    volumeClicked=false;
    speedClicked=false;
}

/**
 * Will be called whenever the mouse has moved
 */
void Controls::registerMovement(Uint16 mx, Uint16 my) {
    visible=(my>=screenHeight-height)||timeLineClicked||volumeClicked||speedClicked;
    mouseX=mx;
    mouseY=my;
    if(volumeClicked)
        changeVolume(max(min((float)(mx-64),(float)64),(float)0)/64);
    if(speedClicked)
        changeSpeed(max(min((float)(mx-160),(float)36),(float)0)/72+1);
//#ifdef EMSCRIPTEN
    mouseOnFullScreenButton=(mx>=width-48 && my>=y+timeLineHeight);
    mouseOnPlayButton=(mx<48 && my>=y+timeLineHeight);
//#endif
    
}

#ifdef EMSCRIPTEN
extern "C" bool getOnFullScreenButton(){
    return mouseOnFullScreenButton;
}

extern "C" bool getOnPlayButton(){
    return mouseOnPlayButton;
}
#endif

/**
 * When the mouse is not hovering over Controls' position, Controls moves out of the screen
 */
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
    if(surfPlay!=NULL)
    {
        if(audio->isPlaying())
            srcRect.x=48;
        else
            srcRect.x=0;
        SDL_BlitSurface(surfPlay,&srcRect,screen,&rect);
    }
    
    //volume
    if(surfVolume!=NULL && surfVolume2!=NULL)
    {
        redefineRect(&rect, 64, y+timeLineHeight, 64, 32);
        redefineRect(&srcRect,0,0,64, 32);
        SDL_BlitSurface(surfVolume2,&srcRect,screen,&rect);
        redefineRect(&srcRect,0,0,(int)(volume*64.0),32);
        redefineRect(&rect,64,y+timeLineHeight,srcRect.w,32);
        if(srcRect.w>=1)
                SDL_BlitSurface(surfVolume,&srcRect,screen,&rect);
    }
    
    //speed
    if(surfSpeed!=NULL && surfSpeed2!=NULL)
    {
        redefineRect(&rect, 160, y+timeLineHeight, 36, 32);
        redefineRect(&srcRect,0,0,36, 32);
        SDL_BlitSurface(surfSpeed2,&srcRect,screen,&rect);
        redefineRect(&srcRect,0,0,(int)(speed*72.0)-72,32);
        redefineRect(&rect,160,y+timeLineHeight,srcRect.w,32);
        if(srcRect.w>=1)
                SDL_BlitSurface(surfSpeed,&srcRect,screen,&rect);
    }
    
    //fullscreen button
    redefineRect(&rect, width-48, y+timeLineHeight, 48, height-timeLineHeight);
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
        redefineRect(&rect, (progress/1000)*width/(duration/1000), y, width-(progress/1000)*width/(duration/1000), timeLineHeight);
        SDL_FillRect(screen, &rect, emColor(0x000000));
    }
    
    int currentPosition=audio->getPosition();
    //timeLine foreground
    if(!timeLineClicked)
        redefineRect(&rect, 0, y, (currentPosition/1000)*width/(duration/1000), timeLineHeight);
    else
        redefineRect(&rect, 0, y, mouseX, timeLineHeight);
    SDL_FillRect(screen, &rect, emColor(0xaa0000));
    
    //draw "time / duration"
    SDL_Color white = {0xff,0xff,0xff,0xff};
    ostringstream oss;
    oss << (currentPosition/1000)/60 << ":" << (((currentPosition/1000)%60<10) ? "0" : "") << (currentPosition/1000)%60 << "/" << (duration/1000)/60 << ":" << (((duration/1000)%60<10) ? "0" : "") << (duration/1000)%60;
    
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
        video->drawThumbnail(duration/width*mouseX,mouseX,y);
        //draw time at cursor position
        ostringstream oss2;
        oss2 << (duration/1000)*mouseX/width/60 << ":" << ((((duration/1000)*mouseX/width)%60<10) ? "0" : "") << ((duration/1000)*mouseX/width)%60;
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

/**
 * Needed to draw the text indicating the times scaled
 * @param source source text image
 * @param x
 * @param y
 * @return Color in the source images color format
 */
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

/**
 * Font size doesn't work right with Emscripten. Therefore we have to scale it up manually
 * @param screen the target surface
 * @param text the original (small) text image
 * @param x
 * @param y
 * @param factor how strong the image should be upscaled
 */
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

void Controls::changeSpeed(float speed){
    this->speed=speed;
    audio->changeSpeed(speed);
}
