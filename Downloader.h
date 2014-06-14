/* 
 * File:   Downloader.h
 * Author: user
 *
 * Created on June 12, 2014, 12:18 AM
 */

#ifndef DOWNLOADER_H
#define	DOWNLOADER_H

#define BUFFER_UNIT 0x10000

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <curl/curl.h>

using namespace std;

class Downloader {
public:
    Downloader(char* url);
    virtual ~Downloader();
    size_t read(char* buffer, size_t n);
    void download();
    void retarget(char* url);
    bool error;
    double progress;
    bool ready;
    
private:
    static size_t writeOpt( char *ptr, size_t size, size_t nmemb, void *userdata);
    static int progressOpt(void *clientp, curl_off_t dltotal, curl_off_t dlnow, curl_off_t ultotal, curl_off_t ulnow);
    
    CURL* curl;
    int running;
    char* buffer;
    int bufferPos;
    int bufferLen;
};

#endif	/* DOWNLOADER_H */

