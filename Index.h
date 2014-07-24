/* 
 * File:   Index.h
 * Author: user
 *
 * Created on July 23, 2014, 10:10 PM
 */

#ifndef INDEXEXTENSION_H
#define	INDEXEXTENSION_H

#include <stdio.h>
#include <list>
#include <SDL/SDL.h>
#include <SDL/SDL_image.h>
#include <iostream>
#include <fstream>
#include "IndexEntry.h"
#include "Inflater.h"
#include "Messages/Message.h"

using namespace std;

class Index {
public:
    Index(Inflater* in, int numBytes);
    Index(Message**, int numMessages);
    virtual ~Index();
    IndexEntry* lastBefore(int timestamp);
    
private:
    SDL_Surface* readThumbnail(Inflater* in, int* numBytes);
    list<IndexEntry*> index;
};

#endif	/* INDEXEXTENSION_H */

