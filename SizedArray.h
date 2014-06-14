/* 
 * File:   SizedArray.h
 * Author: user
 *
 * Created on May 24, 2014, 3:41 PM
 */

#ifndef SIZEDARRAY_H
#define	SIZEDARRAY_H

#include <stdlib.h>

struct SizedArray {
public:
    SizedArray(int length);
    ~SizedArray();
    
    char* array;
    int length;
    
private:

};

/*template <class T>
struct SizedArray {
public:
    SizedArray<T>(T* array, int length);
    SizedArray<T>(int length);
    
    T* array;
    int length;
    
private:

};*/
#endif	/* SIZEDARRAY_H */

