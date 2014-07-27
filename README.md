TTTPlayer
=========

Video player for the ttt file format (TUM)


To build this, emscripten's Fastcomp compiler is required.
In the file ~/emscripten/src/settings.js set STB_IMAGE = 1.

To compile with emscripten, use the makefile in emBuild/.

Uses an emscripten-compiled version of libz.
