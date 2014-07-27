/* 
 * File:   Annotation.h
 * Author: user
 *
 * Created on July 15, 2014, 11:00 AM
 */

#ifndef ANNOTATION_H
#define	ANNOTATION_H

#include "Message.h"
#include "../ColorConverter.h"
#include <stdio.h>

using namespace std;

class Annotation : public Message{
public:
    Annotation();
    virtual ~Annotation();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    virtual void draw(SDL_Surface *screen, ProtocolPreferences* prefs);
    short x,y,w,h;
    
    static bool mustRedraw;
    static void redraw(SDL_Surface *screen, ProtocolPreferences* prefs);
    static void drawLine(SDL_Surface *screen, Uint32 color, short startX, short startY, short endX, short endY);
    static ColorConverter con;
    static list<Annotation*> annotations;
    
protected:
    //static void addAnnotation(Annotation* annotation);
    static void deleteAnnotation(int x, int y);
    
private:

};

#endif	/* ANNOTATION_H */

