var x_audio=document.getElementById('audioplayer');
var x_seeked=false;
var x_getSeek=function(){
	if(x_seeked)
	{
		x_seeked=false;
		return true;
	}
	return false;
}

var x_getPosition=function(){
	return x_audio.currentTime*1000;
}
var x_setPosition=function(pos){
	x_audio.currentTime=pos/1000;
}

var x_getDuration=function(){
	return x_audio.duration*1000;
}
var x_togglePlay=function(){
	if(x_audio.paused)
		x_audio.play();
	else
		x_audio.pause();
}

var x_fullscreen=false;
var x_canvas=document.getElementById('canvas');
var x_rect;

var x_onFull;

var x_setupFullScreen=function(w, h){
	x_rect=x_canvas.getBoundingClientRect();
	x_onFull=Module.cwrap('getOnFullScreenButton', 'bool');
	x_canvas.addEventListener('click', function(e) {
		if(x_onFull())
		{
			var x_canvas_div=document.getElementById('canvas_div');
			if(x_fullscreen)
				document.mozCancelFullScreen();
				//x_canvas_div.exitFullscreen();
			else
				x_canvas_div.mozRequestFullScreen();
			x_fullscreen=!x_fullscreen;
		}
	}, false);
}

var x_changeVolume=function(volume){
	x_audio.volume=volume;
}

var x_audioLoaded=function(){

}

