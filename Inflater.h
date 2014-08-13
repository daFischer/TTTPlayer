/* 
 * File:   Inflater.h
 * Author: Johannes Fischer
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
#include "SizedArray.h"
#include "Constants.h"

using namespace std;

#define CHUNK 32768

class Inflater {
public:
    Inflater(FILE* f);
    ~Inflater();
    bool readByte(char* Byte);
    bool readSizedArray(SizedArray* sArray);
    char* readCharArray(int length, bool end);
    bool readShort(short* s);
    bool readInt(int* s);
    //bool readLong(long* s);
    bool skipBytes(int number);
    bool endOfFile();
    long int getProgress();
    
    void addChar(char c);
    
private:
    FILE* source;
    unsigned char in[CHUNK];
    unsigned char out[CHUNK];
    int outOffset;
    int ret;
    z_stream strm;
    
    string addedChars;
    
};

#endif	/* INFLATER_H */

