/* 
 * File:   DeleteAllAnnotation.cpp
 * Author: user
 * 
 * Created on June 5, 2014, 3:35 PM
 */

#include "DeleteAllAnnotation.h"
#include "Annotation.h"

DeleteAllAnnotation::DeleteAllAnnotation(int timestamp) {
    this->timestamp=timestamp;
}

DeleteAllAnnotation::~DeleteAllAnnotation() {
}

void DeleteAllAnnotation::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    //printf("delete all annotations\n");
    mustRedraw=true;
    annotations.clear();
}

bool DeleteAllAnnotation::completeScreen(int w, int h){
    return true;
}
