/* 
 * File:   Inflater.cpp
 * Author: Johannes Fischer
 * 
 * Created on May 8, 2014, 12:46 PM
 * 
 * Credits to http://zlib.net/zlib_how.html
 */

#include "Inflater.h"

Inflater::Inflater(FILE* f)
{
    source=f;
    outOffset=0;
    
    // allocate inflate state
    strm.zfree = Z_NULL;
    strm.zalloc = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = 0;
    strm.next_in = Z_NULL;
    ret = inflateInit(&strm);
    if (ret != Z_OK)
    {
        printf("There has been an error in Inflater (1)\n");
        return;
    }
    
    //Read CHUNK bytes from the file
    strm.avail_in = fread(in, 1, CHUNK, source);
    if (ferror(source)) {
        (void)inflateEnd(&strm);
        ret = Z_ERRNO;
    }
    
    if (strm.avail_in == 0)
        ret = Z_ERRNO;
    if (ret != Z_OK)
    {
        if(VERBOSE)
            printf("There has been an error in Inflater (2)\n");
        return;
    }
    
    strm.next_in = in;
    
    strm.avail_out = CHUNK;
    strm.next_out = out;
    
    //Inflate the read chunk and write to the char Array out
    ret = inflate(&strm, Z_NO_FLUSH);
    
    //Test for any problem that might have appeared
    assert(ret != Z_STREAM_ERROR);
    switch (ret) {
        case Z_NEED_DICT:
            ret = Z_DATA_ERROR;
        case Z_DATA_ERROR:
        case Z_MEM_ERROR:
            (void)inflateEnd(&strm);
                printf("There has been an error in Inflater (3)\n");
            return;
    }
}

Inflater::~Inflater()
{
    //clean up and return
    (void)inflateEnd(&strm);
    ret = Z_STREAM_END ? Z_OK : Z_DATA_ERROR;
    if(VERBOSE)
        printf("Inflater Endresult: %d\n",ret);
    fclose(source);
}

/**
 * inflates and reads one Char from the File
 * @param Byte The char to be filled by reading
 * @return returns Z_OK if no problem has occurred
 */
bool Inflater::readByte(char* Byte)
{
    if(addedChars.size()>0)
    {
        *Byte=addedChars[0];
        addedChars=addedChars.substr(1);
        return ret;
    }
    if (ret != Z_OK)
    {
        //There has been an error, but the function is still being called. To avoid random results we 'read' 0.
        *Byte=0;
        return Z_ERRNO;
    }
    //If all chars from the inflated chunk in the char array have been read, out has to be refilled
    while(outOffset >= CHUNK - strm.avail_out)
    {
        //If everything has been inflated already, nothing can be done anymore; return.
        if (ret == Z_STREAM_END)
            return ret;
        
        //Check whether Array in has to be refilled
        if(strm.avail_out != 0)
        {
            //Fill Array in with CHUNK bytes from the file
            strm.avail_in = fread(in, 1, CHUNK, source);
            if (ferror(source)) {
                (void)inflateEnd(&strm);
                return ret = Z_ERRNO;
            }
            if (strm.avail_in == 0)
                return ret = Z_ERRNO;
            strm.next_in = in;
        }

        strm.avail_out = CHUNK;
        strm.next_out = out;

        //Inflate a part of the char array in and write to the char array out
        ret = inflate(&strm, Z_NO_FLUSH);
        
        //Test for any problem that might have appeared
        if(ret == Z_STREAM_ERROR)
            printf("There has been an error in Inflater (4)\n");
        assert(ret != Z_STREAM_ERROR);  //state not clobbered
        switch (ret) {
            case Z_NEED_DICT:
                ret = Z_DATA_ERROR;     //and fall through
            case Z_DATA_ERROR:
            case Z_MEM_ERROR:
                (void)inflateEnd(&strm);
                return ret;
        }
        outOffset=0;
    }
    *Byte = out[outOffset];
    outOffset++;
    
    return ret;
}

/**
 * Fills a SizedArray with as many Chars as memory has been reserved
 * The SizedArray has to be initialized beforehand
 * @param sArray Pointer to the SizedArray
 * @return returns Z_OK if successful
 */
bool Inflater::readSizedArray(SizedArray* sArray)
{
    bool r;
    for(int i=0; i<sArray->length; i++)
    {
        r=readByte(sArray->array+i);
        if(r!=Z_OK)
            return r;
    }
    return Z_OK;
}

/**
 * mallocs and fills a char array
 * @param length how many bytes have to be read
 * @param end if this is true, the char array ends with \0 (malloced bytes are [length]+1 in that case)
 * @return Pointer to the char Array
 */
char* Inflater::readCharArray(int length, bool end)
{
    bool r;
    char* byteArray=(char*)malloc(length+ (end ? 1 : 0));
    for(int i=0;i<length;i++)
    {
        r=readByte(&(byteArray[i]));
        if(r!=Z_OK)
        {
            printf("Inflater error: %x\n",r);
            free(byteArray);
            return NULL;
        }
    }
    if(end)
        byteArray[length]=0;
    return byteArray;
}

bool Inflater::readShort(short* s)
{
    bool r;
    char* pointer=(char*)s;
    for(int i=1; i>=0; i--)
    {
        r=readByte(&(pointer[i]));
        if(r!=Z_OK)
            return r;
    }
    return Z_OK;
}

bool Inflater::readInt(int* s)
{
    bool r;
    char* pointer=(char*)s;
    for(int i=3; i>=0; i--)
    {
        r=readByte(&(pointer[i]));
        if(r!=Z_OK)
            return r;
    }
    return Z_OK;
}

bool Inflater::skipBytes(int number) {
    bool r;
    char waste;
    for(int i=0;i<number;i++)
    {
        r=readByte(&waste);
        if(r!=Z_OK)
        {
            return r;
        }
    }
    return r;
}

/**
 * If too many chars have been read, this can be used to give them back.
 * @param c
 */
void Inflater::addChar(char c) {
    addedChars+=c;
}

long int Inflater::getProgress() {
    return ftell(source);
}

bool Inflater::endOfFile(){
    return ret!=Z_OK;
}