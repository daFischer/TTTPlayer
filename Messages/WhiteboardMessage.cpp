/* 
 * File:   WhiteboardMessage.cpp
 * Author: user
 * 
 * Created on May 22, 2014, 4:55 PM
 */

#include "WhiteboardMessage.h"
SDL_Surface* WhiteboardMessage::numberSurface;
int WhiteboardMessage::number;

WhiteboardMessage::WhiteboardMessage(int timestamp, int pageNumber, ProtocolPreferences* prefs) {
    this->timestamp=timestamp;
    this->pageNumber=pageNumber;
    number=-1;
}

WhiteboardMessage::~WhiteboardMessage() {
    if(number==pageNumber)
    {
        number=-1;
        SDL_FreeSurface(numberSurface);
        numberSurface=NULL;
    }
}

void WhiteboardMessage::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    //printf("paint Whiteboard at %d\n",timestamp);
    mustRedraw=true;
    annotations.clear();
    if(pageNumber>0)
    {
        if(number!=-1)
            SDL_FreeSurface(numberSurface);
        ostringstream oss;
        oss << "#" << pageNumber;
        SDL_Color color = {0,0,0,0xff};
        numberSurface=TTF_RenderText_Solid(Player::font,oss.str().c_str(),color);
        lastWhiteboard=this;
        number=pageNumber;
    }
    else
        number=min(number,pageNumber);
}

void WhiteboardMessage::draw(SDL_Surface* screen, ProtocolPreferences* prefs) {
    SDL_Rect rect={ProtocolPreferences::framebufferWidth-20-numberSurface->w,20,numberSurface->w,numberSurface->h};
    SDL_BlitSurface(numberSurface,NULL,screen,&rect);
}

bool WhiteboardMessage::completeScreen(int w, int h){
    return true;
}

int WhiteboardMessage::getArea(){
    return ProtocolPreferences::framebufferWidth*ProtocolPreferences::framebufferHeight;
}