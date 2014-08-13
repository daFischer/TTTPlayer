/* 
 * File:   CursorMessage.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 26, 2014, 12:07 PM
 */

#include "CursorMessage.h"

SDL_Rect CursorMessage::mask={0,0,0,0};
int CursorMessage::hotX=0, CursorMessage::hotY=0;
SDL_Surface* CursorMessage::cursor;
bool CursorMessage::showCursor;

CursorMessage::CursorMessage(int timestamp, int encoding, Inflater* in, int size) {
    this->timestamp=timestamp;
    in->readShort(&x);
    in->readShort(&y);
    in->readShort(&w);
    in->readShort(&h);
    //printf("Created a CursorMessage %d\n", encoding);
    data=new SizedArray(size-8);
    in->readSizedArray(data);
    
    this->encoding=encoding;
    // fix tag
    // Note: RFB and TTT cursor encodings have different tags, because RFB uses 4 bytes and TTT 1 char for tag
    if(encoding==EncodingXCursor)
        this->encoding=ENCODINGTTTXCURSOR;
    else if(encoding==EncodingRichCursor)
        this->encoding=ENCODINGTTTRICHCURSOR;
    
    mask.w=max((Uint16)w,(Uint16)mask.w);
    mask.h=max((Uint16)h,(Uint16)mask.h);
    showCursor=false;
    cursor=NULL;
}

CursorMessage::~CursorMessage(){
    delete(data);
    data=NULL;
}

SDL_Rect CursorMessage::getMask() {
    SDL_Rect r={mask.x-hotX,mask.y-hotY,mask.w,mask.h};
    return r;
}

void CursorMessage::paint(SDL_Surface* screen, ProtocolPreferences* prefs) {
    //printf("CursorMessage 1, encoding = %d\n",encoding);
    if(cursor==NULL)
    {
        cursor = SDL_CreateRGBSurface(screen->flags, mask.w, mask.h, screen->format->BitsPerPixel, screen->format->Rmask, screen->format->Gmask, screen->format->Bmask, 0xffffffff-screen->format->Rmask-screen->format->Gmask-screen->format->Bmask);
    }
    showCursor=true;
    hotX=x;
    hotY=y;
    
    SDL_LockSurface(cursor);
    memset(cursor->pixels,0x0,cursor->w*cursor->h*cursor->format->BytesPerPixel);
    SDL_UnlockSurface(cursor);
    handleCursorShapeUpdate();
    //printf("CursorMessage last\n");
}

void CursorMessage::handleCursorShapeUpdate() {
    if (w * h == 0)
    {
        printf("Useless Cursor Shape\n");
        return;
    }
    
    SDL_Rect pixel={0,0,1,1};
    
    int bytesPerRow = (w + 7) / 8;
    int bytesMaskData = bytesPerRow * h;
    
    // Decode cursor pixel data.
    int offset=0;

    if (encoding == EncodingXCursor || encoding == ENCODINGTTTXCURSOR) {
        // Read foreground and background colors of the cursor.
        char* rgb = data->array;
        offset+=6;

        int colors[] = { (0xFF000000 | (rgb[3] & 0xFF) << 16 | (rgb[4] & 0xFF) << 8 | (rgb[5] & 0xFF)),
                (0xFF000000 | (rgb[0] & 0xFF) << 16 | (rgb[1] & 0xFF) << 8 | (rgb[2] & 0xFF)) };

        // Read pixel and mask data.
        char* pixBuf = data->array + offset;
        offset+=bytesMaskData;
        char* maskBuf = data->array + offset;
        offset+=bytesMaskData;

        /*if (buffer != null) { // buffering
            buffer.write(rgb);
            buffer.write(pixBuf);
            buffer.write(maskBuf);
        }*/

        // Decode pixel data into softCursorPixels[].
        char pixByte, maskByte;
        int x, y, n, result;
        int i = 0;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w / 8; x++) {
                pixByte = pixBuf[y * bytesPerRow + x];
                maskByte = maskBuf[y * bytesPerRow + x];
                for (n = 7; n >= 0; n--) {
                    if (((maskByte >> n) & 1) != 0) {
                        pixel.x = x * 8 + 7 - n;
                        pixel.y = y;
                        SDL_FillRect(cursor,&pixel,(Uint32)colors[(pixByte >> n) & 1]);
                        //result = colors[pixByte >> n & 1];
                    }
                    //graphicsContext.softCursorPixels[i++] = result;
                }
            }
            for (n = 7; n >= 8 - w % 8; n--) {
                if (((maskBuf[y * bytesPerRow + x] >> n) & 1) != 0) {
                    pixel.x = w - w % 8 + 7 - n;
                    pixel.y = y;
                    SDL_FillRect(cursor,&pixel,colors[(pixByte >> n) & 1]);
                    //result = colors[pixBuf[y * bytesPerRow + x] >> n & 1];
                }
            }
        }

    } else if (encoding == EncodingRichCursor || encoding == ENCODINGTTTRICHCURSOR) {

        // Read pixel and mask data.
        char* pixBuf = data->array + offset;
        offset+=w * h * ProtocolPreferences::bytesPerPixel;
        char* maskBuf = data->array + offset;
        offset+=bytesMaskData;

        /*if (buffer != null) { // buffering
            buffer.write(pixBuf);
            buffer.write(maskBuf);
        }*/

        // Decode pixel data into softCursorPixels[].
        char maskByte;
        int x, y, n, result;
        int i = 0;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w / 8; x++) {
                maskByte = maskBuf[y * bytesPerRow + x];
                for (n = 7; n >= 0; n--) {
                    if ((maskByte >> n & 1) != 0) {
                        switch (ProtocolPreferences::bytesPerPixel) {
                        case 1:
                            //result = graphicsContext.colorModel.getRGB(pixBuf[i]);
                            result= ColorConverter::decodeColor((unsigned char*)&pixBuf[i],1,ProtocolPreferences::format);
                            break;
                        case 2:
                            //result = graphicsContext.colors[(pixBuf[i * 2 + 1] & 0xFF) | (pixBuf[i * 2] & 0xFF) << 8].getRGB();
                            result= ColorConverter::decodeColor((unsigned char*)&pixBuf[i*2],2,ProtocolPreferences::format);
                            break;
                        default:
                            result = 0xFF000000 | (pixBuf[i * 4 + 0] & 0xFF) << 16 | (pixBuf[i * 4 + 1] & 0xFF) << 8 | (pixBuf[i * 4 + 2] & 0xFF);
                        }
                    } else {
                        continue; // Transparent pixel
                    }
                    pixel.x = x * 8 + 7 - n;;
                    pixel.y = y;
                    SDL_FillRect(cursor,&pixel,result);
                    //graphicsContext.softCursorPixels[i++] = result;
                }
            }
            for (n = 7; n >= 8 - w % 8; n--) {
                if ((maskBuf[y * bytesPerRow + x] >> n & 1) != 0) {
                    switch (ProtocolPreferences::bytesPerPixel) {
                    case 1:
                        result= ColorConverter::decodeColor((unsigned char*)&pixBuf[i],1,ProtocolPreferences::format);
                        break;
                    case 2:
                        result= ColorConverter::decodeColor((unsigned char*)&pixBuf[i*2],2,ProtocolPreferences::format);
                        break;
                    default:
                        result = 0xFF000000 | (pixBuf[i * 4 + 0] & 0xFF) << 16 | (pixBuf[i * 4 + 1] & 0xFF) << 8 | (pixBuf[i * 4 + 2] & 0xFF);
                    }
                } else {
                    continue; // Transparent pixel
                }
                pixel.x = w - w % 8 + 7 - n;
                pixel.y = y;
                SDL_FillRect(cursor,&pixel,result);
                //graphicsContext.softCursorPixels[i++] = result;
            }
        }
    }

    // Draw the cursor on an off-screen image.
    //graphicsContext.softCursorSource = new MemoryImageSource(w, h, graphicsContext.softCursorPixels, 0, w);
    //graphicsContext.softCursor = TTT.getInstance().createImage(graphicsContext.softCursorSource);

    // Set remaining data associated with cursor.
    /*graphicsContext.cursorWidth = w;
    graphicsContext.cursorHeight = h;
    graphicsContext.hotX = xhot;
    graphicsContext.hotY = yhot;*/

    showCursor=true;
}
