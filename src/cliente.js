function Cliente(){
	this.socket;
	this.id;
	this.nuevoJugador=function(){
		this.socket.emit('nuevoJugador',{id:this.id});
	}
	this.ini=function(){
		this.id=randomInt(1,1000);
		this.socket=io.connect();
	}
	this.ini();
}

var cliente=new Cliente();


cliente.socket.on('crearJugador',function(data){	
    juego.agregarJugador(data.id,data.x,data.y);        
});

cliente.socket.on('todos',function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        juego.agregarJugador(data[i].id,data[i].x,data[i].y);
    }
});



function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}