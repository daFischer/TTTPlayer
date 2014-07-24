/* 
 * File:   IndexEntry.cpp
 * Author: user
 * 
 * Created on July 24, 2014, 12:54 AM
 */

#include <SDL/SDL_video.h>

#include "IndexEntry.h"

IndexEntry::IndexEntry(char* title, int timestamp, SizedArray* searchable, SDL_Surface* image) {
    this->title=title;
    this->timestamp=timestamp;
    this->searchable=searchable;
    this->image=image;
}

IndexEntry::~IndexEntry() {
    SDL_FreeSurface(image);
}

SDL_Rect IndexEntry::getRect(SDL_Surface* screen, int x, int y) {
    SDL_Rect r= {max(0,min(screen->w-image->w,x-image->w/2)),y-image->h,image->w,image->h};
    return r;
}

void IndexEntry::paintAt(SDL_Surface* screen, int x, int y) {
    SDL_Rect rect = getRect(screen,x,y);
    SDL_UpdateRect(screen, rect.x,rect.y,rect.w,rect.h);
    SDL_BlitSurface(image,NULL,screen,&rect);
}
