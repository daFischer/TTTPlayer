/* 
 * File:   WhiteboardMessage.cpp
 * Author: user
 * 
 * Created on May 22, 2014, 4:55 PM
 */

#include "WhiteboardMessage.h"

WhiteboardMessage::WhiteboardMessage(int timestamp, int pageNumber, ProtocolPreferences* prefs) {
    this->timestamp=timestamp;
}

WhiteboardMessage::~WhiteboardMessage() {
    
}

void WhiteboardMessage::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    printf("paint Whiteboard\n");
    SDL_Rect rect = {0,0,screen->w,screen->h};
    SDL_FillRect(screen, &rect, 0xffffffff);
    SDL_UpdateRect(screen, 0,0,screen->w,screen->h);
}

bool WhiteboardMessage::completeScreen(int w, int h){
    return true;
}

int WhiteboardMessage::getArea(){
    return ProtocolPreferences::framebufferWidth*ProtocolPreferences::framebufferHeight;
}