
EM=em++ -O2 -s ALLOW_MEMORY_GROWTH=1
CC=emcc -O2 -s ALLOW_MEMORY_GROWTH=1
DIR=../
MDIR=../Messages/

MESSAGES= $(MDIR)Annotation.cpp $(MDIR)CursorMessage.cpp $(MDIR)CursorPositionMessage.cpp $(MDIR)DeleteAllAnnotation.cpp $(MDIR)DeleteAnnotation.cpp $(MDIR)EmptyMessage.cpp $(MDIR)FreehandAnnotation.cpp $(MDIR)HextileMessage.cpp $(MDIR)LineAnnotation.cpp $(MDIR)Message.cpp $(MDIR)RawMessage.cpp $(MDIR)RectangleAnnotation.cpp $(MDIR)WhiteboardMessage.cpp
#ZSRC = libz/adler32.c libz/compress.c libz/crc32.c libz/deflate.c libz/gzclose.c libz/gzlib.c libz/gzread.c \
#	libz/gzwrite.c libz/infback.c libz/inffast.c libz/inflate.c libz/inftrees.c libz/trees.c libz/uncompr.c libz/zutil.c
SRC= $(DIR)AudioInterface.cpp $(DIR)AudioJS.cpp $(DIR)ColorConverter.cpp $(DIR)Constants.cpp $(DIR)Controls.cpp $(DIR)Index.cpp $(DIR)IndexEntry.cpp $(DIR)Inflater.cpp $(DIR)Player.cpp $(DIR)ProtocolPreferences.cpp $(DIR)SizedArray.cpp $(DIR)Video.cpp $(DIR)main.cpp $(MESSAGES)

EXPORT=-s "EXPORTED_FUNCTIONS=['_main', '_on_play', '_on_pause', '_getOnFullScreenButton']"
PRELOAD= --preload-file Assets/PlayPause.bmp --preload-file Assets/volume.bmp --preload-file Assets/volume2.bmp

#STATICLIB= libz.bc

CFLAGS=-O
TEST_LDFLAGS=-L. libz.a

fileplayer.js: $(SRC) Makefile $(DIR)main.h pre.js
	$(EM) $(SRC) $(EXPORT) -o $@ libz.bc --pre-js pre.js

#libz.bc: $(ZSRC)
#	$(CC) $(ZSRC) -s EXPORT_ALL=1 -o $@

#libz/%.o: libz/%.c
#	$(EM) -fPIC -c $< -o $@

OBJS = libz/adler32.o libz/compress.o libz/crc32.o libz/deflate.o libz/gzclose.o libz/gzlib.o libz/gzread.o \
	libz/gzwrite.o libz/infback.o libz/inffast.o libz/inflate.o libz/inftrees.o libz/trees.o libz/uncompr.o libz/zutil.o
libz/adler32.o libz/zutil.o: libz/zutil.h libz/zlib.h libz/zconf.h
libz/gzclose.o libz/gzlib.o libz/gzread.o libz/gzwrite.o: libz/zlib.h libz/zconf.h libz/gzguts.h
libz/compress.o libz/example.o libz/minigzip.o libz/uncompr.o: libz/zlib.h libz/zconf.h
libz/crc32.o: libz/zutil.h libz/zlib.h libz/zconf.h libz/crc32.h
libz/deflate.o: libz/deflate.h libz/zutil.h libz/zlib.h libz/zconf.h
libz/infback.o libz/inflate.o: libz/zutil.h libz/zlib.h libz/zconf.h libz/inftrees.h libz/inflate.h libz/inffast.h libz/inffixed.h
libz/inffast.o: libz/zutil.h libz/zlib.h libz/zconf.h libz/inftrees.h libz/inflate.h libz/inffast.h
libz/inftrees.o: libz/zutil.h libz/zlib.h libz/zconf.h libz/inftrees.h
libz/trees.o: libz/deflate.h libz/zutil.h libz/zlib.h libz/zconf.h libz/trees.h

