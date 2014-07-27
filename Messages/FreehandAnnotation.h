/* 
 * File:   FreehandAnnotation.h
 * Author: user
 *
 * Created on July 27, 2014, 5:30 PM
 */

#ifndef FREEHANDANNOTATION_H
#define	FREEHANDANNOTATION_H

#include "Annotation.h"

struct Point{
    short x,y;
    Point(short x, short y);
};

class FreehandAnnotation : public Annotation{
public:
    FreehandAnnotation(int timestamp, Inflater* in);
    virtual ~FreehandAnnotation();
    void draw(SDL_Surface *screen, ProtocolPreferences* prefs);
    
private:
    list<Point*> points;
    SDL_Rect mask;
    char color;
};

#endif	/* FREEHANDANNOTATION_H */

