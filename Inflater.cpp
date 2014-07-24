/* 
 * File:   Inflater.cpp
 * Author: user
 * using http://zlib.net/zlib_how.html
 * 
 * Created on May 8, 2014, 12:46 PM
 */

#include "Inflater.h"

Inflater::Inflater(FILE* f)
{
    //printf("Constructor of Inflater\n");
    source=f;
    outOffset=0;
    
    // allocate inflate state
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = 0;
    strm.next_in = Z_NULL;
    ret = inflateInit(&strm);
    if (ret != Z_OK)
    {
        printf("Inflater fail 1\n");
        return;
    }
    
    strm.avail_in = fread(in, 1, CHUNK, source);        //from the outer loop of the example
    if (ferror(source)) {
        (void)inflateEnd(&strm);
        ret = Z_ERRNO;
    }
    
    if (strm.avail_in == 0)
        ret = Z_ERRNO;
    if (ret != Z_OK)
    {
        printf("Inflater fail 2\n");
        return;
    }
    
    strm.next_in = in;
    
    strm.avail_out = CHUNK;     //from the inner loop of the example
    strm.next_out = out;
    
    ret = inflate(&strm, Z_NO_FLUSH);
    assert(ret != Z_STREAM_ERROR);  //state not clobbered
    switch (ret) {
        case Z_NEED_DICT:
            ret = Z_DATA_ERROR;     //and fall through
        case Z_DATA_ERROR:
        case Z_MEM_ERROR:
            (void)inflateEnd(&strm);
                printf("Inflater fail 3\n");
            return;
    }
    //printf("Constructor of Inflater: success\n");
}

Inflater::~Inflater()
{
    //clean up and return
    (void)inflateEnd(&strm);
    ret = Z_STREAM_END ? Z_OK : Z_DATA_ERROR;
    printf("Inflater Endresult: %d\n",ret);
}

bool Inflater::readByte(char* Byte)
{
    if (ret != Z_OK)
    {
        printf("Video Inflation failed: %d\n",ret);
        return Z_ERRNO;
    }
    if(outOffset >= CHUNK - strm.avail_out)      //Array out has to be refilled
    {
        //printf("Refill Array out, %d\n", ret);
        if (ret == Z_STREAM_END)
            return ret;
        if(strm.avail_out != 0)     //Array in has to be refilled
        {
            //printf("Refill Array in\n");
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

        ret = inflate(&strm, Z_NO_FLUSH);
        if(ret == Z_STREAM_ERROR)
            printf("this assert fails\n");
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
    //printf("%c",*Byte);
    //printf(".");
    return ret;
}

/* The SizedArray has to be initialized beforehand
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

/* mallocs and fills the [length] bytes in memory, starting from [byteArray]
 * if [end], the char array ends with \0 (malloced bytes are [length]+1 in that case)
 */
char* Inflater::readCharArray(int length, bool end)
{
    bool r;
    char* byteArray=(char*)malloc(length+ (end ? 1 : 0));
    for(int i=0;i<length;i++)
    {
        r=readByte(&(byteArray[i]));
        if(r!=Z_OK)
            return NULL;
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
            return r;
    }
    return Z_OK;
}


bool Inflater::endOfFile(){
    return ret!=Z_OK;
}