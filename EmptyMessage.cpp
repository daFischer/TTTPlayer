/* 
 * File:   EmptyMessage.cpp
 * Author: user
 * 
 * Created on May 22, 2014, 4:47 PM
 */

#include "EmptyMessage.h"

EmptyMessage::EmptyMessage(int timestamp) {
    this->timestamp=timestamp;
}

EmptyMessage::~EmptyMessage() {
}

bool EmptyMessage::isEmpty(){
    return true;
}

void EmptyMessage::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    
}
