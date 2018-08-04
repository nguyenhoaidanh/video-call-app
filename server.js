var express=require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fileUpload = require('express-fileupload');
var session=require('express-session');
var bodyParser=require('body-parser');     
app.use(fileUpload());
var fs = require('fs');
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', __dirname + '/view');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/upload',express.static(__dirname + '/upload'));
app.use(session({
    secret: 'axxxxxxxxaaaaa',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000*60
    }
}))

const arrUserInfo = [];
io.on('connection', socket => {
	console.log('socket id '+socket.id);
	socket.on('login', user => {
		var isExist=arrUserInfo.some(function(i){
			return i.username == user.username;
		});
		if(isExist)
		{
			socket.emit('register-failed');
		}
		else{
		arrUserInfo.push(user);
		console.log(user); 	
		socket.emit('register-success',user)
		io.emit('list-users',arrUserInfo);
		}
	});
});
app.get('/',function(req,res){
	var data={
		username:req.session.username,
		imgSrc:req.session.imgSrc,
	};
	res.render('index',{data:data});
});

app.set('port', process.env.PORT || 8080);
http.listen(process.env.PORT || 8080);