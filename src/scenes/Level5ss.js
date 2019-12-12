/*global Phaser*/
import * as ChangeScene from "./ChangeScene.js";
var platforms;
var doors;
var doors2;
var haveSwordss;
var turret, bullets, enemy, bullet;
var uplook = 0;
var look = 0;


export default class Level5 extends Phaser.Scene {
  constructor () {
    super('Level5');
  }

  init (data) {
    // Initialization code goes here
    this.hptrack = data.hptrack;
    this.haveKey = data.haveKey;
    this.haveVisit = data.haveVisit;
  }
  preload () {
    // Preload assets

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    this.level = 5;
    // Event listener to change scenes
    ChangeScene.addSceneEventListeners(this);

    if (!this.registry.get('music')[1].isPlaying) {
      this.registry.get('music')[0].stop();
      this.registry.get('music')[2].stop();
      this.registry.get('music')[3].stop();
      this.registry.get('music')[4].stop();
      this.registry.get('music')[1].play();
    }

    //Create the scene
    //Add background to scene
    var background = this.add.sprite(1000, 600, 'background2').setScale(1.1);

    //Level number
    this.levelNumber = this.add.text(700, 20, 'Level 5', {
      fontSize: '20px',
      fill: '#000'
    });
    this.levelNumber.setScrollFactor(0, 0);

    //************************PLATFORMS**************************
    //Add the platforms with staticGroup
    platforms = this.physics.add.staticGroup();
    platforms.collideWorldBounds = true;

    //Top
    platforms.create(1000, 0, 'ground').setScale(10,1).refreshBody();

    //Platforms level 1
    platforms.create(1000, 900, 'ground').setScale(2,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 2
    platforms.create(1700, 800, 'ground').setScale(1.5,.5).refreshBody();
    platforms.create(300, 800, 'ground').setScale(1.5,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 3
    platforms.create(1000, 700, 'ground').setScale(2,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 4
    platforms.create(1700, 600, 'ground').setScale(1.5,.5).refreshBody();
    platforms.create(300, 600, 'ground').setScale(1.5,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 5
    platforms.create(1000, 500, 'ground').setScale(2,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 6
    platforms.create(1700, 400, 'ground').setScale(1.5,.5).refreshBody();
    platforms.create(300, 400, 'ground').setScale(1.5,.5).refreshBody();
    platforms.collideWorldBounds = true;
    //*************************END OF PLATFORMS****************************

    //************************DOORS**************************
    //Add doors
    doors = this.physics.add.staticGroup();
    doors2 = this.physics.add.staticGroup();
    doors.create(100, 250, "reddoor-open").setScale(1).refreshBody();
    if (this.haveKey){
      doors2.create(1000, 450, "greendoor-open").setScale(1).refreshBody();
    }
    else{
      doors2.create(1000, 450, "greendoor-closed").setScale(1).refreshBody();
    }


    //************************ENEMIES**************************
    //ghost to dodge
    this.ghost = this.physics.add.sprite(this.centerX, this.centerY, 'ghost');
    this.ghost.setScale(0.15);
    this.ghost.body.allowGravity = false;
    this.ghost.hp = 3;
    this.ghost.setCollideWorldBounds(true);
    //animate ghost
    this.anims.create({
      key: "ghost_right",
      frames: this.anims.generateFrameNumbers("ghost", { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "ghost_left",
      frames: this.anims.generateFrameNumbers("ghost", { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1
    });

    // Add turret barrel to the tankBase
    this.turret = this.add.sprite(1000, 60, 'turret');
    this.turret.setScale(3);
    this.turret.setAngle(90);

    //bullets to dodge
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;
    //Add bullet group with a maximum of 10 bullets
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });

    this.swords = this.physics.add.group({
        key: 'sword',
        repeat: 0,
        setScale: 1,
        setXY: { x: 1800, y: 700, stepX: 200 },
    });
    this.swords.children.iterate(function(child) {
      child.setCollideWorldBounds(true);
    });

    if (haveSwordss == true){
      this.swords.children.iterate(function(child) {
        child.disableBody(true, true);
      });
    }

    this.haveSword = false;

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
    // How does this.scoreText move along the camera? The interval is [0,1].
    // 0 is fixed to camera. 1 is fixed to world. Everything else is in between.
    //Add player sprite with arcade physics and boundaries
    if(this.haveVisit == 0){
      this.player = this.physics.add.sprite(1900, 800, "playersAv");
    }
    else if(this.haveVisit == 1){
      this.player = this.physics.add.sprite(260, 160, "playersAv");
    }
    console.log(this.haveVisit);
    this.player.setSize(20, 25, true);
    this.player.displayOriginX = 0;
    this.player.displayOriginY = 0;
    this.player.displayWidth = 110;
    this.player.displayHeight = 110;
    this.player.setBounce(0.1);
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
    this.anims.create({
      key: "swordswingR",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 39, end: 48 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "swordswingL",
      frames: this.anims.generateFrameNumbers("playersAv", { start: 143, end: 152 }),
      frameRate: 10,
      repeat: -1
    });

    this.shields = this.physics.add.group({
        key: 'shield',
        repeat: 15,
        setXY: { x: 8, y: 0, stepX: 370 }
    });

    //Set main camera's bounraries and tell it follow the player
    this.cameras.main.setBounds(0, 0, 2000, 1000);
    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.shields, platforms);
    this.physics.add.collider(doors, platforms);
    this.physics.add.collider(doors2, platforms);
    //When they overlap, score is taken
    this.physics.add.overlap(this.player, this.shields, this.collectShield, null, this);
    this.physics.add.overlap(this.player, this.ghost, this.hitGhost, null, this);
    this.physics.add.overlap(this.player, this.swords, this.collectsword, null, this);
    this.physics.add.overlap(this.player, doors, this.sceneRoomKey, null, this);
    this.physics.add.overlap(this.player, doors2, this.sceneNext, null, this);
  }

  update (time, delta) {
    // Update the scene
    console.log(this.haveKey);
    // this.hpChange(this.hptrack);
    var towards = new Phaser.Math.Vector2();
    towards.x = this.player.x-this.ghost.x;
    towards.y = this.player.y-this.ghost.y;
    this.ghost.setVelocity(towards.x/2, towards.y/2);
    this.ghost.anims.play("ghost_right", true);
    this.bullets.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.collider(this.player, b, this.hitHp, null, this);
          if (b.y < 0) {
            b.setActive(false);
          } else if (b.y > this.cameras.main.height) {
            b.setActive(false);
          } else if (b.x < 0) {
            b.setActive(false);
          } else if (b.x > this.cameras.main.width) {
            b.setActive(false);
          }
        }
      }.bind(this)
    );
    // console.log("Current: " + time % 3000);
    if (time % 3000 <= 10 || time % 3000 >= 2900) {
      this.shoot();
    }

    if (this.gameOver)
    {
        this.physics.pause();
        // Event listener to change scenes
        ChangeScene.addSceneEventListeners(this);
        this.scene.start('GameOver');
    }
    //Set speed of player
    var speed = 10;

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
      this.player.y -= 20;
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

  render () {
    this.debug.cameraInfo(this.cameras, 32, 32);
  }

  //Adds to HP
  collectShield (player, shield){
      shield.disableBody(true, true);
      this.hpChange(1);
      }
  hitHp (player, bullet){
    console.log('hit');
    bullet.disableBody(true, true);
    this.hpChange(-1);
  }
  hitGhost (player, ghost){
    console.log('haunted');
    this.hpChange(-0.01);
    // The code below is only for testing the ghost's HP changing.
    if (ghost.hp <= 0) {
      ghost.disableBody(true, true);
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
    // console.log(this.hptrack);
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

  collectsword() {
    this.swords.children.iterate(function(child) {
      child.disableBody(true, true);
    });
    this.haveSword = true;
    haveSwordss = true;
  }
  sceneRoomKey() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.scene.start("RoomSceneKey2", {haveKey: this.haveKey, hptrack: this.hptrack, level: this.level});
  }
  sceneRoom() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.scene.start("RoomScene2", {haveKey: this.haveKey, hptrack: this.hptrack, level: this.level});
  }
  sceneNext() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    if(this.haveKey == true){
      this.scene.start("Win.js");
    }
  }
  shoot() {
    var velocityFromRotation = this.physics.velocityFromRotation;
    // Create a variable called velocity from a Vector2 (2D vector)
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(Math.PI/2, this.speed, velocity); // converts the vector from velocityFromRotation in physics to the (x,y) Vector2 notation
    // The angle measure above is in radians.
    bullet = this.bullets.get(); // create local bullet variable from global bullets (this.bullet) with the method get().
    bullet.setAngle(90); // looks at angle and rotates the bullets in accordance to the turret direction
    bullet.enableBody(true, this.turret.x, this.turret.y, true, true).setVelocity(velocity.x, velocity.y);
    // first true means be visible; second true means we want physics in it
  }
}
