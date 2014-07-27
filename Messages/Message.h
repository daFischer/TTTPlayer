/* 
 * File:   Message.h
 * Author: user
 *
 * Created on May 22, 2014, 3:11 PM
 */

#ifndef MESSAGE_H
#define	MESSAGE_H

#include "../Inflater.h"
#include "../ProtocolPreferences.h"
#include "../Constants.h"
#include <stdio.h>
#include <SDL/SDL.h>
#include <list>

using namespace std;

class Message {
public:
    Message();
    virtual ~Message();
    virtual void paint(SDL_Surface *screen, ProtocolPreferences* prefs);
    virtual int getArea();
    virtual bool completeScreen(int w, int h);
    
    bool updateFlag;
    int timestamp;
    int encoding;
    char type;
    
private:
    
};

extern int number;
extern int total;
extern bool containsCursorMessages;
extern bool containsAnnotations;
extern bool containsWhiteboard;

extern list<Message*> readMessages(Inflater* in, ProtocolPreferences* prefs);
extern Message* readMessage(Inflater* in, ProtocolPreferences* prefs);
extern void setUp();

#endif	/* MESSAGE_H */

