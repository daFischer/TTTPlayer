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
    Index(Message** messages, int numMessages);
    virtual ~Index();
    IndexEntry* lastBefore(int timestamp);
    bool fillSurface(SDL_Surface* screen, Message** messages, int numMessages, ProtocolPreferences* prefs);
    bool readIndexEntry(Inflater* in);
    
private:
    //void fillSurfaces(SDL_Surface* screen, Message** messages, int numMessages, ProtocolPreferences* prefs);
    SDL_Surface* readThumbnail(Inflater* in, int* numBytes);
    list<IndexEntry*> index;
    std::list<IndexEntry*>::iterator it;
    int currentMessage;
    
    short entryNumber;
    int numBytes;
};

#endif	/* INDEXEXTENSION_H */

