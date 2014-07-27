/* 
 * File:   ColorConverter.h
 * Author: user
 *
 * Created on June 4, 2014, 3:55 PM
 */

#ifndef COLORCONVERTER_H
#define	COLORCONVERTER_H

#include <stdlib.h>
#include <stdio.h>
#include <SDL/SDL.h>

class ColorConverter {
public:
    ColorConverter();
    static unsigned int getAnnotationColor(int colorValue, SDL_PixelFormat* format);
    static int decodeColor(unsigned char* bytes, int byteNum, SDL_PixelFormat* format);
    //int decodeColor8(int num);
    
private:
    
    const static int White = 0;
    const static int DarkGray = 4;
    const static int Gray = 8;
    const static int LightGray = 12;
    const static int Black = 16;
    const static int Orange = 20;
    const static int Pink = 24;
    const static int Blue = 28;
    const static int Red = 32;
    const static int Green = 36;
    const static int Magenta = 40;
    const static int Yellow = 44;
    const static int Cyan = 48;
    
    static char colors[256][4];
};

#endif	/* COLORCONVERTER_H */

