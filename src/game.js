let gameScene = new Phaser.Scene('Game');
let config ={
    type: Phaser.AUTO,
    width: 1010,
    height: 500,
    scene: gameScene,
    physics:{
        default: 'arcade',
        arcade:{
            debug:false
        }
    }
   
};
let game=new Phaser.Game(config);
let player;//global player
let playerSpeed = 3;
let dragonPlayer;
let dragons
let keys
let dragonKeys
let treasure;


var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    // Bullet Constructor
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },
    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));
        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

gameScene.init = function(){
    
}
gameScene.preload = function(){
    //place to add preload images
    this.load.image('background','assets/backgroundv1.png')
    this.load.image('player','assets/player.png')
    this.load.image('dragon','assets/dragon.png')
    this.load.image('treasure','assets/treasure.png')
    this.load.image('bullet','assets/bullet.png');
};

gameScene.create = function(){
    //setup for the game
    let background = this.add.image(0,0,'background')
    background.setOrigin(0,0)
    player = this.physics.add.sprite(1000,600,'player')
    player.setScale(0.5);
    player.setCollideWorldBounds(true);
    dragonPlayer = this.physics.add.sprite(2200,100,'dragon')
    dragonPlayer.setScale(0.5);
    dragonPlayer.setCollideWorldBounds(true);
    dragons = this.physics.add.group({
        key:'dragon',
        repeat:2,
        setXY:{x:180,y:60,stepX:100}
    })
   
    dragons.children.iterate(function(dragon){
        dragon.setVelocity(0,200);
        dragon.setCollideWorldBounds(true)
        dragon.setBounce(1);
    })
    this.physics.add.overlap(player,dragons,
        function(player,dragon){
            player.disableBody(true)
            dragon.setVelocity(0,0);
    })
    treasure = this.physics.add.sprite(Phaser.Math.FloatBetween(100,2100),Phaser.Math.FloatBetween(100,1100),'treasure');
    this.physics.add.overlap(player,treasure,function(player,treasure){
        player.disableBody(true)
        treasure.disableBody(true,true);
        dragons.children.iterate(function(dragon){
            dragon.setVelocity(0,0)
        })
        this.cameras.main.shake(250)
        let winningMessage = this.add.text(this.cameras.main.scrollX,this.cameras.main.scrollY,"Winner winner chicken dinner",{fontSize:'40px'})
    },null,this)
    this.physics.add.overlap(dragonPlayer,treasure,function(player,treasure){
        player.disableBody(true)
        treasure.disableBody(true,true);
        dragons.children.iterate(function(dragon){
            dragon.setVelocity(0,0)
        })
        this.cameras.cameras[1].shake(250)
        let winningMessage = this.add.text(this.cameras.cameras[1].scrollX,this.cameras.cameras[1].scrollY,"Winner winner chicken dinner",{fontSize:'40px'})
    },null,this)

    this.physics.world.setBounds(0,0,2240,1260)
    this.cameras.main.setBounds(0,0,2240,1260)
    this.cameras.main.setSize(500,500)
    this.cameras.main.startFollow(player);
    this.cameras.add(510,0,500,500);
    this.cameras.cameras[1].setBounds(0,0,2240,1260)
    this.cameras.cameras[1].startFollow(dragonPlayer);
    
    
    let bullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    })
    
   
    keys = this.input.keyboard.addKeys({
        'up':Phaser.Input.Keyboard.KeyCodes.UP,
        'down':Phaser.Input.Keyboard.KeyCodes.DOWN,
        'left':Phaser.Input.Keyboard.KeyCodes.LEFT,
        'right':Phaser.Input.Keyboard.KeyCodes.RIGHT,
        'fire':Phaser.Input.Keyboard.KeyCodes.CTRL,
        'turnRight':Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH,
        'turnLeft':Phaser.Input.Keyboard.KeyCodes.PERIOD
    })
    dragonKeys=this.input.keyboard.addKeys({
        'up':Phaser.Input.Keyboard.KeyCodes.W,
        'down':Phaser.Input.Keyboard.KeyCodes.S,
        'left':Phaser.Input.Keyboard.KeyCodes.A,
        'right':Phaser.Input.Keyboard.KeyCodes.D,
        'fire':Phaser.Input.Keyboard.KeyCodes.SPACE,
        'restart':Phaser.Input.Keyboard.KeyCodes.R,
        'turnRight':Phaser.Input.Keyboard.KeyCodes.B,
        'turnLeft':Phaser.Input.Keyboard.KeyCodes.V
    })
    this.input.keyboard.on('keydown_R',()=>{
        if (!player.active || !dragonPlayer.active) {
            player.enableBody(true, 100, 100, true)
            treasure.enableBody(true, Phaser.Math.FloatBetween(100, 2100), Phaser.Math.FloatBetween(100, 1100), true, true)
            dragonPlayer.enableBody(true, 2200, 100, true, true)
            dragons.add(this.physics.add.sprite(Phaser.Math.FloatBetween(100, 2100), Phaser.Math.FloatBetween(100, 1100), 'dragon'), true)
            console.log(dragons.getChildren().length)
            dragons.children.iterate((dragon) => {
                dragon.enableBody(true, Phaser.Math.FloatBetween(100, 2100), Phaser.Math.FloatBetween(100, 1100), true, true)
                dragon.setVelocity(0, 200);
                dragon.setCollideWorldBounds(true);
                dragon.setBounce(1)
            })
        }
        
        
    })
    this.input.keyboard.on('keydown_SPACE',()=>{
        console.log('fire')
        var bullet = bullets.get().setActive(true).setVisible(true);
        if(bullet){
            console.log("x: "+Math.acos(player.rotation)+ " and y: "+Math.asin(player.rotation))
            bullet.fire(player,{x:player.x+Math.cos(player.rotation),y:player.y+Math.sin(player.rotation)})
            this.physics.add.collider(dragons,bullet,(bullet,dragon)=>{
                dragon.disableBody(true,true)
                bullet.destroy();
            })
        }
    })
    this.input.keyboard.on('keydown_CTRL',()=>{
        console.log('fire')
        var bullet = bullets.get().setActive(true).setVisible(true);
        if(bullet){
            bullet.fire(dragonPlayer,{x:dragonPlayer.x+Math.cos(dragonPlayer.rotation),y:dragonPlayer.y+Math.sin(dragonPlayer.rotation)})
            this.physics.add.collider(dragons,bullet,(bullet,dragon)=>{
                dragon.disableBody(true,true)
                bullet.destroy();
            })
        }
    })
    
    
    
} 



gameScene.update = function(){
    //live actions controlling the player
   dragons.children.iterate((dragon)=>{
       if((Math.abs(player.x-dragon.x)<250&&Math.abs(player.y-dragon.y)<250) ){
        let direction = Math.atan((player.x-dragon.x)/(player.y-dragon.y))
        
       }
   })

    if(player.active){
        if(dragonKeys.turnLeft.isDown){
            player.setAngle(player.angle-playerSpeed)
        }else if(dragonKeys.turnRight.isDown){
            player.setAngle(player.angle+playerSpeed)
        }
        if(dragonKeys['up'].isDown){
            console.log(Math.sin(player.rotation)*playerSpeed+" "+Math.cos(player.rotation)*playerSpeed)
            if(player.rotation>0){
                player.x+=Math.sin(player.rotation)*playerSpeed
                player.y+=Math.cos(player.rotation)*playerSpeed
            }else{
                player.x+=-Math.sin(player.rotation)*playerSpeed
                player.y+=-Math.cos(player.rotation)*playerSpeed
            }
            
            
        }
        else if(dragonKeys['down'].isDown){
            player.y+=playerSpeed
        }
        if(dragonKeys['left'].isDown){
            player.x-=playerSpeed
        }
        else if(dragonKeys['right'].isDown){
            player.x+=playerSpeed
        }
        
    }else{
        
    }
    

    if (dragonPlayer.active) {
        if(keys.turnLeft.isDown){
            dragonPlayer.setAngle(dragonPlayer.angle-playerSpeed)
        }else if(keys.turnRight.isDown){
            dragonPlayer.setAngle(dragonPlayer.angle+playerSpeed)
        }
        if (keys.down.isDown) {
            dragonPlayer.y += playerSpeed
        }
        else if (keys.up.isDown) {
            dragonPlayer.y -= playerSpeed
        }
        if (keys.right.isDown) {
            dragonPlayer.x += playerSpeed
        }
        else if (keys.left.isDown) {
            dragonPlayer.x -= playerSpeed
        }
        
    }else{
       
    }
    
}
