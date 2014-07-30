/* 
 * File:   IndexEntry.h
 * Author: user
 *
 * Created on July 24, 2014, 12:54 AM
 */

#ifndef INDEXENTRY_H
#define	INDEXENTRY_H

#include <stdio.h>
#include <SDL/SDL.h>
#include <fstream>

#include "SizedArray.h"

using namespace std;

class IndexEntry {
public:
    IndexEntry(char* title, int timestamp, SizedArray* searchable, SDL_Surface* image);
    virtual ~IndexEntry();
    SDL_Rect getRect(SDL_Surface* screen, int x, int y);
    void paintThumbnail(SDL_Surface* screen, int x, int y);
    void paintWaypoint(SDL_Surface* screen);
    void setWaypoint(SDL_Surface* waypoint);
    
    int timestamp;
    bool hasImages;
    bool hasThumbnail;
    
private:
    SDL_Surface* scaleDownSurface(SDL_Surface* source, char factor);
    
    char* title;
    SizedArray* searchable;
    SDL_Surface* thumbnail;
    SDL_Surface* waypoint;
};

#endif	/* INDEXENTRY_H */

