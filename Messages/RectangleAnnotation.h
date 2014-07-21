/* 
 * File:   RectangleAnnotation.h
 * Author: user
 *
 * Created on July 15, 2014, 10:38 AM
 */

#ifndef RECTANGLEANNOTATION_H
#define	RECTANGLEANNOTATION_H

#include "../Inflater.h"
#include "Message.h"
#include "Annotation.h"
#include <stdio.h>

using namespace std;

class RectangleAnnotation : public Annotation{
public:
    RectangleAnnotation(int timestamp, Inflater* in);
    ~RectangleAnnotation();
    void draw(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool completeScreen(int w, int h);
    
private:

    char color;
};

#endif	/* RECTANGLEANNOTATION_H */

