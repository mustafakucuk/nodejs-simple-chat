var express = require('express');
var app = express();
app.use(express.static('public'))
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');


app.get('/', function(req, res){
  fs.createReadStream('./index.html').pipe(res);
});

let users = [];

io.on('connection', function(socket){
  let nickName;
  socket.on("user", function( name ){
  	nickName = name;
   	io.emit('isConnect', nickName, "connect");
   	users.push(nickName);
   	io.emit("online",users);
  })

  socket.on("chat",function( message, colors ){
	io.emit("chat", nickName, message, colors);
  });
  
  socket.on("isTyping", function( type ){
  	io.emit("isTyping", nickName, type);
  })

  socket.on('disconnect', function(){
  	io.emit('isConnect', nickName, 'disconnect');
	users = users.filter(function(value) { return value != nickName });
   	io.emit("online",users);
  });
});

http.listen(8000,function(){
	console.log("Server listening on : 8000");
});

