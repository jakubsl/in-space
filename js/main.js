var GameState = function(game) {};

GameState.prototype.preload = function() {
  this.game.load.spritesheet('ship', '/assets/ship.png', 32, 32);
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = '#333333';

  //constants
  this.ROTATION_SPEED = 180;
  this.ACCELERATION = 200;
  this.MAX_SPEED = 250;

  this.ship = this.game.add.sprite(this.game.width/2, this.game.height/2, 'ship');
  this.ship.anchor.setTo(0.5, 0.5);
  this.ship.angle = -90;

  this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
  this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);

  this.game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN
  ]);
};

GameState.prototype.update = function() {
  //if ship out of screen, come back from the opposite side
  if (this.ship.x > this.game.width) this.ship.x = 0;
  if (this.ship.x < 0) this.ship.x = this.game.width;
  if (this.ship.y > this.game.height) this.ship.y = 0;
  if (this.ship.y < 0) this.ship.y = this.game.height;

  if (this.leftInputIsActive()) {
      //rotate left
      this.ship.body.angularVelocity = -this.ROTATION_SPEED;
  } else if (this.rightInputIsActive()) {
      //rotate righ
      this.ship.body.angularVelocity = this.ROTATION_SPEED;
  } else {
      //stop rotating
      this.ship.body.angularVelocity = 0;
  }

  if (this.upInputIsActive()) {
    //accelerate
    //calculate acceleration vector based on this.angle and this.ACCELERATION
    this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * this.ACCELERATION;8
    this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * this.ACCELERATION;

    //change frame when engine on
    this.ship.frame = 1;
  } else {
      //stop acceleration
      this.ship.body.acceleration.setTo(0, 0);
      //change frame when engine off
      this.ship.frame = 0;
  }
};

GameState.prototype.leftInputIsActive = function() {
    var isActive = false;
    //keyboard left
    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    //tapping or holding the left side of the screen
    isActive |= (this.game.input.activePointer.isDown &&
      this.game.input.activePointer.x < this.game.width/4);

    return isActive;
};

GameState.prototype.rightInputIsActive = function() {
  var isActive = false;
  //keyboard right
  isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
  //tapping or holding he right side of the screen
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

  return isActive;
};

GameState.prototype.upInputIsActive = function() {
  var isActive = false;
  //keyboard up
  isActive = this.input.keyboard.isDown(Phaser.Keyboard.UP);
  //tapping center of the screen
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width/4 &&
    this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

  return isActive;
};


var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
  game.state.add('game', GameState, true);