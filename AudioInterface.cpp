/* 
 * File:   AudioInterface.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 13, 2014, 2:15 PM
 */

#include "AudioInterface.h"

AudioInterface::AudioInterface(){
    
}

void AudioInterface::togglePlay(){
}

int AudioInterface::getDuration(){
    return 0;
}

int AudioInterface::getPosition(){
    return 0;
}

void AudioInterface::setPosition(int pos){
}

void AudioInterface::changeVolume(float volume){
}

void AudioInterface::changeSpeed(float volume){
}

bool AudioInterface::hasFailed(){
    return true;
}

bool AudioInterface::isPlaying() {
    return false;
}
