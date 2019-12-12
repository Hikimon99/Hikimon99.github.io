/*global Phaser*/
import * as ChangeScene from "./ChangeScene.js";
var platforms;
var shields;
var doors;
var doors2;
// var doors3;
var turret, bullets, enemy, bullet1, bullet2, bullet3, bullet5;
var uplook = 0;
var look = 0;
var graphics;
var spooky = 0; // if 1, then can attack ghost
var wavetime = 0;
var healclick = false;
var lastSlash = 0;
var spaceDown = false;
var dict = {};

export default class Level3 extends Phaser.Scene {
  constructor () {
    super('Level3');
  }

  init (data) {
    // Initialization code goes here
    this.hptrack = this.registry.get('currentHP');
    this.haveKey = data.haveKey;
    this.haveVisit = data.haveVisit;
    this.numShield = this.registry.get('HealItem');
    this.haveSword = true;
    this.textisSet = false;
    this.spawn = true;
    this.level = 3;
    this.keyers;
  }
  preload () {
    // Preload assets
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.invent = [[279, 60, 0],
    [326, 60, 0],
    [374, 60, 0],
    [422, 60, 0],
    [470, 60, 0],
    [518, 60, 0]];
                   // 0 = key
                   // 1 = sword
                   // 2 = shield
  }


  create (data) {
    //Music
    if (!this.registry.get('music')[1].isPlaying) {
      this.registry.get('music')[0].stop();
      this.registry.get('music')[2].stop();
      this.registry.get('music')[3].stop();
      this.registry.get('music')[4].stop();
      this.registry.get('music')[1].play();
    }

    //Create the scene
    var background = this.add.sprite(1000, 500, 'background2').setScale(1.1);

    var b1 = this.add.sprite(60, 40, 'buttons', 4).setScale(0.7).setInteractive();
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
    }, this);
    // Event listener to change scenes
    ChangeScene.addSceneEventListeners(this);

    // WATER****************************************
    this.water = this.physics.add.sprite(900, this.registry.get('waveloco'), 'waves');
    this.water.setScale(20, 2);
    this.water.body.setAllowGravity(false);
    this.anims.create({key: "wavefeel", frames: this.anims.generateFrameNumbers("waves", {start: 0, end: 5}), frameRate: 6, repeat: -1});

    // Background water spilling
    var crack = this.add.sprite(1820, 600, 'crack').setScale(0.3);
    var wpark0 = this.add.particles('blu');
    var emitter0 = wpark0.createEmitter({lifespan: 3000, speedX:{min: -50, max: 50}, speedY:{min: 0, max: 0},
      scale: {start: 0, end: 0}, // won't end
      blendMode: 'NORMAL'
    });
    emitter0.setScale(0.5);
    emitter0.setPosition(1820, 600);
    emitter0.setGravityY(500);

    var crack = this.add.sprite(220, 600, 'crack').setScale(0.3);
    var wpark1 = this.add.particles('blu');
    var emitter1 = wpark1.createEmitter({lifespan: 3000, speedX:{min: -50, max: 50}, speedY:{min: 0, max: 0},
      scale: {start: 0, end: 0}, // won't end
      blendMode: 'NORMAL'
    });
    emitter1.setScale(0.5);
    emitter1.setPosition(220, 600);
    emitter1.setGravityY(500);
    //***********************END OF WATER*************************


    //Level number
    this.levelNumber = this.add.text(725, 20, 'Level 3', {
      fontFamily: 'Maven Pro',
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
    platforms.create(1780, 900, 'ground').setScale(1, .5).refreshBody();
    platforms.create(220, 900, 'ground').setScale(1, .5).refreshBody();
    platforms.create(1450, 800, 'ground').setScale(.5, .5).refreshBody();
    platforms.create(1000, 750, 'ground').setScale(2, .5).refreshBody();
    platforms.create(550, 800, 'ground').setScale(.5, .5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 2
    platforms.create(1820, 700, 'ground').setScale(1, .5).refreshBody();
    platforms.create(180, 700, 'ground').setScale(1, .5).refreshBody();
    platforms.create(1420, 600, 'ground').setScale(.5, .5).refreshBody();
    platforms.create(1000, 500, 'ground').setScale(1, .5).refreshBody();
    platforms.create(580, 600, 'ground').setScale(.5, .5).refreshBody();
    platforms.collideWorldBounds = true;
    //*************************END OF PLATFORMS****************************


    //*************************DOORS****************************
    //Add doors
    this.doors2 = this.physics.add.sprite(1000, 450, 'greendoor-closed');
    //***********************END OF DOORS***************


    //***********************ENEMIES***************
    //snake to dodge
    this.snake = this.physics.add.sprite(1150, 650, 'shark');
    this.snake.setScale(2.5);
    this.snake.setCollideWorldBounds(true);
    this.snake.id = 1;
    this.createHP(this.snake);
    this.tweens.add({
      targets: this.snake,
      x: 800,
      ease: "Linear",
      duration: 3000,
      yoyo: true,
      repeat: -1
    });
    //animate snake
    this.anims.create({
      key: "shark_right",
      frames: this.anims.generateFrameNumbers("shark", { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "shark_left",
      frames: this.anims.generateFrameNumbers("shark", { start: 6, end: 11 }),
      frameRate: 6,
      repeat: -1
    });

    // Add turrets
    this.turret1 = this.add.sprite(1700, 880, 'turret');
    this.turret1.setScale(1);
    this.turret1.setAngle(270);

    this.turret2 = this.add.sprite(300, 880, 'turret');
    this.turret2.setScale(1);
    this.turret2.setAngle(270);

    this.turret3 = this.add.sprite(580, 580, 'turret');
    this.turret3.setScale(1);
    this.turret3.setAngle(270);

    this.turret5 = this.add.sprite(1420, 580, 'turret');
    this.turret5.setScale(1);
    this.turret5.setAngle(270);

    //bullets to dodge
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;
    //Add bullet group with a maximum of 10 bullets
    this.bullets1 = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.bullets2 = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.bullets3 = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });
    this.bullets5 = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 10
    });

    if (this.registry.get('HoldSword') == false){
    this.swordss = this.physics.add.sprite(1800, 700, 'sword');
    this.swords = this.physics.add.group(this.swordss);
    this.swords.children.iterate(function(child) {
      child.setCollideWorldBounds(true);
    });
  }

  //***********************END OF ENEMIES***************

    // How does this.scoreText move along the camera? The interval is [0,1].
    // 0 is fixed to camera. 1 is fixed to world. Everything else is in between.
    //Add player sprite with arcade physics and boundaries
    if(this.haveVisit == 0){
      this.player = this.physics.add.sprite(1900, 800, "playersAv");
    }
    //greendoor not adjusted
    else {
      this.player = this.physics.add.sprite(1040, 640, "playersAv");
    }
    this.player.setSize(20, 25, true);
    this.player.displayOriginX = 0;
    this.player.displayOriginY = 0;
    this.player.displayWidth = 110;
    this.player.displayHeight = 110;
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 2000, 1000);

    //*************************HP BAR AND ITEM BOX************
    //Add item box
    this.itemBox = this.add.sprite(400, 50, "itemBox").setScale(0.5);
    this.itemBox.setScrollFactor(0, 0);

    //Add HP bar
    this.player.HPBar = this.add.sprite(400, 120, "hp-bar").setScale(0.8);
    this.player.HPBar.setScrollFactor(0, 0);

    //Measurements to keep track of game progress
    this.gameOver = false;
    this.touchRoom = false;
    this.player.hp1 = this.add.sprite(410, 120, "hp").setScale(0.8);
    this.player.hp1.setScrollFactor(0, 0);
    this.player.hp2 = this.add.sprite(420.5, 120, "hp").setScale(0.8);
    this.player.hp2.setScrollFactor(0, 0);
    this.player.hp3 = this.add.sprite(431, 120, "hp").setScale(0.8);
    this.player.hp3.setScrollFactor(0, 0);
    this.player.hp4 = this.add.sprite(441.5, 120, "hp").setScale(0.8);
    this.player.hp4.setScrollFactor(0, 0);
    this.player.hp5 = this.add.sprite(452, 120, "hp").setScale(0.8);
    this.player.hp5.setScrollFactor(0, 0);
    this.player.hp1.setActive(false).setVisible(true);
    this.player.hp2.setActive(false).setVisible(false);
    this.player.hp3.setActive(false).setVisible(false);
    this.player.hp4.setActive(false).setVisible(false);
    this.player.hp5.setActive(false).setVisible(false);
    this.hpChange(this.player, 0, this.hptrack, 0);
    this.refill();
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

    //***********************HP SHIELDS*******************
    if (this.registry.get('NewWeed')==0) {
      this.registry.set('NewWeed', 1);
      this.registry.set('ThereWeed', [1,1,1,1,1]);
    }
    shields = this.physics.add.staticGroup();

    shields.create(1800, 665, 'shield').setScale(0.3).refreshBody();
    shields.create(1450, 765, 'shield').setScale(0.3).refreshBody();
    shields.create(550, 765, 'shield').setScale(0.3).refreshBody();
    shields.create(200, 665, 'shield').setScale(0.3).refreshBody();

    var array = this.registry.get('ThereWeed');
    for (let i=0; i < 5; ++i) {
      dict[shields.getChildren()[i]] = i;
      if (array[i] == 0) shields.getChildren()[i].disableBody(true, true);
    }
    //***********************END OF HP SHIELDS**************

    //************************CAMERA***************************
    //Set main camera's bounraries and tell it follow the player
    this.cameras.main.setBounds(0, 0, 2000, 1000);
    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(shields, platforms);
    this.physics.add.collider(this.doors2, platforms);
    this.physics.add.collider(this.snake, platforms);
    //When they overlap, score is taken
    this.physics.add.overlap(this.player, shields, this.collectShield, null, this);
    this.physics.add.overlap(this.player, this.swords, this.collectsword, null, this);
    this.physics.add.overlap(this.player, this.snake, this.hitGhost, null, this);
    this.physics.add.overlap(this.player, doors, this.sceneRoomKey, null, this);
    this.physics.add.overlap(this.player, this.doors2, this.sceneNext, null, this);
    this.physics.add.overlap(this.player, this.water, this.hitWater, null, this);
    this.rect = new Phaser.Geom.Rectangle(this.player.x-35, this.player.y+20, 55, 80);
      graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } }); // temporary
      // Like in other adventure games, we have to choose to go into the room to go into the room.
      //***********************END OF COLLIDER AND OVERLAPS************
    }

    update (time, delta) {
      this.water.anims.play("wavefeel", true);
      if (wavetime % 1000 >= 0 && wavetime % 1000 < 1) {
        this.water.y -= .3;
      }
    // Update the scene
    graphics.clear();
    graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } }); // temporary
    // Update the scene
    var srect = new Phaser.Geom.Rectangle(this.snake.x-this.snake.displayWidth/2, this.snake.y-this.snake.displayHeight/2, this.snake.displayWidth, this.snake.displayHeight);
    if (look == 1) {
      this.rect.setTo(this.player.x-35, this.player.y+20, 55, 80);
    }
    else {
      this.rect.setTo(this.player.x+90, this.player.y+20, 55, 80);
    }
    // this.hpChange(this.hptrack);
    this.snake.HPBar.x = this.snake.x -10;
    this.snake.HPBar.y = this.snake.y-50;
    this.snake.hp1.x = this.snake.x ;
    this.snake.hp1.y = this.snake.y-50;
    this.snake.hp2.x = this.snake.x +10.5;
    this.snake.hp2.y = this.snake.y-50;
    this.snake.hp3.x = this.snake.x +21;
    this.snake.hp3.y = this.snake.y-50;
    this.snake.hp4.x = this.snake.x +31.5;
    this.snake.hp4.y = this.snake.y-50;
    this.snake.hp5.x = this.snake.x +42;
    this.snake.hp5.y = this.snake.y-50;
    var towards = new Phaser.Math.Vector2();
    towards.x = this.player.x-this.snake.x;
    towards.y = this.player.y-this.snake.y;
    if (this.player.x > this.snake.x){
      this.snake.anims.play("shark_right", true);
    }
    else{
      this.snake.anims.play("shark_left", true);
    }
    //console.log(this.haveKey);
    // this.hpChange(this.hptrack);
    this.bullets1.children.each(
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
    this.bullets2.children.each(
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
    this.bullets3.children.each(
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
    this.bullets5.children.each(
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
    var speed = 5;

    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    var slot1 = this.input.keyboard.addKey('C');
    var attackKey = this.input.keyboard.addKey('SPACE');
    var up = this.input.keyboard.addKey('UP');
    var left = this.input.keyboard.addKey('LEFT');
    var right = this.input.keyboard.addKey('RIGHT');
    var down = this.input.keyboard.addKey('DOWN');
    //if (this.physics.overlap(this.player, platforms) || this.physics.collide(this.player, platforms)) {
      if (this.haveSword && attackKey.isDown && spaceDown == false && time - lastSlash >= 700) {
        lastSlash = time + 0;
        if (Phaser.Geom.Rectangle.Overlaps(this.rect, srect)) {
          this.registry.set("hitme", true);
          this.hpChange(this.snake, -1, this.snake.hp, this.snake.id);
          // push back ghost based on vector 'towards'
          var dist = Math.sqrt(towards.x*towards.x+towards.y*towards.y);
          var gha = towards.x/dist; var ghb = towards.y/dist; // normalized
          gha = 50*gha; ghb = 50*ghb; // push-back now with distance 25
          this.snake.x = this.snake.x - gha;
        }
        if( this.registry.get('hitme')){
          this.sound.play('PowerDown');
          this.registry.set('hitme', false);
        }
        else {
          this.sound.play('slashy');
        }
        if (up.isDown == false) {
        if (left.isDown) {
          this.player.setVelocityX(0-60*speed);
          if(time - lastSlash <= 700){
            this.player.anims.play("swordswingL", true);
          }
          else {this.player.anims.play("swordswingL", true);}
          look = 1;
        }
        else if (right.isDown) {
          this.player.setVelocityX(0+60*speed);
          if(time - lastSlash <= 700){
            this.player.anims.play("swordswingR", true);
          }
          else {this.player.anims.play("swordswingR", true);}
          look = 0;
        }
        else {
          this.player.setVelocityX(0);
          if(look == 1){
            this.player.anims.play("swordswingL", true);
          }
          else{
            this.player.anims.play("swordswingR", true);
          }
        }
      }
        else if (up.isDown) {
          if (!(this.physics.overlap(this.player, platforms) || this.physics.collide(this.player, platforms))) this.player.y -= 5.5;
          if (left.isDown){
              this.player.setVelocityX(0-60*speed);
              if(time - lastSlash <= 700){
                this.player.anims.play("swordswingL", true);
              }
              else {this.player.anims.play("swordswingL", true);}
              look = 1;
            }
          else if(right.isDown){
              this.player.setVelocityX(0+60*speed);
              if(time - lastSlash <= 700){
                this.player.anims.play("swordswingR", true);
              }
              else {this.player.anims.play("swordswingR", true);}
              look = 0;
            }
          else if (look == 1 && right.isDown == false && left.isDown == false){
            this.player.setVelocityX(0);
            if(time - lastSlash <= 700){
              this.player.anims.play("swordswingL", true);
            }
            else {this.player.anims.play("swordswingL", true);}
          }
          else if (look == 0){
            this.player.setVelocityX(0);
            if(time - lastSlash <= 700){
              this.player.anims.play("swordswingR", true);
            }
            else {this.player.anims.play("swordswingR", true);}
          }
        }
      }
      else if (up.isDown == false){
        uplook = 0;
      if (left.isDown) {
        this.player.setVelocityX(0-60*speed);
        if(time - lastSlash <= 700){
          this.player.anims.play("swordswingL", true);
        }
        else {this.player.anims.play("left", true);}
        look = 1;
      }
      else if (right.isDown) {
        this.player.setVelocityX(0+60*speed);
        if(time - lastSlash <= 700){
          this.player.anims.play("swordswingR", true);
        }
        else {this.player.anims.play("right", true);}
        look = 0;
      }
      else {
        this.player.setVelocityX(0);
        if(look == 0){
          if(time - lastSlash <= 700){
            this.player.anims.play("swordswingR", true);
          }
          else {this.player.anims.play("idleR", true);}
        }
        else{
          if(time - lastSlash <= 700){
            this.player.anims.play("swordswingL", true);
          }
          else{this.player.anims.play("idleL", true);
        }
        }
      }
      if (down.isDown) {
        uplook = 0;
        // this.player.y += speed;
      }
    }
      else if (up.isDown) {
        uplook = 1;
        if (!(this.physics.overlap(this.player, platforms) || this.physics.collide(this.player, platforms))) this.player.y -= 6;
        if (left.isDown){
            this.player.setVelocityX(0-60*speed);
            if(time - lastSlash <= 700){
              this.player.anims.play("swordswingL", true);
            }
            else {this.player.anims.play("jumpL", true);}
            look = 1;
          }
        else if(right.isDown){
            this.player.setVelocityX(0+60*speed);
            if(time - lastSlash <= 700){
              this.player.anims.play("swordswingR", true);
            }
            else {this.player.anims.play("jumpR", true);}
            look = 0;
          }
        else if (look == 1 && right.isDown == false && left.isDown == false){
          this.player.setVelocityX(0);
          if(time - lastSlash <= 700){
            this.player.anims.play("swordswingL", true);
          }
          else {this.player.anims.play("jumpIdleL", true);}
        }
        else if (look == 0){
          this.player.setVelocityX(0);
          if(time - lastSlash <= 700){
            this.player.anims.play("swordswingR", true);
          }
          else {this.player.anims.play("jumpIdleR", true);}
        }
      }
      if (attackKey.isDown) spaceDown = true; else spaceDown = false;
      if(slot1.isDown){
        healclick = true;
      }
      if(slot1.isUp){
        if(healclick){
          this.heal();
          healclick = false;
        }
      //}
    }
  }
  //   if (this.physics.overlap(this.player, platforms)) this.player.y = this.player.y;
  //   else if (this.registry.get('HoldSword') && attackKey.isDown){
  //     this.sound.play('slashy');
  //     if (Phaser.Geom.Rectangle.Overlaps(this.rect, srect)) this.hpChange(this.snake, -.03, this.snake.hp, this.snake.id);
  //     console.log("No3");
  //     if (up.isDown == false){
  //     if (left.isDown ) {
  //       this.player.x -= speed;
  //       this.player.anims.play("swordswingL", true);
  //       look = 1;
  //     }
  //     else if (right.isDown) {
  //       this.player.x += speed;
  //       this.player.anims.play("swordswingR", true);
  //       look = 0;
  //     }
  //     else {
  //       if(look == 1){
  //         this.player.anims.play("swordswingL", true);
  //       }
  //       else{
  //         this.player.anims.play("swordswingR", true);
  //       }
  //     }
  //   }
  //     else if (up.isDown) {
  //       this.player.y -= 5.5;
  //       if (left.isDown){
  //           this.player.x -= speed;
  //           this.player.anims.play("swordswingL", true);
  //           look = 1;
  //         }
  //       else if(right.isDown){
  //           this.player.x += speed;
  //           this.player.anims.play("swordswingR", true);
  //           look = 0;
  //         }
  //       else if (look == 1 && right.isDown == false && left.isDown == false){
  //         this.player.anims.play("swordswingL", true);
  //       }
  //       else if (look == 0){
  //         this.player.anims.play("swordswingR", true);
  //       }
  //     }
  //   }
  //   else if (up.isDown == false){
  //     uplook = 0;
  //   if (left.isDown ) {
  //     this.player.x -= speed;
  //     this.player.anims.play("left", true);
  //     look = 1;
  //   }
  //   else if (right.isDown) {
  //     this.player.x += speed;
  //     this.player.anims.play("right", true);
  //     look = 0;
  //   }
  //   else {
  //     if(look == 0){
  //       this.player.anims.play("idleR", true);
  //     }
  //     else{
  //       this.player.anims.play("idleL", true);
  //     }
  //   }
  //   if (down.isDown) {
  //     uplook = 0;
  //     this.player.y += speed;
  //   }
  // }
  //   else if (up.isDown) {
  //     uplook = 1;
  //     this.player.y -= 6;
  //     if (left.isDown){
  //         this.player.x -= speed;
  //         this.player.anims.play("jumpL", true);
  //         look = 1;
  //       }
  //     else if(right.isDown){
  //         this.player.x += speed;
  //         this.player.anims.play("jumpR", true);
  //         look = 0;
  //       }
  //     else if (look == 1 && right.isDown == false && left.isDown == false){
  //       this.player.anims.play("jumpIdleL", true);
  //     }
  //     else if (look == 0){
  //       this.player.anims.play("jumpIdleR", true);
  //     }
  //   }
  //   if(slot1.isDown){
  //     healclick = true;
  //   }
  //   if(slot1.isUp){
  //     if(healclick){
  //       this.heal();
  //       healclick = false;
  //     }
  //   }
  // }

  render () {
    this.debug.cameraInfo(this.cameras, 32, 32);
  }

  //Adds to HP
  collectShield (player, shield) {
    var q = -1;
    for (let i=0; i < 5; ++i) {
      if (shield == shields.getChildren()[i]) {
        q = i; break;
      }
    }
    this.registry.get('ThereWeed')[q] = 0;
      shield.disableBody(true, true);
      this.sound.play('plusshield');
      this.hpChange(player, 1, this.hptrack, 0);
  }
  hitHp (player, bullet){
    console.log('hit');
    bullet.disableBody(true, true);
    this.sound.play('gothit');
    console.log(this.hptrack);
    this.hpChange(player, -1, this.hptrack, 0);
  }
  hitGhost (player, ghost){
    console.log('haunted');
    this.hpChange(this.player, -0.03, this.hptrack, 0);
    console.log(this.hptrack);
  }
  createHP (monster) {
    if(monster.id == 1){
      monster.hp = 5;
    }
    else if(monster.id == 2){
      monster.hp = 5;
    }
    monster.HPBar = this.add.sprite(monster.x, monster.y- 20, "hp-bar").setScale(0.8);
    monster.hp1 = this.add.sprite(monster.x+10, monster.y- 20, "hp");
    monster.hp2 = this.add.sprite(monster.x+20.5, monster.y- 20, "hp");
    monster.hp3 = this.add.sprite(monster.x+31, monster.y- 20, "hp");
    monster.hp4 = this.add.sprite(monster.x+41.5, monster.y- 20, "hp");
    monster.hp5 = this.add.sprite(monster.x+52, monster.y- 20, "hp");
    monster.hp1.setActive(false).setVisible(true);
    monster.hp2.setActive(false).setVisible(true);
    monster.hp3.setActive(false).setVisible(true);
    monster.hp4.setActive(false).setVisible(true);
    monster.hp5.setActive(false).setVisible(true);
    this.hpChange(monster, 0, monster.hp, monster.id);
  }
//change HP based on gain or loss
  hpChange (thing, hpplus, thishp, id){
    if(thishp <= 5) {
      if(id == 0){
        if(thishp == 5 && hpplus == 1){
          this.numShield += 1;
          this.fillInvent(false, 2);
        }
        else{
        this.hptrack = Math.min(thishp + hpplus, 5);
        thishp = this.hptrack;
      }
      }
      else if (id !=0){
        thing.hp = Math.min(thishp + hpplus, 5);
      }
    }
    if(thishp <= 0 && id == 0){
      this.sound.play('losegame');
      this.gameOver = true;
    }
    // console.log(this.hptrack);
    if(thishp > 1.00){
      thing.hp2.setActive(false).setVisible(true);
    }
    if(thishp > 2.0){
      thing.hp3.setActive(false).setVisible(true);
    }
    if(thishp > 3.0){
      thing.hp4.setActive(false).setVisible(true);
    }
    if(thishp > 4.00 ){
      thing.hp5.setActive(false).setVisible(true);
    }
    if(thishp < 2.00){
      thing.hp2.setActive(false).setVisible(false);
    }
    if(thishp < 3.00){
      thing.hp3.setActive(false).setVisible(false);
    }
    if(thishp < 4.00){
      thing.hp4.setActive(false).setVisible(false);
    }
    if(thishp < 5.00){
      thing.hp5.setActive(false).setVisible(false);
    }
    if (thishp <= 0) {
      thing.hp1.setActive(false).setVisible(false);
      thing.HPBar.setActive(false).setVisible(false);
      thing.disableBody(true, true);
      if(this.haveKey == false && this.spawn) {
        this.keyers = this.physics.add.sprite(thing.x,thing.y, "keyer");
        this.keyers.setScale(.3);
          this.physics.add.collider(this.keyers, platforms);
        this.spawn = false;
        this.keyers.setCollideWorldBounds(true);
        this.physics.add.overlap(this.player, this.keyers, this.collectkey, null, this);
      }
    }
  }

  collectsword() {
    this.swords.children.iterate(function(child) {
      child.disableBody(true, true);
    });
    this.registry.set('HoldSword', true);
    this.fillInvent(true, 1);
  }
  sceneRoomKey() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.registry.set('waveloco', this.water.y);
    this.registry.set('currentHP', this.hptrack);
    this.registry.set('HealItem', this.numShield);
    this.scene.start("RoomSceneKey2", {haveKey: this.haveKey, level: this.level, haveVisit: 0});
  }
  sceneRoom() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.registry.set('waveloco', this.water.y);
    this.scene.start("RoomScene2", {haveKey: this.haveKey, hptrack: this.hptrack, level: this.level});
  }
  sceneNext() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    if(this.haveKey == true){
      this.registry.set('waveloco', 1650);
      this.registry.set('NewWeed', 0);
      this.registry.set('currentHP', this.hptrack);
      this.registry.set('HealItem', this.numShield);
      if(this.registry.get('levelskip') < 4){
        this.registry.set('levelskip', 4)
      };
      this.scene.start("Level4", {haveKey: false, hptrack: this.hptrack,  haveVisit: 0});
    }
  }

  //*******identify
  // 0 = key
  // 1 = sword
  // 2 = shield
  fillInvent(refill, identify){
    if( identify == 2 && this.numShield > 0){
      if (this.textisSet == false){
        this.shieldImage = this.add.sprite(this.invent[1][0], this.invent[1][1], "shield");
        this.shieldImage.setScale(.18);
        this.shieldImage.setScrollFactor(0, 0);
        this.showshield = this.add.text(this.invent[1][0] + 10, this.invent[1][1] + 8, this.numShield, {
          fontFamily: 'Maven Pro',
          fontSize: '15px',
          fill: '#000'
        });
        this.showshield.setScrollFactor(0, 0);
        this.textisSet = true;
      }
      if(this.textisSet){
        console.log(this.numShield);
        this.showshield.setText(this.numShield);
      }
    }
    if (this.registry.get('HoldSword') && identify == 1){
      this.inventSword = this.add.sprite(this.invent[2][0], this.invent[2][1], "sword");
      this.inventSword.setScale(1.2);
      this.inventSword.setScrollFactor(0, 0);
    }
  }
  refill(){
        if(this.haveKey){
          this.inventKey = this.add.sprite(this.invent[0][0], this.invent[0][1], "keyer");
          this.inventKey.setScale(.3);
          this.inventKey.setScrollFactor(0, 0);
        }
        if(this.registry.get('HoldSword')){
          this.inventSword = this.add.sprite(this.invent[2][0], this.invent[2][1], "sword");
          this.inventSword.setScale(1.2);
          this.inventSword.setScrollFactor(0, 0);
        }
        if(this.numShield > 0){
          this.shieldImage = this.add.sprite(this.invent[1][0], this.invent[1][1], "shield");
          this.shieldImage.setScale(.18);
          this.shieldImage.setScrollFactor(0, 0);
          this.textisSet = true;
          this.showshield = this.add.text(this.invent[1][0] + 10, this.invent[1][1] + 8, this.numShield, {
            fontFamily: 'Maven Pro',
            fontSize: '15px',
            fill: '#000'
          });
          this.showshield.setScrollFactor(0, 0);
        }
  }
  heal(){
    if(this.numShield > 0 && this.hptrack < 5 ){
      this.numShield -= 1;
      this.fillInvent(false, 2);
      this.hpChange(this.player, 1, this.hptrack, 0);
    }
  }
  collectkey() {
    this.keyers.disableBody(true, true);
    this.haveKey = true;
    this.inventKey = this.add.sprite(279, 60, "keyer");
    this.inventKey.setScale(.3);
    this.inventKey.setScrollFactor(0, 0);
    this.doors2 = this.physics.add.sprite(1000, 450, "greendoor-open");
    this.physics.add.collider(this.doors2, platforms);
    this.physics.add.overlap(this.player, this.doors2, this.sceneNext, null, this);

    // Refill
  }


  shoot() {
  var velocityFromRotation = this.physics.velocityFromRotation;
  // Create a variable called velocity from a Vector2 (2D vector)
  var velocity = new Phaser.Math.Vector2();
  velocityFromRotation(Math.PI/2, this.speed, velocity); // converts the vector from velocityFromRotation in physics to the (x,y) Vector2 notation
  // The angle measure above is in radians.
  bullet1 = this.bullets1.get(); // create local bullet variable from global bullets (this.bullet) with the method get().
  bullet2 = this.bullets2.get();
  bullet3 = this.bullets3.get();
  bullet5 = this.bullets5.get();
  bullet1.setAngle(90); // looks at angle and rotates the bullets in accordance to the turret direction
  bullet2.setAngle(90);
  bullet3.setAngle(90);
  bullet5.setAngle(90);
  bullet1.enableBody(true, this.turret1.x, this.turret1.y, true, true).setVelocity(velocity.x, velocity.y * -1);
  bullet2.enableBody(true, this.turret2.x, this.turret2.y, true, true).setVelocity(velocity.x, velocity.y *-1);
  bullet3.enableBody(true, this.turret3.x, this.turret3.y, true, true).setVelocity(velocity.x, velocity.y * -1);
  bullet5.enableBody(true, this.turret5.x, this.turret5.y, true, true).setVelocity(velocity.x, velocity.y * -1);
  // first true means be visible; second true means we want physics in it
  }
  hitWater (player, water) {
    console.log("experiementpre");
    this.hpChange(this.player, -0.03, this.hptrack, 0);
    console.log("experiement");
  }
}
