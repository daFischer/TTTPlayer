/* 
 * File:   Inflater.cpp
 * Author: user
 * using http://zlib.net/zlib_how.html
 * using http://curl.haxx.se/libcurl/c/fopen.html
 * 
 * Created on May 8, 2014, 12:46 PM
 */

#include "Inflater.h"

Inflater::Inflater(Downloader* d)
{
    //printf("Constructor of Inflater\n");
    source=d;
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
    
    strm.avail_in = source->read((char*)in, CHUNK);        //from the outer loop of the example
    if (source->error) {
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
            strm.avail_in = source->read((char*)in, CHUNK);
            if (source->error) {
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

bool Inflater::readCharArray(char* ByteArray, int length)
{
    bool r;
    for(int i=0;i<length;i++)
    {
        r=readByte(&(ByteArray[i]));
        if(r!=Z_OK)
            return r;
    }
    ByteArray[length]=0;
    return Z_OK;
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

bool Inflater::endOfFile(){
    return ret!=Z_OK;
}