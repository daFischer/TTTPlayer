Module['preRun'] = function() {

	//Module['FS_createPath']('/', 'TTT', true, true);
	//Module['FS_createPath']('TTT', x_filename+"_a", true, true);
	//FS.createPreloadedFile("TTT/"+x_filename+"_a",x_filename+".ttt",x_getPath("ttt"), true, false)
	FS.createPreloadedFile("/",x_filename+".ttt",x_getPath("ttt"), true, false)

	Module['FS_createPath']('/', 'Assets', true, true);
	FS.createPreloadedFile("Assets","PlayPause.bmp","Assets/PlayPause.bmp", true, false)
	FS.createPreloadedFile("Assets","volume.bmp","Assets/volume.bmp", true, false)
	FS.createPreloadedFile("Assets","volume2.bmp","Assets/volume2.bmp", true, false)
	FS.createPreloadedFile("Assets","speed.bmp","Assets/speed.bmp", true, false)
	FS.createPreloadedFile("Assets","speed2.bmp","Assets/speed2.bmp", true, false)
	FS.createPreloadedFile("Assets","fullscreen.bmp","Assets/fullscreen.bmp", true, false)

	FS.createPreloadedFile("Assets","thumbnail.png","Assets/thumbnail.png", true, true)
};
