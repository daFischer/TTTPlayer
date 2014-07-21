/* 
 * File:   DeleteAllAnnotation.h
 * Author: user
 *
 * Created on June 5, 2014, 3:35 PM
 */

#ifndef DELETEALLANNOTATION_H
#define	DELETEALLANNOTATION_H

#include "Annotation.h"

class DeleteAllAnnotation : public Annotation {
public:
    DeleteAllAnnotation(int timestamp);
    virtual ~DeleteAllAnnotation();
    void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    bool completeScreen(int w, int h);

    
private:

};

#endif	/* DELETEALLANNOTATION_H */

