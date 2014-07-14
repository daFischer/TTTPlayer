/* 
 * File:   RawMessage.h
 * Author: user
 *
 * Created on July 14, 2014, 11:38 AM
 */

#ifndef RAWMESSAGE_H
#define	RAWMESSAGE_H

#include "Inflater.h"
#include "Message.h"
#include <SDL/SDL.h>
#include "SizedArray.h"
#include <string>
#include <stdio.h>
#include "ColorConverter.h"

class RawMessage : public Message{
public:
    RawMessage(int timestamp, Inflater* in, int size);
    ~RawMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool completeScreen(int w, int h);
    
private:
    void handleRawRect(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool read(char* dest, int n);
    
    static ColorConverter con;
    short x,y,w,h;
    SizedArray* data;
    int offSet;
};

#endif	/* RAWMESSAGE_H */

