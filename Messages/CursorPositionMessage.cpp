/* 
 * File:   CursorPositionMessage.cpp
 * Author: user
 * 
 * Created on July 27, 2014, 12:05 AM
 */

#include "CursorPositionMessage.h"

CursorPositionMessage::CursorPositionMessage(int timestamp, Inflater* in) {
    this->timestamp=timestamp;
    in->readShort(&x);
    in->readShort(&y);
}

CursorPositionMessage::~CursorPositionMessage() {
}

void CursorPositionMessage::paint(SDL_Surface* screen, ProtocolPreferences* prefs) {
    CursorMessage::mask.x=x;
    CursorMessage::mask.y=y;
}
