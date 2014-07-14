/* 
 * File:   WhiteboardMessage.h
 * Author: user
 *
 * Created on May 22, 2014, 4:55 PM
 */

#ifndef WHITEBOARDMESSAGE_H
#define	WHITEBOARDMESSAGE_H

#include <SDL/SDL.h>

#include "Message.h"
#include <SDL/SDL.h>

class WhiteboardMessage : public Message {
public:
    WhiteboardMessage(int timestamp, int pageNumber, ProtocolPreferences* prefs);
    ~WhiteboardMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool completeScreen(int w, int h);
    
private:

};

#endif	/* WHITEBOARDMESSAGE_H */

