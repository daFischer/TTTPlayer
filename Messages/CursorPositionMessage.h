/* 
 * File:   CursorPositionMessage.h
 * Author: Johannes Fischer
 *
 * Created on July 27, 2014, 12:04 AM
 */

#ifndef CURSORPOSITIONMESSAGE_H
#define	CURSORPOSITIONMESSAGE_H

#include "Message.h"
#include "CursorMessage.h"

class CursorPositionMessage : public Message{
public:
    CursorPositionMessage(int timestamp, Inflater* in);
    ~CursorPositionMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    
private:

    short x,y;
};

#endif	/* CURSORPOSITIONMESSAGE_H */

