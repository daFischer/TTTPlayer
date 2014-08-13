/* 
 * File:   FreehandAnnotation.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 27, 2014, 5:30 PM
 */

#include <list>

#include "FreehandAnnotation.h"

Point::Point(short x, short y) {
    this->x = x;
    this->y = y;
}

FreehandAnnotation::FreehandAnnotation(int timestamp, Inflater* in) {
    this->timestamp=timestamp;
    in->readByte(&color);
    
    short number;
    short x;
    short y;
    mask.x=250; mask.y=100; mask.w=100; mask.h=50;
    in->readShort(&number);
    for(int i=0;i<number;i++)
    {
        in->readShort(&x);
        in->readShort(&y);
        points.push_back(new Point(x,y));
    }
}

void FreehandAnnotation::draw(SDL_Surface* screen, ProtocolPreferences* prefs) {
    //printf("Draw FreehandAnnotation\n");
    
    std::list<Point*>::iterator it=points.begin();
    short startX,startY,endX,endY;
    SDL_Rect pixel={startX,startY,2,2};
    
    for(int i=0;i<points.size()-1;i++){
        //printf("(%d,%d) - ",startX,startY);
        startX=(*it)->x;
        startY=(*it)->y;
        it++;
        endX=(*it)->x;
        endY=(*it)->y;
        
        drawLine(screen,ColorConverter::getAnnotationColor(color,ProtocolPreferences::format),startX,startY,endX,endY);
    }
    SDL_UpdateRect(screen,0,0,screen->w,screen->h);
}

FreehandAnnotation::~FreehandAnnotation() {
    while(points.size()>0){
        delete(points.front());
        points.pop_front();
    }
}

