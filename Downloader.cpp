/* 
 * File:   Downloader.cpp
 * Author: user
 * 
 * Created on June 12, 2014, 12:18 AM
 */

#include "Downloader.h"

Downloader::Downloader(char* url) {
    
    error=false;
    ready=false;
    bufferPos=0;
    bufferLen=BUFFER_UNIT;
    buffer=(char*)malloc(bufferLen);
    
    curl = curl_easy_init();
    if(curl==NULL)
    {
        error=true;
        return;
    }
    
    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeOpt);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, this);
    curl_easy_setopt(curl, CURLOPT_XFERINFOFUNCTION, progressOpt);
    curl_easy_setopt(curl, CURLOPT_XFERINFODATA, this);
    curl_easy_setopt(curl, CURLOPT_NOPROGRESS, 0);
    //useful for debugging
    curl_easy_setopt(curl,CURLOPT_VERBOSE,1);
    
}

Downloader::~Downloader() {
    curl_easy_cleanup(curl);
    free(buffer);
}

void Downloader::download(){
    curl_easy_perform(curl);
}

size_t Downloader::read(char* dest, size_t n){
    int amount=!(bufferLen-bufferPos<n)?n:bufferLen-bufferPos;
    memcpy(dest, &buffer[bufferPos], amount);
    bufferPos+=amount;
    return amount;
}

void Downloader::retarget(char* url){
    error=false;
    ready=false;
    bufferPos=0;
    bufferLen=BUFFER_UNIT;
    buffer=(char*)realloc(buffer, bufferLen);
    curl_easy_setopt(curl, CURLOPT_URL, url);
}

size_t Downloader::writeOpt(char* ptr, size_t size, size_t nmemb, void* userdata){
    Downloader* d = (Downloader*) userdata;
    int need=size*nmemb;
    while(d->bufferLen<d->bufferPos+need)
    {
        d->bufferLen+=BUFFER_UNIT;
        d->buffer=(char*)realloc(d->buffer,d->bufferLen);
    }
    
    memcpy(&d->buffer[d->bufferPos], ptr, need);
    d->bufferPos+=need;
    
    return need;
}

int Downloader::progressOpt(void* clientp, curl_off_t dltotal, curl_off_t dlnow, curl_off_t ultotal, curl_off_t ulnow){
    Downloader* d = (Downloader*) clientp;
    
    d->progress=dlnow;
    d->progress/=dltotal;
    //printf("progress: %f\n",d->progress);
    if(dlnow==dltotal)
    {
        d->bufferPos=0;
        d->ready=true;
    }
    return 0;
}
