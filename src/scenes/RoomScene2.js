/*global Phaser*/
import * as ChangeScene from "./ChangeScene.js";
var platforms;
var floor;
var rug;
var bed;
var bookshelf, couch, table, stool, painting;
var doors;
var uplook = 0;
var look = 0;
export default class RoomScene2 extends Phaser.Scene {
  constructor () {
    super('RoomScene2');
  }

  init (data) {
    // console.log(data.hptrack);
    this.haveKey = data.haveKey;
    this.hptrack = data.hptrack;
    this.level = data.level
  }
  preload () {
    // Preload room assets
    this.load.image('bed', './assets/sprites/bed.png');
    this.load.image('bookshelf', './assets/sprites/bookshelf.png');
    this.load.image('couch', './assets/sprites/couch.png');
    this.load.image('painting', './assets/sprites/painting.png');
    this.load.image('rug', './assets/sprites/rug.png');
    this.load.image('stool', './assets/sprites/stool.png');
    this.load.image('table', './assets/sprites/table.png');
    this.load.image('floor', './assets/sprites/floor.png');
    this.load.image('ground', './assets/platform.png');

    //HP
    this.load.image("hp", "./assets/images/GreenHealth.png");
    this.load.image("hp-bar", "./assets/images/HealthBar.png");

    //Item box
    this.load.image("itemBox", "./assets/images/ItemBox.png");

    //Load doors
    this.load.image('door-open', './assets/sprites/door-open.png');
    this.load.image('door-closed', './assets/sprites/door-closed.png');
    this.load.image('reddoor-open', './assets/sprites/reddoor-open.png');
    this.load.image('reddoor-closed', './assets/sprites/reddoor-closed.png');
    this.load.image('greendoor-open', './assets/sprites/greendoor-open.png');
    this.load.image('greendoor-closed', './assets/sprites/greendoor-closed.png');

    this.load.spritesheet("playersAv", "./assets/spriteSheet/adventurer.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    //Music
    this.registry.get('music')[0].stop();
    this.registry.get('music')[1].stop();
    this.registry.get('music')[2].stop();
    this.registry.get('music')[3].stop();
    this.registry.get('music')[4].stop();
    this.registry.get('music')[2].play();

    // Event listener to change scenes
    ChangeScene.addSceneEventListeners(this);

    //Add background to scene
    this.cameras.main.setBackgroundColor(0xfcecbd);

    //Create floor
    platforms = this.physics.add.staticGroup();
    floor = this.physics.add.staticGroup();
    floor.create(455, 560, 'floor').setScale(1).refreshBody();
    floor.create(455, 470, 'floor').setScale(1).refreshBody();
    floor.create(455, 380, 'floor').setScale(1).refreshBody();
    platforms.create(1000, 1000, 'ground').setScale(10,1).refreshBody();

    //*************************HP BAR AND ITEM BOX************
    //Add item box
    this.itemBox = this.add.sprite(400, 50, "itemBox").setScale(0.5);
    this.itemBox.setScrollFactor(0, 0);

    //Add HP bar
    this.HPBar = this.add.sprite(400, 120, "hp-bar").setScale(0.8);
    this.HPBar.setScrollFactor(0, 0);

    this.hpNum1 = this.add.sprite(100, 470, "hp").setScale(0.8);
    this.hpNum1.setScrollFactor(0, 0);
    this.hpNum2 = this.add.sprite(110.5, 470, "hp").setScale(0.8);
    this.hpNum2.setScrollFactor(0, 0);
    this.hpNum3 = this.add.sprite(121, 470, "hp").setScale(0.8);
    this.hpNum3.setScrollFactor(0, 0);
    this.hpNum4 = this.add.sprite(131.5, 470, "hp").setScale(0.8);
    this.hpNum4.setScrollFactor(0, 0);
    this.hpNum5 = this.add.sprite(142, 470, "hp").setScale(0.8);
    this.hpNum5.setScrollFactor(0, 0);
    this.hpNum2.setActive(false).setVisible(false);
    this.hpNum3.setActive(false).setVisible(false);
    this.hpNum4.setActive(false).setVisible(false);
    this.hpNum5.setActive(false).setVisible(false);

    this.hpChange(0);

    //Create the scene
    bed = this.physics.add.staticGroup();
    bed.create(90, 350, 'bed').setScale(0.15).refreshBody();
    rug = this.physics.add.staticGroup();
    rug.create(425, 475, 'rug').setScale(1.8).refreshBody();
    bookshelf = this.physics.add.staticGroup();
    bookshelf.create(650, 300, 'bookshelf').setScale(1.5).refreshBody();
    couch = this.physics.add.staticGroup();
    couch.create(300, 320, 'couch').setScale(1.5).refreshBody();
    table = this.physics.add.staticGroup();
    table.create(450, 490, 'table').setScale(1.5).refreshBody();
    stool = this.physics.add.staticGroup();
    stool.create(450, 435, 'stool').setScale(1.5).refreshBody();
    stool.create(450, 545, 'stool').setScale(1.5).refreshBody();
    painting = this.physics.add.staticGroup();
    painting.create(300, 170, 'painting').setScale(1.5).refreshBody();

    //door out
    doors = this.physics.add.staticGroup();
    doors.create(700, 500, "door-open").refreshBody();
    //Add player sprite with arcade physics and boundaries
    this.player = this.physics.add.sprite(500, 500, "playersAv");
    this.player.setSize(20, 25, true);
    this.player.displayOriginX = 0;
    this.player.displayOriginY = 0;
    this.player.displayWidth = 110;
    this.player.displayHeight = 110;
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 745, 540);
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
  }

  update (time, delta) {
    // Update the scene
    // this.hpChange(0);
    if (this.gameOver)
    {
        this.physics.pause();
        // Event listener to change scenes
        ChangeScene.addSceneEventListeners(this);
        this.scene.start('GameOver');
    }
    // console.log(this.hptrack);
    //Set speed of player
    var speed = 6;
    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    var up = this.input.keyboard.addKey('UP');
    var left = this.input.keyboard.addKey('LEFT');
    var right = this.input.keyboard.addKey('RIGHT');
    var down = this.input.keyboard.addKey('DOWN');
    //Set speed of player
    var speed = 5;
    if (up.isDown == false){
      uplook = 0;
    if (left.isDown ) {
      this.player.x -= speed;
      this.player.anims.play("left", true);
      look = 1;
    }
    else if (right.isDown) {
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
    if (down.isDown) {
      uplook = 0;
      this.player.y += speed;
    }
  }
    else if (up.isDown) {
      uplook = 1;
      this.player.y -= 5.5;
      if (left.isDown){
          this.player.x -= speed;
          this.player.anims.play("jumpL", true);
          look = 1;
        }
      else if(right.isDown){
          this.player.x += speed;
          this.player.anims.play("jumpR", true);
          look = 0;
        }
      else if (look == 1 && right.isDown == false && left.isDown == false){
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
  collectkey() {
    this.keyers.children.iterate(function(child) {
      child.disableBody(true, true);
    });
    this.haveKey = true;
    console.log(this.haveKey);
  }
  sceneRoom() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.scene.start("Level2", {haveKey: this.haveKey, hptrack: this.hptrack});
  }
}
