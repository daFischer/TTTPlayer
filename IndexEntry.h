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
    void paintAt(SDL_Surface* screen, int x, int y);
    
    int timestamp;
    
private:
    char* title;
    SizedArray* searchable;
    SDL_Surface* image;
};

#endif	/* INDEXENTRY_H */

