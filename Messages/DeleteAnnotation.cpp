/* 
 * File:   DeleteAnnotation.cpp
 * Author: user
 * 
 * Created on July 14, 2014, 5:47 PM
 */

#include "DeleteAnnotation.h"

DeleteAnnotation::DeleteAnnotation(int timestamp, Inflater* in) {
    this->timestamp=timestamp;
    in->readShort(&x);
    in->readShort(&y);
}

DeleteAnnotation::~DeleteAnnotation() {
}

void DeleteAnnotation::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    deleteAnnotation(x,y);
    mustRedraw=true;
}
