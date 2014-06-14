/* 
 * File:   ColorConverter.cpp
 * Author: user
 * 
 * Created on June 4, 2014, 3:55 PM
 */

#include "ColorConverter.h"

ColorConverter::ColorConverter() {
}

int ColorConverter::decodeColor(unsigned char* bytes, int byteNum, SDL_PixelFormat* format){
    if(byteNum>=4)
    {
        printf("Tried to decode wrong color format");
        return 0x000000;
    }
    int red=0;
    for(int i=0;i<byteNum;i++)
    {
        red <<= 8;
        red+=bytes[byteNum-1-i];
    }
    int green=red;
    int blue=red;
    int color;
    if(byteNum==2)
    {
        red >>= 0;
        red = (red & 0x1f)*8;//1111 1000 0000 0000
        green >>= 5;
        green = (green & 0x1f)*8;//0000 0111 1100 0000
        blue >>= 10;
        blue = (blue & 0x3f)*4;//0000 0000 0011 1111
        
        color=SDL_MapRGB(format, (Uint8) red, (Uint8) green, (Uint8) blue);
        //printf("color: %d.%d.%d => %d\n",red,green,blue,color);
        //1111 1100 0010 0000
        //
    }
    else//byteNum==1
    {
        color= (int)(colors[bytes[0]][0]);
    }
    return color;
}

int ColorConverter::decodeColor8(int num){
    int color= (int)(colors[num][0]);
    return color;
}

void ColorConverter::getAnnotationColor(int colorValue, char* red, char* green, char* blue, char* alpha){
    
    *red = colors[colorValue][0];
    *green = colors[colorValue][1];
    *blue = colors[colorValue][2];
    *alpha = colors[colorValue][3];
}

