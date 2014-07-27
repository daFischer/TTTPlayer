/* 
 * File:   IndexEntry.cpp
 * Author: user
 * 
 * Created on July 24, 2014, 12:54 AM
 */

#include <SDL/SDL_video.h>

#include "IndexEntry.h"
#include "ProtocolPreferences.h"

IndexEntry::IndexEntry(char* title, int timestamp, SizedArray* searchable, SDL_Surface* image) {
    this->title=title;
    this->timestamp=timestamp;
    this->searchable=searchable;
    this->image=image;
    waypoint=NULL;
    hasImages=false;
}

void IndexEntry::setWaypoint(SDL_Surface* waypoint) {
    this->waypoint=waypoint;
    if(image==NULL)
        image=scaleDownSurface(waypoint, 5);
    hasImages=true;
}

void IndexEntry::paintWaypoint(SDL_Surface* screen) {
    SDL_Rect rect = {0,0,screen->w,screen->h};
    SDL_BlitSurface(waypoint,NULL,screen,&rect);
}

IndexEntry::~IndexEntry() {
    SDL_FreeSurface(image);
    SDL_FreeSurface(waypoint);
    if(title!=NULL)
        free(title);
    delete(searchable);
}

SDL_Rect IndexEntry::getRect(SDL_Surface* screen, int x, int y) {
    if(image==NULL)
    {
        SDL_Rect r= {0,0,0,0};
        return r;
    }
    SDL_Rect r= {max(0,min(screen->w-image->w,x-image->w/2)),y-image->h,image->w,image->h};
    return r;
}

void IndexEntry::paintThumbnail(SDL_Surface* screen, int x, int y) {
    if(image==NULL)
        return;
    SDL_Rect rect = getRect(screen,x,y);
    SDL_BlitSurface(image,NULL,screen,&rect);
    SDL_UpdateRect(screen, rect.x,rect.y,rect.w,rect.h);
}

Uint32 readPixel(SDL_Surface* source, int x, int y){
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

void writePixel(SDL_Surface* target, int x, int y, Uint32 color){
    switch(target->format->BytesPerPixel)
    {
        case 1:
            ((unsigned char*)target->pixels)[x+target->w*y]=(unsigned char)color;
        case 2:
            ((unsigned short*)target->pixels)[x+target->w*y]=(unsigned short)color;
        default:
            ((unsigned int*)target->pixels)[x+target->w*y]=(unsigned int)color;
    }
}

SDL_Surface* IndexEntry::scaleDownSurface(SDL_Surface* source, char factor) {
    SDL_Surface* result=SDL_CreateRGBSurface(0,source->w/factor,source->h/factor,source->format->BitsPerPixel,source->format->Rmask,source->format->Gmask,source->format->Bmask,source->format->Amask);
    Uint32 alpha,red,green,blue;
    Uint32 color, colorPart;
    for(int i=0;i<result->w;i++)
        for(int j=0;j<result->h;j++)
        {
            color=readPixel(source,i*factor,j*factor);
            writePixel(result,i,j,color);
            /*for(int k=0;k<factor;k++)
                for(int l=0;l<factor;l++)
                {
                    readPixel(source,i+k,j+l);
                }*/
        }
    return result;
}
