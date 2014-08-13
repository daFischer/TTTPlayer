/* 
 * File:   RawMessage.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 14, 2014, 11:38 AM
 */

#include "RawMessage.h"

ColorConverter RawMessage::con;

RawMessage::RawMessage(int timestamp, Inflater* in, int size) {
    this->timestamp=timestamp;
    in->readShort(&x);
    in->readShort(&y);
    in->readShort(&w);
    in->readShort(&h);
    data=new SizedArray(size-8);
    in->readSizedArray(data);
}

RawMessage::~RawMessage() {
    delete data;
}

bool RawMessage::completeScreen(int w, int h){
    return (this->w==w && this->h==h);
}

void RawMessage::paint(SDL_Surface* screen, ProtocolPreferences* prefs){
    handleRawRect(screen,prefs);
    //printf("Drawn RawMessage at {%d, %d, %d, %d}\n",x,y,w,h);
}

void RawMessage::handleRawRect(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    SDL_Rect rect = {0, 0, 1, 1};
    
    switch (prefs->bytesPerPixel) {
        case 1:
        {
            for (int dy = y; dy < y + h; dy++) {
                //is.readFully(graphicsContext.pixels8, dy * graphicsContext.prefs->framebufferWidth + x, w);
                read((char*)(screen->pixels)+dy * prefs->framebufferWidth + x,w);

                /*// buffering          TODO:?
                if (os != null)
                    os.write(graphicsContext.pixels8, dy * graphicsContext.prefs->framebufferWidth + x, w);*/
            }
            break;
        }
        case 2:
        {
            unsigned char rawColor[prefs->bytesPerPixel];
            uint color;
            if (prefs->bigEndian)
                for (int dy = y; dy < y + h; dy++)
                {
                    for(int dx = 0; dx < w; dx++)
                    {
                        read((char*)rawColor, prefs->bytesPerPixel);
                        color = con.decodeColor(rawColor,prefs->bytesPerPixel,prefs->format);
                        rect.x = dx + x;
                        rect.y = dy;
                        SDL_FillRect(screen, &rect, color);
                    }
                }
            else
                for (int dy = y; dy < y + h; dy++)
                {
                    for(int dx = 0; dx < w; dx++)
                    {
                        read((char*)rawColor, prefs->bytesPerPixel);
                        color = con.decodeColor(rawColor,prefs->bytesPerPixel,prefs->format);
                        rect.x = dx + x;
                        rect.y = dy;
                        SDL_FillRect(screen, &rect, color);
                    }
                }
            break;
        }
        default:
        {
            /*char buf[w * 4];
            for (int dy = y; dy < y + h; dy++) {
                read(buf,w*4);

                /*//* buffering
                if (os != null)
                    os.write(buf);*//*

                int offset = dy * prefs->framebufferWidth + x;
                if (prefs->bigEndian)
                    for (int i = 0; i < w; i++)
                        (int*)(screen->pixels)[offset + i] = (buf[i * 4 + 1] & 0xFF) << 16 | (buf[i * 4 + 2] & 0xFF) << 8 | (buf[i * 4 + 3] & 0xFF);
                else
                    for (int i = 0; i < w; i++)
                        (int*)(screen->pixels)[offset + i] = (buf[i * 4 + 2] & 0xFF) << 16 | (buf[i * 4 + 1] & 0xFF) << 8 | (buf[i * 4] & 0xFF);
            }*/
            break;
        }
    }
}

bool RawMessage::read(char* dest, int n){
    for(int i = 0; i < n; i++)
    {
        if(offSet>=data->length)
        {
            //printf("failed\n");
            return false;
        }
        dest[i]=data->array[offSet];
        offSet++;
    }
    return true;
}

int RawMessage::getArea() {
    return w*h;
}
