/* 
 * File:   HextileMessage.h
 * Author: Johannes Fischer
 *
 * Created on May 22, 2014, 7:08 PM
 */

#ifndef HEXTILEMESSAGE_H
#define	HEXTILEMESSAGE_H

#include "../Inflater.h"
#include "Message.h"
#include <SDL/SDL.h>
#include "../SizedArray.h"
#include <string>
#include <stdio.h>
#include "../ColorConverter.h"

using namespace std;

class HextileMessage : public Message {
public:
    HextileMessage(int timestamp, Inflater* in, int size);
    ~HextileMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool completeScreen(int w, int h);
    int getArea();
    
private:
    void handleHextileSubrect(SDL_Surface *screen, ProtocolPreferences* prefs, int tx, int ty, int tw, int th);
    void handleRawRect(SDL_Surface *screen, ProtocolPreferences* prefs, int tx, int ty, int tw, int th);
    bool read(char* dest, int n);
    //uint decodeColor(char* bits, ProtocolPreferences* prefs);
    
    static uint hextile_bg, hextile_fg;
    static ColorConverter con;
    short x,y,w,h;
    SizedArray* data;
    int offSet;
    //string test;
};

#endif	/* HEXTILEMESSAGE_H */

