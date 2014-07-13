/* 
 * File:   AudioInterface.h
 * Author: user
 *
 * Created on July 13, 2014, 2:15 PM
 */

#ifndef AUDIOINTERFACE_H
#define	AUDIOINTERFACE_H

#include <stdio.h>

using namespace std;

class AudioInterface {
public:
    AudioInterface();
    
    virtual void play();
    virtual int getPosition();
    virtual int getDuration();
    virtual bool hasFailed();
    
};

#endif	/* AUDIOINTERFACE_H */

