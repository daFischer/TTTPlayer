/* 
 * File:   ProtocolPreferences.h
 * Author: Johannes Fischer
 *
 * Created on May 5, 2014, 10:11 PM
 */

#ifndef PROTOCOLPREFERENCES_H
#define	PROTOCOLPREFERENCES_H

#include <stdio.h>
#include <string.h>
#include <SDL/SDL.h>

#ifndef _STDIO_H
using namespace std;
#endif

class ProtocolPreferences{
public:
    ProtocolPreferences();
    static char versionMsg[12];
    static char* name;
    static short framebufferWidth;
    static short framebufferHeight;
    static char bitsPerPixel;
    static int bytesPerPixel;
    static char depth;
    static int preferedDepth;
    static bool bigEndian, trueColour;
    static short redMax, greenMax, blueMax;
    static char redShift, greenShift, blueShift;
    static SDL_PixelFormat* format;

    static int encodings[4];

    static bool ignoreCursorUpdates;
    
    static int starttime;
};

#endif	/* PROTOCOLPREFERENCES_H */

