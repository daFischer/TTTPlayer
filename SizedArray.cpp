/* 
 * File:   SizedArray.cpp
 * Author: Johannes Fischer
 * 
 * Created on May 24, 2014, 3:41 PM
 */

#include "SizedArray.h"

SizedArray::SizedArray(int length) {
    this->array=(char*) malloc(length);
    this->length=length;
}

SizedArray::~SizedArray(){
    free(array);
    array=NULL;
}
