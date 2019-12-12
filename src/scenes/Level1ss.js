/*global Phaser*/
import * as ChangeScene from "./ChangeScene.js";
var platforms;
var doors;
var doors2;
var doors3;
var haveKey = false;
var uplook = 0;
var location;
var look = 0;
var shields;
var wavetime = 0;

export default class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    this.haveKey = data.haveKey;
    this.hptrack = this.registry.get('currentHP');
  }
  preload () {



    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    if (!this.registry.get('music')[1].isPlaying) {
      this.registry.get('music')[0].stop();
      this.registry.get('music')[2].stop();
      this.registry.get('music')[3].stop();
      this.registry.get('music')[4].stop();
      this.registry.get('music')[1].play();
    }
    
    var background = this.add.sprite(1000, 600, 'background').setScale(1.1);
    var b1 = this.add.sprite(60, 40, 'start-button', 4).setScale(0.7).setInteractive();
    b1.setScale(.4);
    b1.setScrollFactor(0,0);
    b1.on("pointerover", function() {
      this.setFrame(4);
    });
    b1.on("pointerout", function() {
      this.setFrame(5);
    });

    b1.on("pointerup", function() {
      this.scene.start("SelectScene");
    }, this
  );
    // Event listener to change scenes
    ChangeScene.addSceneEventListeners(this);
    //Create the scene
    //Add background to scene

    //Level number
    this.levelNumber = this.add.text(700, 20, 'Level 1', {
      fontSize: '20px',
      fill: '#000'
    });
    this.levelNumber.setScrollFactor(0, 0);

    // WATER****************************************
    this.water = this.physics.add.sprite(this.centerX, this.registry.get('waveloco'), 'waves');
    this.water.setScale(2);
    this.water.body.setAllowGravity(false);
    this.anims.create({key: "wavefeel", frames: this.anims.generateFrameNumbers("waves", {start: 0, end: 5}), frameRate: 6, repeat: -1});

    //************************PLATFORMS**************************
    //Add the platforms with staticGroup
    platforms = this.physics.add.staticGroup();

    //Top
    platforms.create(1000, 0, 'ground').setScale(10,1).refreshBody();
    //Platforms level 1
    platforms.create(1700, 900, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1300, 800, 'ground').setScale(1,.5).refreshBody();
    platforms.create(900, 800, 'ground').setScale(1,.5).refreshBody();
    platforms.create(500, 800, 'ground').setScale(1,.5).refreshBody();
    platforms.create(100, 800, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1700, 700, 'ground').setScale(1,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 2
    platforms.create(1300, 600, 'ground').setScale(1,.5).refreshBody();
    platforms.create(900, 600, 'ground').setScale(1,.5).refreshBody();
    platforms.create(450, 600, 'ground').setScale(1,.5).refreshBody();
    platforms.create(100, 500, 'ground').setScale(1,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 3
    platforms.create(470, 400, 'ground').setScale(1,.5).refreshBody();
    platforms.create(900, 400, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1400, 400, 'ground').setScale(1.5,.5).refreshBody();
    platforms.create(1900, 400, 'ground').setScale(1,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //*************************END OF PLATFORMS****************************

    //*************************DOORS****************************
    doors = this.physics.add.staticGroup();
    doors2 = this.physics.add.staticGroup();
    doors3 = this.physics.add.staticGroup();
    doors.create(500, 750, "reddoor-open").setScale(1).refreshBody();
    doors2.create(1900, 350, "greendoor-closed").setScale(1).refreshBody();
    doors3.create(100, 750, "door-open").setScale(1).refreshBody();
    //*************************END OF DOORS************

    //*************************HP BAR AND ITEM BOX************
    //Add item box
    this.itemBox = this.add.sprite(170, 535, "itemBox").setScale(0.5);
    this.itemBox.setScrollFactor(0, 0);

    //Add HP bar
    this.HPBar = this.add.sprite(90, 470, "hp-bar").setScale(0.8);
    this.HPBar.setScrollFactor(0, 0);

    //Measurements to keep track of game progress
    this.gameOver = false;
    this.touchRoom = false;
    this.haveKey = haveKey;
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

    // How does this.scoreText move along the camera? The interval is [0,1].
    this.hpChange(0);
    // 0 is fixed to camera. 1 is fixed to world. Everything else is in between.
    //Add player sprite with arcade physics and boundaries
    this.player = this.physics.add.sprite(1900, 800, "playersAv");
    this.player.setSize(20, 25, true);
    this.player.displayOriginX = 0;
    this.player.displayOriginY = 0;
    this.player.displayWidth = 90;
    this.player.displayHeight = 90;
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 2000, 1000);
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

    //***********************HP SHIELDS*******************
    shields = this.physics.add.staticGroup();

    shields.create(1700, 865, 'shield').setScale(.3).refreshBody();
    shields.create(900, 565, 'shield').setScale(.3).refreshBody();
    shields.create(140, 465, 'shield').setScale(.3).refreshBody();
    shields.create(1400, 365, 'shield').setScale(.3).refreshBody();
    shields.create(1800, 365, 'shield').setScale(.3).refreshBody();
    //***********************END OF HP SHIELDS**************

    //************************CAMERA***************************
    //Set main camera's bounraries and tell it follow the player
    this.cameras.main.setBounds(0, 0, 2000, 1000);
    this.cameras.main.startFollow(this.player);
    //************************END OF CAMERA***************************

    //************************COLLIDER AND OVERLAPS************
    //this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(platforms, this.player);
    this.physics.add.collider(doors, platforms);
    this.physics.add.collider(shields, platforms);
    //When they overlap, score is taken
    this.physics.add.overlap(this.player, shields, this.collectShield, null, this);
    this.physics.add.overlap(this.player, doors, this.sceneRoomKey, null, this);
    this.physics.add.overlap(this.player, doors2, this.sceneNext, null, this);
    this.physics.add.overlap(this.player, doors3, this.sceneRoom, null, this);
    this.physics.add.overlap(this.player, this.water, this.hitWater, null, this);
    // Like in other adventure games, we have to choose to go into the room to go into the room.
    //***********************END OF COLLIDER AND OVERLAPS************
  }

  update (time, delta) {
    this.water.anims.play("wavefeel", true);
    if (wavetime % 1000 >= 0 && wavetime % 1000 < 1) {
      this.water.y -= .3;
    }

    // Update the scene
    //*****************************PLAYER ANIMATION*******************
    //Set speed of player
    var speed = 5;
    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    var attackKey = this.input.keyboard.addKey('SPACE');
    var up = this.input.keyboard.addKey('W');
    var left = this.input.keyboard.addKey('A');
    var right = this.input.keyboard.addKey('D');
    var down = this.input.keyboard.addKey('S');
    if (this.physics.overlap(this.player, platforms)) this.player.y = this.player.y;
    else if (this.haveSword && attackKey.isDown){
      if (up.isDown == false){
      if (left.isDown ) {
        this.player.x -= speed;
        this.player.anims.play("swordswingL", true);
        look = 0;
      }
      else if (right.isDown) {
        this.player.x += speed;
        this.player.anims.play("swordswingR", true);
        look = 1;
      }
      else {
        if(look == 1){
          this.player.anims.play("swordswingL", true);
        }
        else{
          this.player.anims.play("swordswingR", true);
        }
      }
    }
      else if (up.isDown) {
        this.player.y -= 5.5;
        if (left.isDown){
            this.player.x -= speed;
            this.player.anims.play("swordswingL", true);
            look = 1;
          }
        else if(right.isDown){
            this.player.x += speed;
            this.player.anims.play("swordswingR", true);
            look = 0;
          }
        else if (look == 1 && right.isDown == false && left.isDown == false){
          this.player.anims.play("swordswingL", true);
        }
        else if (look == 0){
          this.player.anims.play("swordswingR", true);
        }
      }
    }
    else if (up.isDown == false){
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
      this.player.y -= 6;
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

//*****************************GAME OVER CHANGE SCENE********8
    if( this.gameOver)
    {
        this.physics.pause();
        // Event listener to change scenes
        ChangeScene.addSceneEventListeners(this);
        this.scene.start('GameOver');
    }
//*******************************END OF GAME OVER CHANGE SCENE
  }
  //************************END OF PLAYER ANIMATION********************

  render () {
    this.debug.cameraInfo(this.cameras, 32, 32);
  }

  //***************************HP RELATED****************************
  //Adds to HP
  collectShield (player, shield){
      shield.disableBody(true, true);
      this.sound.play('plusshield');
      this.hpChange(1);
      }
  hitHp (player, bullet){
    console.log('hit');
    bullet.disableBody(true, true);
    this.sound.play('gothit');
    this.hpChange(-1);
  }

  hpChange (hp){
    if(this.hptrack <= 5) {
      this.hptrack = Math.min(this.hptrack + hp, 5);
    }
    if(this.hptrack <= 0){
      this.sound.play('losegame');
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
  //*************************END OF HP RELATED*********************
  hitWater (player, water) {
    console.log('submerged');
    this.hpChange(-0.01);
  }
  //*************************SCENE CHANGE RELATED************
  sceneRoomKey() {
    if (uplook <= 0) return;
    this.registry.set('waveloco', this.water.y);
    ChangeScene.addSceneEventListeners(this);
    this.scene.start("RoomSceneKey", {haveKey: this.haveKey, hptrack: this.hptrack});
  }
  sceneRoom() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.scene.start("RoomScene", {haveKey: this.haveKey, hptrack: this.hptrack});
  }
  sceneNext() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    if(this.haveKey == true){
      this.registry.set('waveloco', 1550);
      this.sound.play('nextlevel');
      this.scene.start("Level2");
    }
  }
  //***************************END OF SCENE CHANGES
}
