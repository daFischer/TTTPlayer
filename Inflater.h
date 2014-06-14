/* 
 * File:   Inflater.h
 * Author: user
 *
 * Created on May 8, 2014, 12:46 PM
 */

#ifndef INFLATER_H
#define	INFLATER_H

#include <stdio.h>
#include <string>
#include <fstream>
#include <zlib.h>
#include <assert.h>
#include <curl/curl.h>

#include "SizedArray.h"
#include "Downloader.h"

using namespace std;

#define CHUNK 16384

class Inflater {
public:
    Inflater(Downloader* d);
    ~Inflater();
    bool readByte(char* Byte);
    bool readSizedArray(SizedArray* sArray);
    bool readCharArray(char* ByteArray, int length);
    bool readShort(short* s);
    bool readInt(int* s);
    bool readLong(long* s);
    bool endOfFile();
    
private:
    Downloader* source;
    unsigned char in[CHUNK];
    unsigned char out[CHUNK];
    int outOffset;
    int ret;
    z_stream strm;
    
};

#endif	/* INFLATER_H */
