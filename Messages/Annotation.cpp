/* 
 * File:   Annotation.cpp
 * Author: user
 * 
 * Created on July 15, 2014, 11:00 AM
 */

#include "Annotation.h"

ColorConverter Annotation::con;
bool Annotation::mustRedraw=false;
list<Annotation*> Annotation::annotations;

Annotation::Annotation() {
}

Annotation::~Annotation() {
}

void Annotation::paint(SDL_Surface* screen, ProtocolPreferences* prefs) {
    annotations.push_back(this);
    
    //try to avoid useless drawing
    if(!mustRedraw)
        draw(screen,prefs);
}

void Annotation::draw(SDL_Surface* screen, ProtocolPreferences* prefs) {

}


void Annotation::redraw(SDL_Surface *screen ,ProtocolPreferences *prefs) {
    //refresh screen
    printf("redraw Annotations\n");
    SDL_Rect rect={0,0,screen->w,screen->h};
    SDL_FillRect(screen,&rect,0x00000000);
    SDL_UpdateRect(screen,0,0,rect.w,rect.h);
    
    //redraw all active Annotations
    for(list<Annotation*>::iterator it = annotations.begin(); it!= annotations.end(); it++)
        (*it)->draw(screen,prefs);
}

/*void Annotation::addAnnotation(Annotation* annotation) {
    annotations.push_back(&annotation);
}*/

struct condRemove{
    int x,y;
    bool operator() (Annotation* annotation){
        return (annotation->x==x && annotation->y==y);
    }
};

void Annotation::deleteAnnotation(int x, int y) {
    condRemove condition;
    condition.x=x;
    condition.y=y;
    annotations.remove_if(condition);
}
