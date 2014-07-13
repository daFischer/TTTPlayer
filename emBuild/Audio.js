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
var x_getDuration=function(){
	return x_audio.duration*1000;
}
var x_play=function(){
	x_audio.play();
}
var x_audioLoaded=function(){
	
}
/*var x_setPosition=function(pos){
	x_audio.currentTime=pos/1000;
}*/
