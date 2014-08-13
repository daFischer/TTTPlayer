/* 
 * File:   LineAnnotation.h
 * Author: Johannes Fischer
 *
 * Created on July 27, 2014, 10:35 AM
 */

#ifndef LINEANNOTATION_H
#define	LINEANNOTATION_H

//#include "Message.h"
#include "../ColorConverter.h"
#include "Annotation.h"
#include <stdio.h>
#include <SDL/SDL.h>

using namespace std;

class LineAnnotation : public Annotation{
public:
    LineAnnotation(int timestamp, Inflater* in);
    virtual ~LineAnnotation();
    void draw(SDL_Surface *screen, ProtocolPreferences* prefs);
    
private:

    char color;
    short startX,startY,endX,endY;
};

#endif	/* LINEANNOTATION_H */

