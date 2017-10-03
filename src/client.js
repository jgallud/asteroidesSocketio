function Client(){
	this.socket=io.connect();
	this.id=null;
	this.askNewPlayer = function(){		
    	this.socket.emit('newplayer',$.cookie("usr"));
	};
	this.ini=function(){
		this.id=randomInt(1,10000);
		$.cookie("usr",this.id);
	}
	this.enviarPosicion=function(x,y,ang){
		this.socket.emit('posicion',{"id":this.id,"x":x,"y":y,"ang":ang})
	}
	this.sendClick = function(x,y){
  		this.socket.emit('click',{x:x,y:y});
	};
	this.ini();
}

var client=new Client();


client.socket.on('newplayer',function(data){	
    juego.addNewPlayer(data.id,data.x,data.y);        
});

client.socket.on('allplayers',function(data){
    console.log(data);
    for(var i = 0; i < data.length; i++){
        juego.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

client.socket.on('movimiento',function(data){	
    juego.moverNave(data.id,data.x,data.y,data.ang);        
});

// client.socket.on('obtenerPosicion',function(){	
//     juego.enviar();        
// });


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
