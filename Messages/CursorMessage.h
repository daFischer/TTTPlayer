/* 
 * File:   CursorMessage.h
 * Author: user
 *
 * Created on July 26, 2014, 12:07 PM
 */

#ifndef CURSORMESSAGE_H
#define	CURSORMESSAGE_H

#include "Message.h"
#include "../ColorConverter.h"
#include <SDL/SDL.h>
#include <stdio.h>

using namespace std;

class CursorMessage : public Message{
public:
    CursorMessage(int timestamp, int encoding, Inflater* in, int size);
    ~CursorMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    static SDL_Rect getMask();
    
    static SDL_Rect mask;
    static int hotX,hotY;
    static SDL_Surface* cursor;
    static bool showCursor;
    
private:
    void handleCursorShapeUpdate();
    
    short x,y,w,h;
    SizedArray* data;
};

#endif	/* CURSORMESSAGE_H */

