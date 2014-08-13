/* 
 * File:   DeleteAnnotation.h
 * Author: Johannes Fischer
 *
 * Created on July 14, 2014, 5:47 PM
 */

#ifndef DELETEANNOTATION_H
#define	DELETEANNOTATION_H

#include "Annotation.h"


class DeleteAnnotation : public Annotation{
public:
    DeleteAnnotation(int timestamp, Inflater* in);
    ~DeleteAnnotation();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    
private:
    short x, y;
};

#endif	/* DELETEANNOTATION_H */

