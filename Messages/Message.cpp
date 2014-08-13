/* 
 * File:   Message.cpp
 * Author: Johannes Fischer
 * 
 * Created on May 22, 2014, 3:11 PM
 */

#include "Message.h"

#include "HextileMessage.h"
#include "WhiteboardMessage.h"
#include "DeleteAllAnnotation.h"
#include "RawMessage.h"
#include "DeleteAnnotation.h"
#include "RectangleAnnotation.h"
#include "CursorMessage.h"
#include "CursorPositionMessage.h"
#include "LineAnnotation.h"
#include "FreehandAnnotation.h"
#include "HighlightAnnotation.h"

int number;
int total;
bool containsCursorMessages;
bool containsAnnotations;
bool containsWhiteboard;

Message::Message() {
    type='0';
}
Message::~Message() {}

void Message::paint(SDL_Surface *screen, ProtocolPreferences* prefs) {}

bool Message::completeScreen(int w, int h){
    return false;
}

int Message::getArea() {
    return 0;
}

void setUp(){
    number = 0;
    total = 0;
    containsCursorMessages = false;
    containsAnnotations = false;
    containsWhiteboard = false;
}

bool readMessages(list<Message*>* messages, Inflater* in, ProtocolPreferences* prefs){
    int timestamp;
    if(messages->size()==0)
    {
        setUp();
        timestamp = 0;
    }
    else
        timestamp=messages->back()->timestamp;
    
    Message* message;
    
    if(!in->endOfFile()){
        // TODO: show progress
        message=readMessage(in, prefs);
        if(message==NULL)//empty message
        {
            return true;
        }
        // TODO: maybe adding additional timestamp is better suited
        if (messages->size() == 0)
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

        // add message to message array
        messages->push_back(message);
        
        // set flags
        switch (message->encoding) {
            case ANNOTATIONRECTANGLE:
            case ANNOTATIONHIGHLIGHT:
            case ANNOTATIONLINE:
            case ANNOTATIONFREEHAND:
            case ANNOTATIONIMAGE:          // MODMSG
            case ANNOTATIONTEXT:           // MODMSG
            case ANNOTATIONDELETE:
            case ANNOTATIONDELETEALL:
                containsAnnotations = true;
                message->type=ANNOTATION;
                break;

            case ENCODINGWHITEBOARD:
                containsWhiteboard = true;
                message->type=ANNOTATION;
                break;

            case ENCODINGTTTRICHCURSOR:
            case ENCODINGTTTXCURSOR:
            case ENCODINGTTTCURSORPOSITION:
                containsCursorMessages = true;
                message->type=CURSOR;
                break;

            case ENCODINGHEXTILE:
                total += ((HextileMessage*) message)->getArea();
            case ENCODINGRAW:
                message->type=FRAMEBUFFER;
                break;
                
            default:
                message->type=EMPTY;
                printf("Error: message with encoding %d gets no type?\n",message->encoding);
                break;
        }
        return true;
    }
    //printf("#Messages: %d\n",messages->size());
    return false;
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
        case ANNOTATIONRECTANGLE:
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

        /*case ANNOTATIONIMAGE:                        // MODMSG
        	message = new ImageAnnotation(timestamp, in);
        	break;

        case ANNOTATIONTEXT:
        	message = new TextAnnotation(timestamp, in);       // MODMSG
        	break;*/

        case ANNOTATIONDELETE:
            message = new DeleteAnnotation(timestamp, in);
            break;

        case ANNOTATIONDELETEALL:
            message = new DeleteAllAnnotation(timestamp);
            break;

        case ENCODINGWHITEBOARD:
            in->readByte(&byte);//pageNumber
            message = new WhiteboardMessage(timestamp, byte, prefs);
            break;

        case ENCODINGHEXTILE:
            message = new HextileMessage(timestamp, in, size);
            break;

        case ENCODINGRAW:
            //TODO:test
            printf("Created RawMessage with timestamp %d, needs testing!\n", timestamp);
            message = new RawMessage(timestamp, in, size);
            break;

        /*case ENCODINGINTERLACEDRAW:
            //TODO: InterlacedRawMessage
            // message = new InterlacedRawMessage(timestamp,x,y,w,h,msg);
            message = new EmptyMessage(timestamp);
            break;*/

        case ENCODINGTTTCURSORPOSITION:
            message = new CursorPositionMessage(timestamp, in);
            break;

        case ENCODINGTTTRICHCURSOR:
        case ENCODINGTTTXCURSOR:
            message = new CursorMessage(timestamp, encoding, in, size);
            break;

        default:
            if(VERBOSE)
                printf("skipping unsupported message: Encoding = %d\t%d bytes\n", encoding, size);
            if(size>0)
            {
                in->skipBytes(size);
            }

            size = 0;
            message = NULL;
            break;
        }
    if(message!=NULL)
    {
        message->updateFlag = updateFlag;
        message->encoding=encoding;
    }
    
    return message;
}


