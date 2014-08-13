/* 
 * File:   Annotation.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 15, 2014, 11:00 AM
 */

#include "Annotation.h"
#include "WhiteboardMessage.h"

ColorConverter Annotation::con;
bool Annotation::mustRedraw=false;
list<Annotation*> Annotation::annotations;
WhiteboardMessage* Annotation::lastWhiteboard =NULL;

Annotation::Annotation() {
}

Annotation::~Annotation() {
}

void Annotation::paint(SDL_Surface* screen, ProtocolPreferences* prefs) {
    //printf("Pushed Annotation at (%d, %d)\n",x,y);
    annotations.push_back(this);
    
    //try to avoid useless drawing
    if(!mustRedraw)
        draw(screen,prefs);
}

void Annotation::draw(SDL_Surface* screen, ProtocolPreferences* prefs) {

}


void Annotation::redraw(SDL_Surface *screen ,ProtocolPreferences *prefs) {
    //printf("redraw Annotations\n");
    SDL_LockSurface(screen);
    memset(screen->pixels,0,screen->w*screen->h*screen->format->BytesPerPixel);
    SDL_UnlockSurface(screen);
    
    mustRedraw=false;
    
    if(WhiteboardMessage::number>0)
        lastWhiteboard->draw(screen,prefs);
    //redraw all active Annotations
    for(list<Annotation*>::iterator it = annotations.begin(); it!= annotations.end(); it++)
        (*it)->draw(screen,prefs);
}

void Annotation::drawLine(SDL_Surface* screen, Uint32 color, short startX, short startY, short endX, short endY) {
    SDL_Rect pixel={startX-linewidth/2,startY-linewidth/2,linewidth,linewidth};
    if(startX == endX && startY == endY)
    {
        //just a point
        SDL_FillRect(screen,&pixel,color);
        return;
    }
    if(abs(startX-endX)>abs(startY-endY))
        for(int i=min(startX,endX);i<=max(startX,endX);i++)
        {
            if((startX<endX)==(startY<endY))    //down right or left up
                pixel.x=i-1;
            else                                //down left or up right
                pixel.x=startX+endX-i-1;
            pixel.y=min(startY,endY)+abs(startY-endY)*(i-min(startX,endX))/abs(startX-endX)-1;
            SDL_FillRect(screen,&pixel,color);
        }
    else
        for(int i=min(startY,endY);i<=max(startY,endY);i++)
        {
            pixel.x=min(startX,endX)+abs(startX-endX)*(i-min(startY,endY))/abs(startY-endY)-1;
            if((startX<endX)==(startY<endY))    //down right or left up
                pixel.y=i-1;
            else                                //down left or up right
                pixel.y=startY+endY-i-1;
            SDL_FillRect(screen,&pixel,color);
        }
}

struct condRemove{
    int x,y;
    bool operator() (Annotation* annotation){
        if(VERBOSE && annotation->x==x && annotation->y==y)
            printf("Deleted Annotation at position %d, %d\n",x,y);
        return (annotation->x==x && annotation->y==y);
    }
};

void Annotation::deleteAnnotation(int x, int y) {
    condRemove condition;
    condition.x=x;
    condition.y=y;
    annotations.remove_if(condition);
}
