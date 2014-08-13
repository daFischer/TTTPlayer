/* 
 * File:   WhiteboardMessage.h
 * Author: Johannes Fischer
 *
 * Created on May 22, 2014, 4:55 PM
 */

#ifndef WHITEBOARDMESSAGE_H
#define	WHITEBOARDMESSAGE_H

//#include "Message.h"
#include "Annotation.h"
#include <SDL/SDL.h>
#include <sstream>
#include "../Player.h"

class WhiteboardMessage : public Annotation {
public:
    WhiteboardMessage(int timestamp, int pageNumber, ProtocolPreferences* prefs);
    ~WhiteboardMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    void draw(SDL_Surface* screen, ProtocolPreferences* prefs);
    bool completeScreen(int w, int h);
    int getArea();
    
    static SDL_Surface* numberSurface;
    static int number;
    
private:
    int pageNumber;
};

#endif	/* WHITEBOARDMESSAGE_H */

