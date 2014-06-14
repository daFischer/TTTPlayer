/* 
 * File:   Message.cpp
 * Author: user
 * 
 * Created on May 22, 2014, 3:11 PM
 */

#include "Message.h"

#include "EmptyMessage.h"
#include "HextileMessage.h"
#include "WhiteboardMessage.h"
#include "DeleteAllAnnotation.h"

int number;
int total;
bool containsCursorMessages;
bool containsAnnotations;
bool containsWhiteboard;

Message::~Message() {}

void Message::paint(SDL_Surface *screen, ProtocolPreferences* prefs) {}

bool Message::isEmpty(){
    return false;
}




void setUp(){
    number = 0;
    total = 0;
    containsCursorMessages = false;
    containsAnnotations = false;
    containsWhiteboard = false;
}

list<Message*> readMessages(Inflater* in, ProtocolPreferences* prefs){
    list<Message*> messages;
    Message* message;
    int timestamp = 0;
    
    while(!in->endOfFile()){
        // TODO: show progress
        message=readMessage(in, prefs);
        if(message->isEmpty())
            continue;
        
        // TODO: maybe adding additional timestamp is better suited
        if (messages.size() == 0)
            message->timestamp = 0;
        
        // use previous timestamp if unset
        // TODO: maybe zero and unset timestamp should be distinguished
        if (message->timestamp == 0)
            message->timestamp = timestamp;
        
        // fix inconsistent timestamps
        if (message->timestamp < timestamp) {
            //Maybe output the change for debugging?
            message->timestamp = timestamp;
        }
        
        // keep timestamp
        timestamp = message->timestamp;

        // add message to message array
        messages.push_back(message);
        
        // set flags
        switch (message->encoding) {
            case ANNOTATIONRECTANGLE:
            case ANNOTATIONHIGHLIGHT:
            case ANNOTATIONLINE:
            case ANNOTATIONFREEHAND:
            case ANNOTATIONIMAGE:          // MODMSG
            case ANNOTATIONTEXT:           // MODMSG
                containsAnnotations = true;
                break;

            case ENCODINGWHITEBOARD:
                containsWhiteboard = true;
                break;

            case ENCODINGTTTRICHCURSOR:
            case ENCODINGTTTXCURSOR:
                containsCursorMessages = true;
                break;

            case ENCODINGHEXTILE:
                total += ((HextileMessage*) message)->getCoveredArea();
                break;
        }
    }
    //printf("#Messages: %d\n",messages.size());
    return messages;
}

Message* readMessage(Inflater* in, ProtocolPreferences* prefs){
    Message* message;
    
    // read message header
    int size;
    in->readInt(&size);
    char byte;
    in->readByte(&byte);
    int encoding=(int)byte;
    size--;
    
    // read timestamp
    int timestamp=0;
    if((encoding & ENCODINGFLAGTIMESTAMP) != 0)
    {
        in->readInt(&timestamp);
        if(timestamp<0)
            timestamp=0;
        size-=4;
    }
    bool updateFlag=false;
    if ((encoding & ENCODINGFLAGUPDATE) != 0) {
        // TODO: handle update flag
        updateFlag = true;
    }
    // remove flags
    encoding &= ENCODINGMASK;
    
    switch (encoding) {
        /*case ANNOTATIONRECTANGLE:
            message = new RectangleAnnotation(timestamp, in);
            break;

        case ANNOTATIONHIGHLIGHT:
            message = new HighlightAnnotation(timestamp, in);
            break;

        case ANNOTATIONLINE:
            message = new LineAnnotation(timestamp, in);
            break;

        case ANNOTATIONFREEHAND:
            message = new FreehandAnnotation(timestamp, in);
            break;

        case ANNOTATIONIMAGE:                        // MODMSG
        	message = new ImageAnnotation(timestamp, in);
        	break;

        case ANNOTATIONTEXT:
        	message = new TextAnnotation(timestamp, in);       // MODMSG
        	break;

        case ANNOTATIONDELETE:
            message = new DeleteAnnotation(timestamp, in);
            break;*/

        case ANNOTATIONDELETEALL:
            message = new DeleteAllAnnotation(timestamp);
            break;

        /*case ENCODINGTTTCURSORPOSITION:
            message = new CursorPositionMessage(timestamp, in);
            break;*/

        case ENCODINGWHITEBOARD:
            in->readByte(&byte);
            message = new WhiteboardMessage(timestamp, byte, prefs);
            break;

        case ENCODINGHEXTILE:
            message = new HextileMessage(timestamp, in, size);
            break;

        /*case ENCODINGRAW:
            message = new RawMessage(timestamp, in, size);
            break;

        case ENCODINGINTERLACEDRAW:
            //TODO: InterlacedRawMessage
            // message = new InterlacedRawMessage(timestamp,x,y,w,h,msg);
            message = new EmptyMessage(timestamp);
            break;

        case ENCODINGTTTRICHCURSOR:
        case ENCODINGTTTXCURSOR:
            message = new CursorMessage(timestamp, encoding, in, size);
            break;*/

        default:
            printf("skipping unsupported message: Encoding = %d\t%d bytes\n", encoding, size);
            if(size>0)
            {
                char skip[size+1];
                in->readCharArray(skip, size);
                /*for(int i=0;i<sizeof(skip);i++)
                    printf("%d,",skip[i]);
                printf("\n");*/
            }

            size = 0;
            message = new EmptyMessage(timestamp);
            break;
        }
    
    message->updateFlag = updateFlag;
    
    return message;
}

