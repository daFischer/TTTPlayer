/* 
 * File:   HextileMessage.cpp
 * Author: user
 * 
 * Created on May 22, 2014, 7:08 PM
 */

#include "HextileMessage.h"

uint HextileMessage::hextile_bg, HextileMessage::hextile_fg;
ColorConverter HextileMessage::con;

HextileMessage::HextileMessage(int timestamp, Inflater* in, int size) {
    this->timestamp=timestamp;
    in->readShort(&x);
    in->readShort(&y);
    in->readShort(&w);
    in->readShort(&h);
    data=new SizedArray(size-8);
    in->readSizedArray(data);
    
    hextile_bg=0;
    hextile_fg=0;
}

HextileMessage::~HextileMessage() {
    delete data;
}

void HextileMessage::paint(SDL_Surface *screen, ProtocolPreferences* prefs)
{
    //printf("paint Hextile\n");
    offSet=0;
    
    //printf("%s%d\n",test.c_str(), data->length);
    
    // scan hextiles
    for (int ty = y; ty < y + h; ty += 16) {
        int th = 16;
        if (y + h - ty < 16)
            th = y + h - ty;

        for (int tx = x; tx < x + w; tx += 16) {
            int tw = 16;
            if (x + w - tx < 16)
                tw = x + w - tx;
            //printf("{%d,%d}\n",tx,ty);
            handleHextileSubrect(screen, prefs, tx, ty, tw, th);
        }
    }
    //printf("(%d,%d)(%d,%d)\n",x,y,w,h);
    //printf("%d\n",data->length-offSet);
    SDL_UpdateRect(screen, x,y,w,h); 
}

void HextileMessage::handleHextileSubrect(SDL_Surface *screen, ProtocolPreferences* prefs, int tx, int ty, int tw, int th)
{
    unsigned char subencoding;
    read((char*)&subencoding,1);
    //printf("test2 %d\n", subencoding);
    /*// buffering      TODO:
    if (os != null)
        os.writeByte(subencoding);*/
    
    // Is it a raw-encoded sub-rectangle?
    if ((subencoding & HextileRaw) != 0) {
        //printf(".");
        handleRawRect(screen, prefs, tx, ty, tw, th);
        return;
    }
    //printf("|");
    // Read and draw the background if specified.
    ColorConverter con;
    
    unsigned char cbuf[prefs->bytesPerPixel];

    if ((subencoding & HextileBackgroundSpecified) != 0) {
        read((char*)cbuf,prefs->bytesPerPixel);

        /*// buffering
        if (os != null)
            os.write(cbuf);*/

        // store encoded background color
        /*for(int i=0;i<prefs->bytesPerPixel;i++)
            *((char*)(&hextile_bg)+i)=cbuf[i];*/
        hextile_bg=con.decodeColor(cbuf, prefs->bytesPerPixel, prefs->format);
    }
    //printf("test4\n");
    
    SDL_Rect rect = {tx, ty, tw, th};
    SDL_FillRect(screen, &rect, hextile_bg);

    // Read the foreground color if specified.
    if ((subencoding & HextileForegroundSpecified) != 0) {
        read((char*)cbuf,prefs->bytesPerPixel);

        /*// buffering          TODO:
        if (os != null)
            os.write(cbuf);*/

        // store encoded foreground color
        /*for(int i=0;i<prefs->bytesPerPixel;i++)
            *((char*)(&hextile_fg)+i)=cbuf[i];*/
        hextile_fg=con.decodeColor(cbuf, prefs->bytesPerPixel, prefs->format);
    }

    // Done with this tile if there is no sub-rectangles.
    if ((subencoding & HextileAnySubrects) == 0)
        return;

    unsigned int nSubrects = 0;
    read((char*)(&nSubrects), 1);
    int bufsize = nSubrects * 2;
    //printf("%d,",nSubrects);

    if ((subencoding & HextileSubrectsColoured) != 0) {
        bufsize += nSubrects * prefs->bytesPerPixel;
    }
    //printf("test6 %d<%d\n", nSubrects, bufsize);
    unsigned char buf[bufsize];
    read((char*)buf,bufsize);

    /*// buffering      TODO:
    if (os != null) {
        os.writeByte(nSubrects);
        os.write(buf);
    }*/

    int b1, b2, sx, sy, sw, sh;
    int i = 0;
    
    for (int j = 0; j < nSubrects; j++) {
        if ((subencoding & HextileSubrectsColoured) != 0) {
            // store encoded foreground color
            /*for(int k=0;k<prefs->bytesPerPixel;k++)
                *((char*)(&hextile_fg)+k)=buf[k+i];*/
            hextile_fg=con.decodeColor(&buf[i], prefs->bytesPerPixel, prefs->format);

            i += prefs->bytesPerPixel;
        }
        // decode subrect
        b1 = buf[i++] & 0xFF;
        b2 = buf[i++] & 0xFF;
        sx = tx + (b1 >> 4);
        sy = ty + (b1 & 0xf);
        sw = (b2 >> 4) + 1;
        sh = (b2 & 0xf) + 1;

        SDL_Rect rect = {sx, sy, sw, sh};
        SDL_FillRect(screen, &rect, hextile_fg);
    }
}

void HextileMessage::handleRawRect(SDL_Surface *screen, ProtocolPreferences* prefs, int tx, int ty, int tw, int th)
{
    //printf("%d(%d)",offSet,tw);
    /*SDL_Rect rect = {tx,ty,tw,th};
    SDL_FillRect(screen, &rect, (uint)(random()%0xffffff));*/
    SDL_Rect rect = {0, 0, 1, 1};
    
    //SDL_LockSurface(screen);
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
                for (int dy = ty; dy < ty + th; dy++)
                {
                    //read((char*)screen->pixels + (dy * w + tx) * 4, tw * prefs->bytesPerPixel);
                    for(int dx = 0; dx < tw; dx++)
                    {
                        read((char*)rawColor, prefs->bytesPerPixel);
                        color = con.decodeColor(rawColor,prefs->bytesPerPixel,prefs->format);
                        rect.x = dx + tx;
                        rect.y = dy;
                        SDL_FillRect(screen, &rect, color);
                    }
                }
            else
                for (int dy = ty; dy < ty + th; dy++)
                {
                    //read((char*)screen->pixels + (dy * w + tx) * 4, tw * prefs->bytesPerPixel);
                    for(int dx = 0; dx < tw; dx++)
                    {
                        read((char*)rawColor, prefs->bytesPerPixel);
                        color = con.decodeColor(rawColor,prefs->bytesPerPixel,prefs->format);
                        rect.x = dx + tx;
                        rect.y = dy;
                        //printf("half\n");
                        SDL_FillRect(screen, &rect, color);
                        //printf("rect filled\n");
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
    //printf("try unlock\n");
    //SDL_UnlockSurface(screen);
}

int HextileMessage::getCoveredArea()
{
    return w*h;
}

bool HextileMessage::read(char* dest, int n){
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

/*uint HextileMessage::decodeColor(char* colorField, ProtocolPreferences* prefs){
    int color = 0;
    for (int i = 0, shift = 0; i < prefs->bytesPerPixel; i++, shift += 8) {
        color += (colorField[i] & 0xFF) << shift;
    }
    
    ColorConverter con;
    switch (prefs->bitsPerPixel) {
        case 16:
            if (prefs->bigEndian)
                // 16 bit big endian: swap bytes
                color = (color & 0xFF) << 8 | ((color & 0xFF00) >> 8);
            // use color table
            //return con.decodeColor16(color);
        case 8:
            // use color table
            return con.decodeColor8(color);
        default:
            // use default color
            if (prefs->bigEndian) {
                // 24 bit big endian: swap bytes
                color = (color & 0xFF) << 24 | (color >> 8 & 0xFF) << 16 | (color >> 16 & 0xFF) << 8 | color >> 24
                        & 0xFF;
            }
            return color;
    }
}
*/
