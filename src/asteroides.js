
function Juego(){
    this.naves={};
    this.nave;
    this.cursors;

    this.preload=function() {
       game.load.image('space', '../recursos/deep-space.jpg');
       game.load.image('bullet', '../recursos/bullets.png');
       game.load.image('ship', '../recursos/ship.png');
    }
    this.init=function(){
        game.stage.disableVisibilityChange = true;
    }
    this.create=function() {
        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;
        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  A spacey background
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        //game.input.addPointer();
        
        cliente.nuevoJugador();
        
        //this.nave=new Nave(0,300,300);
        //this.naves[id]=nave;        

    }

    this.update=function() {
        //var id=$.cookie("usr");
        var nave;
        var id=cliente.id;
        nave=this.naves[id];        
        //nave=this.nave;
        //var sprite=nave.sprite;

        if (nave){
            if (game.input.mousePointer.isDown){
                var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.mousePointer.x, game.input.mousePointer.y);  nave.sprite.rotation = targetAngle;
                nave.mover(game.input.mousePointer.x,game.input.mousePointer.y,targetAngle);//nave.sprite.body.angularVelocity);            
            }

            // if (game.input.pointer1.isDown){
            //     var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.activePointer.x, game.input.activePointer.y);  nave.sprite.rotation = targetAngle;
            //     this.moverNave(id,game.input.pointer1.x,game.input.pointer1.y,nave.sprite.body.angularVelocity);   
            // }
            // if (this.cursors.up.isDown)
            // {
            //     game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
            // }
            // else
            // {
            //     sprite.body.acceleration.set(0);
            // }

            if (this.cursors.left.isDown)
            {
                nave.sprite.body.angularVelocity = -300;
            }
            else if (this.cursors.right.isDown)
            {
                nave.sprite.body.angularVelocity = 300;
            }
            else
            {
                nave.sprite.body.angularVelocity = 0;
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            {
                nave.disparar();
            }

            this.screenWrap(nave.sprite);

            //this.bullets.forEachExists(this.screenWrap, this);     
            nave.bullets.forEachExists(this.screenWrap, this);    
        }
    }

    this.agregarJugador = function(id,x,y){
        var nave=new Nave(id,x,y);
        this.naves[id]=nave;
    }

    this.moverNave=function(id,x,y,ang){        
        var nave=this.naves[id];
        nave.mover(x,y,ang,true);        
    }

    this.screenWrap=function(sprite) {
       
        if (sprite.x < 0)
        {
            sprite.x =game.width;
        }
        else if (sprite.x >game.width)
        {
            sprite.x = 0;
        }

        if (sprite.y < 0)
        {
            sprite.y =game.height;
        }
        else if (sprite.y >game.height)
        {
            sprite.y = 0;
        }

    }

    this.render=function() {
    }
}

function Nave(id,x,y){
    this.id=id;
    this.x=x;
    this.y=y;
    this.sprite;
    this.bullets;
    this.bullet;
    this.bulletTime = 0;
    this.mover=function(x,y,ang,socket){       
        this.sprite.rotation=ang;      
        //var targetAngle = game.math.angleBetween(this.sprite.x, this.sprite.y,x,y);  this.sprite.rotation = targetAngle;
        var distance=Phaser.Math.distance(this.sprite.x, this.sprite.y, x, y);
        var duration = distance*3;
        var tween = game.add.tween(this.sprite);
        tween.to({x:x,y:y}, duration);
        tween.start();
        if (!socket)
            tween.onComplete.add(this.onComplete, this);
    }
    this.onComplete=function(){
        //var nave=this.playerMap[$.cookie("usr")];
        //client.enviarPosicion(this.sprite.x,this.sprite.y,this.sprite.rotation);
    }
    this.disparar=function() {

        if (game.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
               this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
               this.bullet.lifespan = 1000;
               this.bullet.rotation = this.sprite.rotation;
               game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
               this.bulletTime =game.time.now + 50;
            }
        }
    }
    this.ini=function(){
        this.bullets= game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        this.bullets.createMultiple(40, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        this.sprite = game.add.sprite(this.x, this.y, 'ship');
        this.sprite.anchor.set(0.5);

        //  and its physics settings
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(50);
        this.sprite.body.maxVelocity.set(200);
    }
    this.ini();
}