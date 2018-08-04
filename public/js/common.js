const socket = io('https://video-call-app.herokuapp.com/');
new WOW().init();
$('video').hide();

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

const peer = new Peer({ 
    key: 'peerjs',
    host: 'video-call-app.herokuapp.com',
    secure:true,
    port:443
    
});
socket.on('list-users',function(arrayUsers){
		$('#ulUser').html('');
		$('#count').html(arrayUsers.length);
		var html='';
		arrayUsers.forEach(function(user){
			html+='<li  class="list-group-item" id="'+user.peerId+'">'+user.username+' <img src="/image/at.png" class="pull-right" width="13" heigh="13" ><img/></li>';
		});
		$('#ulUser').append(html);


		



 });
socket.on('register-success', function(user) {
		$('#messLogin').hide();
		$('#remoteStream').show();
    	$('#div-signUp').hide();
    	$('#div-chat,#toCall').show();
    	$('#hi').html('Hi, <span style="color:red">'+user.username+'</span> ! Welcome you to my website, let try on it !'); 
    	$('#username').html(user.username);
    	$('#content').show();
    	$('#my-peer').append('Your Id:<span style="color:red"> ' +user.peerId+'</span>'); 
});
socket.on('register-failed', function(event) {
	$('#messLogin').html('User is already exist!');
});

peer.on('open', id => {  
    $('#btnSignUp').click(() => {
    	
    	const username = $('#txtUsername').val();
    	if(username==''){
	    	$('#messLogin').html('Vui lòng điền username');
	    	return;
    	}
    	socket.emit('login',{ username: username, peerId: id });
    	 
        
       
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    if(id=='')return;
    openStream()
    .then(stream => {
    	$('#localStream').show();
        playStream('localStream', stream);

        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        $('#localStream').show();
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

 
$('#ulUser').on('click', 'li', function(event) {
	const id = $(this).attr('id');
    openStream()
    .then(stream => {
    	$('#localStream').show();
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});