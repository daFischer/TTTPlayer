Module['preRun'] = function() {

	Module['FS_createPath']('/', 'TTT', true, true);
	Module['FS_createPath']('TTT', x_filename+"_a", true, true);
	FS.createPreloadedFile("TTT/"+x_filename+"_a",x_filename+".ttt",x_getPath("ttt"), true, false)
};
