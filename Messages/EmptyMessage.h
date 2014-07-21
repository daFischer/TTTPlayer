/* 
 * File:   EmptyMessage.h
 * Author: user
 *
 * Created on May 22, 2014, 4:47 PM
 */

#ifndef EMPTYMESSAGE_H
#define	EMPTYMESSAGE_H

#include <SDL/SDL.h>
#include "Message.h"

class EmptyMessage : public Message {
public:
    EmptyMessage(int timestamp);
    ~EmptyMessage();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool isEmpty();
    bool completeScreen(int w, int h);
    
private:

};

#endif	/* EMPTYMESSAGE_H */

