/* 
 * File:   Constants.h
 * Author: user
 *
 * Original by Fabian Petter on 10/11/10.
 * https://www2.in.tum.de/repos/ttt/branches/iOS/viewer/1.0/Classes/Constants.h
 * Created on May 5, 2014, 5:39 PM
 */

#ifndef CONSTANTS_H
#define	CONSTANTS_H

#define EXTENSION_INDEX_TABLE 1
#define EXTENSION_SEARCHBASE_TABLE_WITH_COORDINATES 2
#define ENCODINGFLAGTIMESTAMP 128
#define ENCODINGFLAGUPDATE 64
#define ENCODINGMASK 63

//message types
#define ANNOTATIONRECTANGLE 20
#define ANNOTATIONLINE 21
#define ANNOTATIONFREEHAND 22
#define ANNOTATIONHIGHLIGHT 23
#define ANNOTATIONDELETE 24
#define ANNOTATIONDELETEALL 25
#define ANNOTATIONIMAGE 26    // MODMSG
#define ANNOTATIONTEXT 27    // MODMSG
#define ENCODINGTTTCURSORPOSITION 17
#define ENCODINGTTTXCURSOR 18
#define ENCODINGTTTRICHCURSOR 19
#define ENCODINGWHITEBOARD 33
#define ENCODINGHEXTILE 5
#define ENCODINGRAW 0
#define ENCODINGINTERLACEDRAW 42

//subencodings
#define HextileRaw  1
#define HextileBackgroundSpecified  2
#define HextileForegroundSpecified  4
#define HextileAnySubrects  8
#define HextileSubrectsColoured  16

// only used by RFB protocol
#define EncodingCompressLevel0 0xFFFFFF00
#define EncodingQualityLevel0 0xFFFFFFE0
#define EncodingXCursor 0xFFFFFF10
#define EncodingRichCursor 0xFFFFFF11
#define EncodingPointerPos 0xFFFFFF18
#define EncodingLastRect 0xFFFFFF20
#define EncodingNewFBSize 0xFFFFFF21

#endif	/* CONSTANTS_H */

