// Initialising the actual phaser game object, 1st parameters is the size of the window with internal phaser.

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    //This object is registering our functions within the phaser object (Have to actually declare the functions themselves because phaser requires function declarations opposed to function expressions)
preload: preload,
create: create,
update: update


})
let platforms
let player
let diamonds
//Assets are being cooked in the backend
function preload () {
    game.load.image('sky', 'assets/sky.png')
    game.load.image('platform', 'assets/platform.png')
    game.load.image('diamond', 'assets/diamond.png')
    game.load.spritesheet('woof', 'assets/woof.png', 32, 32)


}


function create () {
//starts physics system
game.physics.startSystem(Phaser.Physics.ARCADE)

//Adds sprite for the sky
game.add.sprite(0, 0, 'sky')



//organising platform into groups
platforms = game.add.group()
platforms.enableBody = true

//platform at the bottom(size, location and name.followed by scaling of this(so that it will take up the entire bottom of the screen))
let ground = platforms.create(0, game.world.height - 64, 'platform')
ground.scale.setTo(2,2)
ground.body.immovable = true


//creating ledges ( given different properties so that will be in different areas)
let ledge = platforms.create(400, 450, 'platform')
ledge.body.immovable = true

ledge = platforms.create(-75, 350, 'platform')
ledge.body.immovable = true


///

//PLAYER!!!     (adds player)
player = game.add.sprite(32, game.world.height - 150, 'woof')
//lets physics affect player
game.physics.arcade.enable(player)
//applies gravity to player and bit of a bounce
player.body.bounce.y = 0.2
player.body.gravity.y = 800
//prevents player from falling out of world
player.body.collideWorldBounds = true
//Defines player animations within 'create' object.
//wolf sprite has for images, 0 1 2 3 refers to these directional images
player.animations.add('left', [0, 1], 10, true)
player.animations.add('right', [2, 3], 10, true)

////



//setting diamonds value to equal a new group
diamonds = game.add.group()
diamonds.enableBody = true

//creating each diamond with a for loop
for (var i = 0; i < 12; i++) {
    let diamond = diamonds.create(i * 70, 0, 'diamond')
    diamond.body.gravity.y = 1000
    diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    
diamond.body.collideWorldBounds = true
}


//creating score text
scoreText = game.add.text(16, 16, '', {fontSize: '32px', fill: '#000'})
//initializes controls
cursors = game.input.keyboard.createCursorKeys()
}

function update () {
    //adds collisions, so that player and diamonds dont go through template 
  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(diamonds, platforms)


    //logic when player comes into contact with diamond object
    
    //in overlap() function we are calling another function 'collectDiamond'
game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)

//(players velocity should be 0 so that he doesn't go sliding everywhere)
  player.body.velocity.x = 0

if (cursors.left.isDown) {
    player.body.velocity.x = -150
    //.play() this is how phaser handles the sprites
    player.animations.play('left')
} else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.animations.play('right')
}
  else {
      player.animations.stop()
  }

  if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -400
      player.animations.play('up')
  }

}




function collectDiamond (player, diamond) {
    //first it will kill/remove a diamond from the world
    diamond.kill()

    //this will increment our score by 10
    score += 10
    //this will set score text object to 10 above what it was before
    scoreText.text = 'Score: ' + score
}