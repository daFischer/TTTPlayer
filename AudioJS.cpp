/* 
 * File:   AudioJS.cpp
 * Author: user
 * 
 * Created on July 13, 2014, 2:51 PM
 */

#ifdef EMSCRIPTEN

#include "AudioJS.h"

AudioJS::AudioJS() {
    duration = EM_ASM_INT({
        return x_getDuration();
    },0);
    printf("Duration: %d min\n",duration/60000);
}

void AudioJS::play(){
    EM_ASM(
        x_play();
    );
}

int AudioJS::getDuration(){
    return duration;
}

int AudioJS::getPosition(){
    return EM_ASM_INT({
        return x_getPosition();
    },0);
}

bool AudioJS::hasFailed(){
    return false;
}

#endif
