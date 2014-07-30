/* 
 * File:   AudioInterface.h
 * Author: user
 *
 * Created on July 13, 2014, 2:15 PM
 */

#ifndef AUDIOINTERFACE_H
#define	AUDIOINTERFACE_H

using namespace std;

class AudioInterface {
public:
    AudioInterface();
    
    virtual void togglePlay();
    virtual int getPosition();
    virtual void setPosition(int pos);
    virtual int getDuration();
    virtual bool hasFailed();
    virtual void changeVolume(float volume);
    virtual bool isPlaying();
    
};

#endif	/* AUDIOINTERFACE_H */

