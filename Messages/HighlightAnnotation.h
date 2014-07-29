/* 
 * File:   HighlightAnnotation.h
 * Author: user
 *
 * Created on July 28, 2014, 4:26 PM
 */

#ifndef HIGHLIGHTANNOTATION_H
#define	HIGHLIGHTANNOTATION_H

#include "Annotation.h"


class HighlightAnnotation : public Annotation{
public:
    HighlightAnnotation(int timestamp, Inflater* in);
    ~HighlightAnnotation();
    void draw(SDL_Surface *screen, ProtocolPreferences* prefs);
    
private:
    char color;
};

#endif	/* HIGHLIGHTANNOTATION_H */

