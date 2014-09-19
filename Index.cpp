/* 
 * File:   Index.cpp
 * Author: Johannes Fischer
 * 
 * Created on July 23, 2014, 10:10 PM
 */

#include "Index.h"
#include "Inflater.h"

Index::Index(Inflater* in, int numBytes) {
    waypoint = NULL;
    this->numBytes=numBytes;
    in->readShort(&entryNumber);
    this->numBytes -= 2;
    
}

Index::Index(Message** messages, int numMessages) {
    waypoint = NULL;
    if (VERBOSE)
        printf("\ncompute index table:\n");

    // TODO: set as option
    // possible slide should at least cover 20% of maximum size
    int minSlideArea = ProtocolPreferences::framebufferWidth * ProtocolPreferences::framebufferHeight / 5;

    // TODO: set as option
    // there should be at least 5 or 10 sec between two slides
    int minSlideDiffMsecs = 10000;
    int minSequenceLength = 5;

    // count sequence with gaps less than minSlideDiffMsecs
    int animationCount = 0;

    int timestamp = -minSlideDiffMsecs * 2;
    int previous_timestamp = -1;
    int area = 0;

    // build index based on covered area
    for (int i = 0; i < numMessages; i++) {
        Message* message = messages[i];

        // sum up area(s)
        if (message->type == FRAMEBUFFER) {
            area += message->getArea();
            //printf("%d,",area);
        } else if (area == 0)
            // only FramebufferUpdates are useful - skip others
            // Note: do not skip if same timestamp as previous framebufferupdate
            continue;

        // cumulate areas of same timestamp
        if (i + 1 < numMessages && message->timestamp == messages[i + 1]->timestamp)
            continue;

        // check size
        if (area > minSlideArea) {
            // reset cumulated area
            area = 0;
            // no animation or first index
            if ((message->timestamp - timestamp > minSlideDiffMsecs) || index.size() == 0) {
                if (animationCount > 0 && animationCount < minSequenceLength && previous_timestamp >= 0) {
                    // no animation, take last message of sequence
                    // (animations take first message of sequence as index)
                    index.push_back(new IndexEntry(NULL, previous_timestamp, NULL, NULL));
                    if (index.size() > 0)
                        index.back()->timestamp = previous_timestamp;
                    else
                        // first index
                        index.push_back(new IndexEntry(NULL, previous_timestamp, NULL, NULL));
                    if (VERBOSE)
                        printf(" RESET");
                }

                animationCount = 0;

                if (VERBOSE)
                    cout << "\nIndex " << (index.size() < 9 ? " " : "") << (index.size() + 1) << ": " << message->timestamp;
                index.push_back(new IndexEntry(NULL, message->timestamp, NULL, NULL));
            } else {
                // distinguish animations from multiple slide changes
                animationCount++;
                previous_timestamp = message->timestamp;

                if (VERBOSE)
                    cout << "\t" << message->timestamp << "(" << animationCount << ")";
            }
            timestamp = message->timestamp;
        }
    }

    // fix last index if needed
    if (animationCount > 0 && animationCount < minSequenceLength && previous_timestamp >= 0 && index.size() > 0) {
        // no animation, take last message of sequence
        // (animations take first message of sequence as index)
        index.back()->timestamp = previous_timestamp;
        if (VERBOSE)
            printf(" RESET");
    }

    if ((index.size() > 0)
            && (index.back()->timestamp >= messages[numMessages - 1]->timestamp)) {
        index.pop_back();
        if (VERBOSE)
            printf(" - Removing last index, because it uses timestamp of last message->");
    }

    // add index at beginning if needed
    if (index.size() == 0 || index.front()->timestamp > 2000) {
        index.push_front(new IndexEntry(NULL, 0, NULL, NULL));
        if (VERBOSE)
            printf("\nIndex added index at beginning.");
    }

    if (VERBOSE)
        printf("\n\nGenerated index with %d entries.\n\n", index.size());
    it = index.begin();
    currentMessage=0;
}

SDL_Surface* Index::readThumbnail(Inflater* in, int* numBytes) {
    int imageSize;
    in->readInt(&imageSize);
    *numBytes -= 4;
    if (imageSize == 0)
        // thumbnail not available
        return NULL;
    else {
        //printf("Index numBytes = %d, imageSize = %d\n",*numBytes, imageSize);
        char* imageArray;// = (char*) malloc(imageSize);
        imageArray = in->readCharArray(imageSize, false);
        *numBytes -= imageSize;
        SDL_RWops* source=SDL_RWFromMem((void*) imageArray, imageSize);
        SDL_Surface* bufferedImage = IMG_Load_RW(source, 0);
        delete(imageArray);
        return bufferedImage;
    }
}

bool Index::readIndexEntry(Inflater* in) {
    int timestamp;
    unsigned char titleLength;
    char* title;
    int searchableLength;
    SizedArray* searchableArray;
    SDL_Surface* image;
    
    if(entryNumber>0) {
        entryNumber--;
        in->readInt(&timestamp);
        in->readByte((char*) &titleLength);
        title = in->readCharArray(titleLength, true);
        title[titleLength] = 0;
        in->readInt(&searchableLength);
        searchableArray = new SizedArray(searchableLength);
        in->readSizedArray(searchableArray);

        numBytes -= 9 + titleLength + searchableLength;
        image = readThumbnail(in, &numBytes);
        index.push_back(new IndexEntry(title, timestamp, searchableArray, image));
        return true;
    }
    
    if (numBytes > 0) {
        printf("Index skipping %d bytes\n", numBytes);
        in->skipBytes(numBytes);
    }
    it = index.begin();
    currentMessage=0;
    //TODO: what if too many bytes have been read?
    
    return false;
}

/* Video calls this when a not yet filled IndexEntry needs to be filled immediately
 */
void Index::loadUntil(IndexEntry* entry, SDL_Surface* screen, Message** messages, int numMessages, ProtocolPreferences* prefs) {
    if(VERBOSE)
        printf("Loading IndexEntries from %d s until %d s\n",(*it)->timestamp/1000,entry->timestamp/1000);
    for(; it!=index.end() && (*it)->timestamp<=entry->timestamp;)//'it' is incremented in fillSurface
        fillSurface(screen,messages,numMessages,1000000,prefs);
}


bool Index::fillSurface(SDL_Surface* screen, Message** messages, int numMessages, int areaLeft, ProtocolPreferences* prefs) {
    if (it == index.end() || currentMessage >= numMessages)
    {
        progress=-1;
        return false;
    }
    while(areaLeft > 0 && currentMessage < numMessages && it != index.end())
    {
        if (messages[currentMessage]->timestamp > (*it)->timestamp)
        {
            progress=(*it)->timestamp;
            (*it)->setWaypoint(waypoint);
            it++;
            if (it == index.end())
            {
                progress=-1;
                return false;
            }
            waypoint=NULL;
        }
        if(waypoint==NULL)
            waypoint = SDL_CreateRGBSurface(SDL_ANYFORMAT, screen->w, screen->h, screen->format->BitsPerPixel, screen->format->Rmask, screen->format->Gmask, screen->format->Bmask, screen->format->Amask);
        
        if (messages[currentMessage]->type == FRAMEBUFFER)
        {
            messages[currentMessage]->paint(waypoint, prefs);
            areaLeft-=messages[currentMessage]->getArea();
        }
        currentMessage++;
    }
    return true;
    /*if (it == index.end())
        return false;

    SDL_Surface* waypoint = SDL_CreateRGBSurface(SDL_ANYFORMAT, screen->w, screen->h, screen->format->BitsPerPixel, screen->format->Rmask, screen->format->Gmask, screen->format->Bmask, screen->format->Amask);
    if (it == index.begin()) {
        printf("First Message for IndexEntry\n");
        currentMessage = 0;
    } else {
        it--;
        (*it)->paintWaypoint(waypoint);
        it++;
    }

    while (currentMessage < numMessages) {
        if (messages[currentMessage]->timestamp > (*it)->timestamp)
            break;
        if (messages[currentMessage]->type == FRAMEBUFFER)
            messages[currentMessage]->paint(waypoint, prefs);
        currentMessage++;
    }
    (*it)->setWaypoint(waypoint);

    it++;
    if (it == index.end())
        progress=-1;
    else
        progress=(*it)->timestamp;
    return true;*/
}

IndexEntry* Index::lastBefore(int timestamp) {
    for (std::list<IndexEntry*>::reverse_iterator it = index.rbegin(); it != index.rend(); it++)
        if ((*it)->timestamp <= timestamp)
        {
            return (IndexEntry*) * it;
        }
    return index.front();
}

Index::~Index() {
    while (index.size() > 0) {
        delete(index.front());
        index.pop_front();
    }
}

