/* 
 * File:   RectangleAnnotation.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 15, 2014, 10:38 AM
 */

#include "RectangleAnnotation.h"

RectangleAnnotation::RectangleAnnotation(int timestamp, Inflater* in) {
    this->timestamp=timestamp;
    in->readByte(&color);
    
    // x,y coordinates are not ordered
    short x1,y1,x2,y2;
    in->readShort(&x1);
    in->readShort(&y1);
    in->readShort(&x2);
    in->readShort(&y2);
    x=min(x1,x2);
    w=abs(x1-x2);
    y=min(y1,y2);
    h=abs(y1-y2);
}

RectangleAnnotation::~RectangleAnnotation() {
}

void RectangleAnnotation::draw(SDL_Surface *screen, ProtocolPreferences* prefs){
    
    //printf("draw RectangleAnnotation(%d,%d,%d,%d),%d\n",x,y,w,h,this->con.getAnnotationColor(color,screen->format));
    SDL_Rect rect = {x-linewidth, y-linewidth, linewidth, h+2*linewidth};               //left
    SDL_FillRect(screen, &rect, this->con.getAnnotationColor(color,screen->format));
    SDL_Rect rect2 = {x, y-linewidth, w+linewidth, linewidth};                           //upper
    SDL_FillRect(screen, &rect2, this->con.getAnnotationColor(color,screen->format));
    SDL_Rect rect3 = {x+w, y, linewidth, h+linewidth};                                   //right
    SDL_FillRect(screen, &rect3, this->con.getAnnotationColor(color,screen->format));
    SDL_Rect rect4 = {x, y+h, w, linewidth};                                             //bottom
    SDL_FillRect(screen, &rect4, this->con.getAnnotationColor(color,screen->format));
    SDL_UpdateRect(screen,x-linewidth,y-linewidth,w+2*linewidth,h+2*linewidth);
}

bool RectangleAnnotation::completeScreen(int w, int h) {
    return false;
}
