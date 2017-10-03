var fs=require("fs");
var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
 	var contenido=fs.readFileSync("./views/index.html");    
	response.setHeader("Content-type","text/html");
	response.send(contenido);  
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//server.lastPlayderID = 1; // Keep track of the last id assigned to a new player

io.on('connection',function(socket){
    socket.on('nuevoJugador',function(data){
        socket.jugador = {
            id: data.id,//server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        console.log("nuevo jugador id:",socket.jugador.id);
        socket.emit('todos',obtenerTodos());
        socket.broadcast.emit('crearJugador',socket.jugador);
    });
    socket.on('posicion',function(data){
       socket.jugador = {
            id: data.id,//server.lastPlayderID++,
            x: data.x,
            y: data.y,
            ang:data.ang
        };
        console.log("movimiento id:",socket.jugador.id," ",socket.jugador.x," ",socket.jugador.y);
        //socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('movimiento',socket.jugador); 
    });
    //socket.join('timer');

});

function obtenerTodos(){
    var jugadores = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var jugador = io.sockets.connected[socketID].jugador;
        if(jugador) jugadores.push(jugador);
    });
    return jugadores;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
/*
setInterval(function(socket){
        io.sockets.in('timer').emit("obtenerPosicion")
    },500);
*/