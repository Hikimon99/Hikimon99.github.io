/*global Phaser*/
var platforms;
var floor;
var rug;
var bed;
var bookshelf, couch, table, stool, painting;
var doors;
var uplook = 0;
var look = 0;
export default class JumpTut1Key extends Phaser.Scene {
  constructor () {
    super('JumpTut1Key');
  }

  init (data) {
    // console.log(data.hptrack);
    //this.Level = data.Level
  }
  preload () {
    // Preload room assets
    this.load.image('ground', './assets/platform.png');
    this.load.spritesheet("playersAv", "./assets/spriteSheet/adventurer.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    //Load doors
    this.load.image('door-open', './assets/sprites/door-open.png');
    this.load.image('door-closed', './assets/sprites/door-closed.png');
    this.load.image('reddoor-open', './assets/sprites/reddoor-open.png');
    this.load.image('reddoor-closed', './assets/sprites/reddoor-closed.png');
    this.load.image('greendoor-open', './assets/sprites/greendoor-open.png');
    this.load.image('greendoor-closed', './assets/sprites/greendoor-closed.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    this.registry.get('music')[0].stop();
    this.registry.get('music')[1].stop();
    this.registry.get('music')[2].stop();
    this.registry.get('music')[3].stop();
    this.registry.get('music')[4].stop();

    //Add background to scene
    this.cameras.main.setBackgroundColor(0xfcecbd);

    //Create floor
    platforms = this.physics.add.staticGroup();
    platforms.create(790, 590, 'ground').setScale(10,1).refreshBody();

    //door out
    doors = this.physics.add.staticGroup();
    doors.create(750, 550, "door-open").refreshBody();
    //Add player sprite with arcade physics and boundaries
    this.player = this.physics.add.sprite(500, 500, "playersAv");
    this.player.setSize(20, 25, true);
    this.player.displayOriginX = 0;
    this.player.displayOriginY = 0;
    this.player.displayWidth = 110;
    this.player.displayHeight = 110;
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 780, 580);
    //Create animations from spriteSheet
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 13, end: 20 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 117, end: 124 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "jumpR",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 65, end: 70 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: "jumpL",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 169, end: 174 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: "jumpIdleR",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 14, end: 14 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "jumpIdleL",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 118, end: 118 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "idleR",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 0, end: 12 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "idleL",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 104, end: 116 }),
      frameRate: 5,
      repeat: -1
    });
    this.physics.add.overlap(this.player, doors, this.sceneRoom, null, this);
    this.physics.add.collider(this.player, platforms);
  }

  update (time, delta) {
    // Update the scene
    // this.hpChange(0);

    //Set speed of player
    var speed = 6;
    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    //Set speed of player
    var speed = 4;
    if (cursors.up.isDown == false){
      uplook = 0;
    if (cursors.left.isDown ) {
      this.player.x -= speed;
      this.player.anims.play("left", true);
      look = 1;
    }
    else if (cursors.right.isDown) {
      this.player.x += speed;
      this.player.anims.play("right", true);
      look = 0;
    }
    else {
      if(look == 0){
        this.player.anims.play("idleR", true);
      }
      else{
        this.player.anims.play("idleL", true);
      }
    }
    if (cursors.down.isDown) {
      uplook = 0;
      this.player.y += speed;
    }
  }
    else if (cursors.up.isDown) {
      uplook = 1;
      this.player.y -= 5.5;
      if (cursors.left.isDown){
          this.player.x -= speed;
          this.player.anims.play("jumpL", true);
          look = 1;
        }
      else if(cursors.right.isDown){
          this.player.x += speed;
          this.player.anims.play("jumpR", true);
          look = 0;
        }
      else if (look == 1 && cursors.right.isDown == false && cursors.left.isDown == false){
        this.player.anims.play("jumpIdleL", true);
      }
      else if (look == 0){
        this.player.anims.play("jumpIdleR", true);
      }
    }
  }
  //change HP based on gain or loss
  hpChange (hp){
    if(this.hptrack <= 5) {
      this.hptrack = Math.min(this.hptrack + hp, 5);
    }
    if(this.hptrack <= 0){
      this.gameOver = true;
    }
    console.log(this.hptrack);
    if(this.hptrack > 1.02){
      this.hpNum2.setActive(false).setVisible(true);
    }
    if(this.hptrack > 2.02){
      this.hpNum3.setActive(false).setVisible(true);
    }
    if(this.hptrack > 3.02){
      this.hpNum4.setActive(false).setVisible(true);
    }
    if(this.hptrack > 4.02){
      this.hpNum5.setActive(false).setVisible(true);
    }
    if(this.hptrack <= 1.02){
      this.hpNum2.setActive(false).setVisible(false);
    }
    if(this.hptrack <= 2.02){
      this.hpNum3.setActive(false).setVisible(false);
    }
    if(this.hptrack <= 3.02){
      this.hpNum4.setActive(false).setVisible(false);
    }
    if(this.hptrack <= 4.02){
      this.hpNum5.setActive(false).setVisible(false);
    }
  }
  sceneRoom() {
    if (uplook <= 0) return;
    this.scene.start("Level1s", {haveKey: this.haveKey, hptrack: this.hptrack});
  }
}
