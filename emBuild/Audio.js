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
	return x_audio.currentTime;
}
var x_setPosition=function(pos){
	x_audio.currentTime=pos;
}

var x_getDuration=function(){
	return x_audio.duration;
}
var x_togglePlay=function(){
	if(x_audio.paused)
		x_audio.play();
	else
		x_audio.pause();
}

var x_canvas=document.getElementById('canvas');
var x_rect;

var x_onFull;

var x_setupFullScreen=function(){
	x_rect=x_canvas.getBoundingClientRect();
	x_onFull=Module.cwrap('getOnFullScreenButton', 'bool');
	x_canvas.addEventListener('click', function(e) {
		if(x_onFull())
		{
			var x_canvas_div=document.getElementById('canvas_div');
			var x_fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
			if(x_fullscreenElement)
			{
				if(document.exitFullscreen)
					document.exitFullscreen();
				else if(document.mozCancelFullScreen)
					document.mozCancelFullScreen();
				else if(document.webkitExitFullscreen)
					document.webkitExitFullscreen();
			}
			else
			{
				Module.requestFullScreen(false, false)
			}
		}
	}, false);
}

var x_changeVolume=function(volume){
	x_audio.volume=volume;
}

var x_audioLoaded=function(){

}

var x_setProgress=function(percentage)
{
	if(percentage<100)
	{
		x_progress=document.getElementById('x_progress');
		x_progress.value=percentage;
	}
	else
	{
		x_remove=document.getElementById('x_progress_div');
		x_remove.style.display="none";
		x_remove=document.getElementById('progress_div');
		x_remove.style.display="none";
		x_remove=document.getElementById('spinner');
		x_remove.style.display="none";
		x_remove=document.getElementById('status');
		x_remove.style.display="none";
		x_remove=document.getElementById('output');
		x_remove.style.display="none";
	}
}

var x_getPath=function(end){
	return x_path+"/"+x_filename+"_a/"+x_filename+"."+end;
};
var x_setAudioSource=function(){
	x_audio.innerHTML='<source src="'+x_getPath("ogg")+'" type="audio/ogg"><source src="'+x_getPath("mp3")+'" type="audio/mp3"><source src="'+x_getPath("wav")+'" type="audio/wav">Your browser does not support the audio element.';
}
x_setAudioSource();


var x_resizeCanvas = function(){
	var x_canvas_div=document.getElementById('canvas_div');
}
window.onresize=x_resizeCanvas;