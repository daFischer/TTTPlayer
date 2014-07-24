/* 
 * File:   Index.cpp
 * Author: user
 * 
 * Created on July 23, 2014, 10:10 PM
 */

#include "Index.h"
#include "Inflater.h"

Index::Index(Inflater* in, int numBytes) {
    int timestamp;
    unsigned char titleLength;
    char* title;
    int searchableLength;
    SizedArray* searchableArray;
    SDL_Surface* image;
    
    short entryNumber;
    in->readShort(&entryNumber);
    numBytes-=2;
    for(int i=0;i<entryNumber;i++)
    {
        in->readInt(&timestamp);
        in->readByte((char*) &titleLength);
        title=in->readCharArray(titleLength,true);
        title[titleLength]=0;
        in->readInt(&searchableLength);
        searchableArray=new SizedArray(searchableLength);
        in->readSizedArray(searchableArray);
        
        numBytes-=9+titleLength+searchableLength;
        image=readThumbnail(in, &numBytes);
        index.push_back(new IndexEntry(title,timestamp,searchableArray,image));
    }
    
    if(numBytes>0)
    {
        printf("Index skipping %d bytes\n", numBytes);
        in->skipBytes(numBytes);
    }
    
    //TODO: what if too many bytes have been read?
}

SDL_Surface* Index::readThumbnail(Inflater* in, int* numBytes) {
    int imageSize;
    in->readInt(&imageSize);
    *numBytes-=4;
    if(imageSize==0)
        // thumbnail not available
        return NULL;
    else
    {
        char* imageArray = (char*) malloc(imageSize);
        imageArray=in->readCharArray(imageSize,false);
        *numBytes-=imageSize;/*
//#ifdef EMSCRIPTEN
        //write to file (emscripten has no IMG_LoadPNG_RW method, but IMG_Load exists)
        ofstream file;
        file.open("Assets/thumbnail.png",ofstream::out | ofstream::trunc);
        file.write(imageArray,imageSize);
        file.close();
        //create from file
        SDL_Surface* bufferedImage = IMG_Load("Assets/thumbnail.png");*/
//#else
        SDL_Surface* bufferedImage = IMG_Load_RW(SDL_RWFromMem((void*)imageArray,imageSize),1);
//#endif
        delete(imageArray);
        //ImageIO.read(new ByteArrayInputStream(image_array));
        //thumbnail_scale_factor = recording.prefs.framebufferHeight / bufferedImage.getHeight();
        return bufferedImage;
    }
}

IndexEntry* Index::lastBefore(int timestamp) {
    for(std::list<IndexEntry*>::reverse_iterator it=index.rbegin();it!=index.rend();it++)
        if((*it)->timestamp <= timestamp*1000)
            return (IndexEntry*) *it;
    return index.front();
}

Index::~Index() {
    
}

