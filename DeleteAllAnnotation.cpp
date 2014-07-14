/* 
 * File:   DeleteAllAnnotation.cpp
 * Author: user
 * 
 * Created on June 5, 2014, 3:35 PM
 */

#include "DeleteAllAnnotation.h"

DeleteAllAnnotation::DeleteAllAnnotation(int timestamp) {
    this->timestamp=timestamp;
}

DeleteAllAnnotation::~DeleteAllAnnotation() {
}

bool DeleteAllAnnotation::isEmpty(){
    return true;
}

void DeleteAllAnnotation::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    
}

bool DeleteAllAnnotation::completeScreen(int w, int h){
    return false;
}
