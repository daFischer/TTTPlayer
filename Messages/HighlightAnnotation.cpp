/* 
 * File:   HighlightAnnotation.cpp
 * Author: user
 * 
 * Created on July 28, 2014, 4:26 PM
 */

#include "HighlightAnnotation.h"

HighlightAnnotation::HighlightAnnotation(int timestamp, Inflater* in) {
    this->timestamp=timestamp;
    in->readByte(&color);
    
    short endX,endY;
    in->readShort(&x);
    in->readShort(&y);
    in->readShort(&endX);
    in->readShort(&endY);
    w=abs(x-endX);
    if(x>endX)
        x-=w;
    h=abs(y-endY);
    if(y>endY)
        y-=h;
}

void HighlightAnnotation::draw(SDL_Surface* screen, ProtocolPreferences* prefs) {
    //printf("draw HighlightAnnotation(%d,%d,%d,%d)\n",x,y,w,h);
    Uint32 drawColor=ColorConverter::getAnnotationColor(color,screen->format);
    SDL_Rect rect = {x,y,w,h};               //left
    SDL_FillRect(screen, &rect, drawColor);
    
    drawColor=(drawColor& ~ProtocolPreferences::format->Amask) | (ProtocolPreferences::format->Amask & (ProtocolPreferences::format->Amask>>1));
    SDL_Rect rect1 = {x-linewidth, y-linewidth, linewidth, h+2*linewidth};               //left
    SDL_FillRect(screen, &rect1, drawColor);
    SDL_Rect rect2 = {x, y-linewidth, w+linewidth, linewidth};                           //upper
    SDL_FillRect(screen, &rect2, drawColor);
    SDL_Rect rect3 = {x+w, y, linewidth, h+linewidth};                                   //right
    SDL_FillRect(screen, &rect3, drawColor);
    SDL_Rect rect4 = {x, y+h, w, linewidth};                                             //bottom
    SDL_FillRect(screen, &rect4, drawColor);
    SDL_UpdateRect(screen,x-linewidth,y-linewidth,w+2*linewidth,h+2*linewidth);
}

HighlightAnnotation::~HighlightAnnotation() {
}

