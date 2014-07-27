/* 
 * File:   LineAnnotation.cpp
 * Author: user
 * 
 * Created on July 27, 2014, 10:35 AM
 */

#include "LineAnnotation.h"

LineAnnotation::LineAnnotation(int timestamp, Inflater* in) {
    this->timestamp=timestamp;
    in->readByte(&color);
    in->readShort(&startX);
    in->readShort(&startY);
    in->readShort(&endX);
    in->readShort(&endY);
    printf("LineAnnotation at %d\n",timestamp);
}

void LineAnnotation::draw(SDL_Surface* screen, ProtocolPreferences* prefs) {
    printf("Painted line from (%d,%d) to (%d,%d)\n",startX,startY,endX,endY);
    drawLine(screen,ColorConverter::getAnnotationColor(color,ProtocolPreferences::format),startX,startY,endX,endY);
}

LineAnnotation::~LineAnnotation() {
}

