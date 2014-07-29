#
# Generated Makefile - do not edit!
#
# Edit the Makefile in the project folder instead (../Makefile). Each target
# has a -pre and a -post target defined where you can add customized code.
#
# This makefile implements configuration specific macros and targets.


# Environment
MKDIR=mkdir
CP=cp
GREP=grep
NM=nm
CCADMIN=CCadmin
RANLIB=ranlib
CC=gcc
CCC=g++
CXX=g++
FC=gfortran
AS=as

# Macros
CND_PLATFORM=GNU-Linux-x86
CND_DLIB_EXT=so
CND_CONF=Debug
CND_DISTDIR=dist
CND_BUILDDIR=build

# Include project Makefile
include Makefile

# Object Directory
OBJECTDIR=${CND_BUILDDIR}/${CND_CONF}/${CND_PLATFORM}

# Object Files
OBJECTFILES= \
	${OBJECTDIR}/Audio.o \
	${OBJECTDIR}/AudioInterface.o \
	${OBJECTDIR}/AudioJS.o \
	${OBJECTDIR}/ColorConverter.o \
	${OBJECTDIR}/Constants.o \
	${OBJECTDIR}/Controls.o \
	${OBJECTDIR}/Index.o \
	${OBJECTDIR}/IndexEntry.o \
	${OBJECTDIR}/Inflater.o \
	${OBJECTDIR}/Messages/Annotation.o \
	${OBJECTDIR}/Messages/CursorMessage.o \
	${OBJECTDIR}/Messages/CursorPositionMessage.o \
	${OBJECTDIR}/Messages/DeleteAllAnnotation.o \
	${OBJECTDIR}/Messages/DeleteAnnotation.o \
	${OBJECTDIR}/Messages/EmptyMessage.o \
	${OBJECTDIR}/Messages/FreehandAnnotation.o \
	${OBJECTDIR}/Messages/HextileMessage.o \
	${OBJECTDIR}/Messages/HighlightAnnotation.o \
	${OBJECTDIR}/Messages/LineAnnotation.o \
	${OBJECTDIR}/Messages/Message.o \
	${OBJECTDIR}/Messages/RawMessage.o \
	${OBJECTDIR}/Messages/RectangleAnnotation.o \
	${OBJECTDIR}/Messages/WhiteboardMessage.o \
	${OBJECTDIR}/Player.o \
	${OBJECTDIR}/ProtocolPreferences.o \
	${OBJECTDIR}/SizedArray.o \
	${OBJECTDIR}/Video.o \
	${OBJECTDIR}/main.o


# C Compiler Flags
CFLAGS=

# CC Compiler Flags
CCFLAGS=-lSDL
CXXFLAGS=-lSDL

# Fortran Compiler Flags
FFLAGS=

# Assembler Flags
ASFLAGS=

# Link Libraries and Options
LDLIBSOPTIONS=-lSDL -lSDL_mixer -lalut -lopenal -lSDL_ttf -lSDL_image

# Build Targets
.build-conf: ${BUILD_SUBPROJECTS}
	"${MAKE}"  -f nbproject/Makefile-${CND_CONF}.mk ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/tttplayer

${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/tttplayer: ${OBJECTFILES}
	${MKDIR} -p ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}
	${LINK.cc} -o ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/tttplayer ${OBJECTFILES} ${LDLIBSOPTIONS} -lz

${OBJECTDIR}/Audio.o: Audio.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Audio.o Audio.cpp

${OBJECTDIR}/AudioInterface.o: AudioInterface.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/AudioInterface.o AudioInterface.cpp

${OBJECTDIR}/AudioJS.o: AudioJS.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/AudioJS.o AudioJS.cpp

${OBJECTDIR}/ColorConverter.o: ColorConverter.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/ColorConverter.o ColorConverter.cpp

${OBJECTDIR}/Constants.o: Constants.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Constants.o Constants.cpp

${OBJECTDIR}/Controls.o: Controls.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Controls.o Controls.cpp

${OBJECTDIR}/Index.o: Index.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Index.o Index.cpp

${OBJECTDIR}/IndexEntry.o: IndexEntry.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/IndexEntry.o IndexEntry.cpp

${OBJECTDIR}/Inflater.o: Inflater.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Inflater.o Inflater.cpp

${OBJECTDIR}/Messages/Annotation.o: Messages/Annotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/Annotation.o Messages/Annotation.cpp

${OBJECTDIR}/Messages/CursorMessage.o: Messages/CursorMessage.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/CursorMessage.o Messages/CursorMessage.cpp

${OBJECTDIR}/Messages/CursorPositionMessage.o: Messages/CursorPositionMessage.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/CursorPositionMessage.o Messages/CursorPositionMessage.cpp

${OBJECTDIR}/Messages/DeleteAllAnnotation.o: Messages/DeleteAllAnnotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/DeleteAllAnnotation.o Messages/DeleteAllAnnotation.cpp

${OBJECTDIR}/Messages/DeleteAnnotation.o: Messages/DeleteAnnotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/DeleteAnnotation.o Messages/DeleteAnnotation.cpp

${OBJECTDIR}/Messages/EmptyMessage.o: Messages/EmptyMessage.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/EmptyMessage.o Messages/EmptyMessage.cpp

${OBJECTDIR}/Messages/FreehandAnnotation.o: Messages/FreehandAnnotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/FreehandAnnotation.o Messages/FreehandAnnotation.cpp

${OBJECTDIR}/Messages/HextileMessage.o: Messages/HextileMessage.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/HextileMessage.o Messages/HextileMessage.cpp

${OBJECTDIR}/Messages/HighlightAnnotation.o: Messages/HighlightAnnotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/HighlightAnnotation.o Messages/HighlightAnnotation.cpp

${OBJECTDIR}/Messages/LineAnnotation.o: Messages/LineAnnotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/LineAnnotation.o Messages/LineAnnotation.cpp

${OBJECTDIR}/Messages/Message.o: Messages/Message.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/Message.o Messages/Message.cpp

${OBJECTDIR}/Messages/RawMessage.o: Messages/RawMessage.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/RawMessage.o Messages/RawMessage.cpp

${OBJECTDIR}/Messages/RectangleAnnotation.o: Messages/RectangleAnnotation.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/RectangleAnnotation.o Messages/RectangleAnnotation.cpp

${OBJECTDIR}/Messages/WhiteboardMessage.o: Messages/WhiteboardMessage.cpp 
	${MKDIR} -p ${OBJECTDIR}/Messages
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Messages/WhiteboardMessage.o Messages/WhiteboardMessage.cpp

${OBJECTDIR}/Player.o: Player.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Player.o Player.cpp

${OBJECTDIR}/ProtocolPreferences.o: ProtocolPreferences.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/ProtocolPreferences.o ProtocolPreferences.cpp

${OBJECTDIR}/SizedArray.o: SizedArray.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/SizedArray.o SizedArray.cpp

${OBJECTDIR}/Video.o: Video.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/Video.o Video.cpp

${OBJECTDIR}/main.o: main.cpp 
	${MKDIR} -p ${OBJECTDIR}
	${RM} "$@.d"
	$(COMPILE.cc) -g -MMD -MP -MF "$@.d" -o ${OBJECTDIR}/main.o main.cpp

# Subprojects
.build-subprojects:

# Clean Targets
.clean-conf: ${CLEAN_SUBPROJECTS}
	${RM} -r ${CND_BUILDDIR}/${CND_CONF}
	${RM} ${CND_DISTDIR}/${CND_CONF}/${CND_PLATFORM}/tttplayer

# Subprojects
.clean-subprojects:

# Enable dependency checking
.dep.inc: .depcheck-impl

include .dep.inc
