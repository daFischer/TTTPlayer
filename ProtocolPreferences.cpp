/* 
 * File:   ProtocolPreferences.cpp
 * Author: Johannes Fischer
 * 
 * Created on May 5, 2014, 10:11 PM
 */

#include "ProtocolPreferences.h"

ProtocolPreferences::ProtocolPreferences(){
    
}

char ProtocolPreferences::versionMsg[12];
char* ProtocolPreferences::name;
short ProtocolPreferences::framebufferWidth;
short ProtocolPreferences::framebufferHeight;
char ProtocolPreferences::bitsPerPixel;
int ProtocolPreferences::bytesPerPixel;
char ProtocolPreferences::depth;
int ProtocolPreferences::preferedDepth;
bool ProtocolPreferences::bigEndian, ProtocolPreferences::trueColour;
short ProtocolPreferences::redMax, ProtocolPreferences::greenMax, ProtocolPreferences::blueMax;
char ProtocolPreferences::redShift, ProtocolPreferences::greenShift, ProtocolPreferences::blueShift;
SDL_PixelFormat* ProtocolPreferences::format;

int ProtocolPreferences::encodings[4];

bool ProtocolPreferences::ignoreCursorUpdates;

int ProtocolPreferences::starttime;
