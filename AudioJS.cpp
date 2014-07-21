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
    printf("Duration: %d min\n",duration/60);
}

void AudioJS::togglePlay(){
    EM_ASM(
        x_togglePlay();
    );
}

int AudioJS::getDuration(){
    return duration;
}

void AudioJS::setPosition(int pos){
    EM_ASM_INT({
        x_setPosition($0);
        return 0;
    },pos);
}

int AudioJS::getPosition(){
    return EM_ASM_INT({
        return x_getPosition();
    },0);
}

bool AudioJS::hasFailed(){
    return false;
}

void AudioJS::changeVolume(float volume){
    EM_ASM_INT({
        x_changeVolume($0);
    },volume);
}

bool AudioJS::isPlaying(){
    return EM_ASM_INT({
        return x_audio.paused;
    },0)==0;
}

#endif
