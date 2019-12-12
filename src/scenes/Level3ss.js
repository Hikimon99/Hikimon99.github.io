/*global Phaser*/
var platforms;
var doors, doors2, doors3;
var haveSwordss;
var turret, bullets, enemy, bullet1, bullet2, bullet3, bullet4;
var uplook = 0;
var look = 0;
var graphics;


export default class Level3 extends Phaser.Scene {
  constructor () {
    super('Level3');
  }

  init (data) {
    // Initialization code goes here
    this.hptrack = data.hptrack;
    this.haveKey = data.haveKey;
    this.haveVisit = data.haveVisit;
  }
  preload () {
    // Preload assets
    //this.Level = 2;
    //Bat sprtieSheet from https://opengameart.org/content/bat-32x32
    this.load.spritesheet("playersAv", "./assets/spriteSheet/adventurer.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    this.load.spritesheet("ghost", "./assets/spriteSheet/ghostSheet.png", {
      frameHeight: 512,
      frameWidth: 511
    });

    this.load.spritesheet("snake", "./assets/spriteSheet/snake.png", {
      frameHeight: 33,
      frameWidth: 55
    });

    //Load doors
    this.load.image('door-open', './assets/sprites/door-open.png');
    this.load.image('door-closed', './assets/sprites/door-closed.png');
    this.load.image('reddoor-open', './assets/sprites/reddoor-open.png');
    this.load.image('reddoor-closed', './assets/sprites/reddoor-closed.png');
    this.load.image('greendoor-open', './assets/sprites/greendoor-open.png');
    this.load.image('greendoor-closed', './assets/sprites/greendoor-closed.png');

    //Load sword
    this.load.image('sword', './assets/sprites/sword.png');

    //Load background
    this.load.image('background2', './assets/images/background2.png');

    //Get platforms
    this.load.image('ground', './assets/platform.png');

    //HP
    this.load.image("hp", "./assets/images/GreenHealth.png");
    this.load.image("hp-bar", "./assets/images/HealthBar.png");

    //Item box
    this.load.image("itemBox", "./assets/images/ItemBox.png");

    //Shields for hp
    this.load.image("shield", "./assets/sprites/mirror.png");

    //Bullets to dodge
    this.load.image('base', './assets/sprites/tankBase.png');
    this.load.image('turret', './assets/sprites/tankTurret.png');
    this.load.image("bullet", "./assets/sprites/bullet.png");

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    this.level = 3;
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
    this.levelNumber = this.add.text(700, 20, 'Level 3', {
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
    platforms.create(1700, 900, 'ground').setScale(1.3,.5).refreshBody();
    platforms.create(1000, 900, 'ground').setScale(1.3,.5).refreshBody();
    platforms.create(300, 900, 'ground').setScale(1.3,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 2
    platforms.create(1900, 750, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1450, 750, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1000, 750, 'ground').setScale(1,.5).refreshBody();
    platforms.create(550, 750, 'ground').setScale(1,.5).refreshBody();
    platforms.create(100, 750, 'ground').setScale(1,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 3
    platforms.create(1700, 600, 'ground').setScale(1.3,.5).refreshBody();
    platforms.create(300, 600, 'ground').setScale(1.3,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms Level 4
    platforms.create(1900, 450, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1450, 450, 'ground').setScale(1,.5).refreshBody();
    platforms.create(1000, 450, 'ground').setScale(1,.5).refreshBody();
    platforms.create(550, 450, 'ground').setScale(1,.5).refreshBody();
    platforms.create(100, 450, 'ground').setScale(1,.5).refreshBody();
    platforms.collideWorldBounds = true;

    //*************************END OF PLATFORMS****************************


    //************************DOORS**************************
    //Add doors
    doors = this.physics.add.staticGroup();
    doors2 = this.physics.add.staticGroup();
    doors3 = this.physics.add.staticGroup();
    doors.create(1000, 850, "reddoor-open").setScale(1).refreshBody();
    doors3.create(100, 400, "door-open").setScale(1).refreshBody();
    if (this.haveKey){
      doors2.create(1900, 400, "greendoor-open").setScale(1).refreshBody();
    }
    else{
      doors2.create(1900, 400, "greendoor-closed").setScale(1).refreshBody();
    }
    //***********************END OF DOORS***************



    //ghost to dodge
    this.ghost = this.physics.add.sprite(this.centerX, this.centerY, 'ghost');
    this.ghost.setScale(0.15);
    this.ghost.body.allowGravity = false;
    this.createHP(this.ghost);
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

    //snake to dodge
    this.snake = this.physics.add.sprite(970, 960, 'snake');
    this.snake.setCollideWorldBounds(true);
    this.createHP(this.snake);

    this.tweens.add({
      targets: this.snake,
      x: 200,
      ease: "Linear",
      duration: 3000,
      yoyo: true,
      repeat: -1
    });
    //animate ghost
    this.anims.create({
      key: "snake_right",
      frames: this.anims.generateFrameNumbers("snake", { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "snake_left",
      frames: this.anims.generateFrameNumbers("snake", { start: 2, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    //***********************ENEMIES***************

    // var base = this.add.sprite(1000, 60, 'base');
    // base.setScale(3);
    // Add turret barrel to the tankBase
    this.turret1 = this.add.sprite(1700, 880, 'turret');
    this.turret1.setScale(3);
    this.turret1.setAngle(270);

    this.turret2 = this.add.sprite(300, 880, 'turret');
    this.turret2.setScale(3);
    this.turret2.setAngle(270);

    this.turret3 = this.add.sprite(1450, 430, 'turret');
    this.turret3.setScale(3);
    this.turret3.setAngle(270);

    this.turret4 = this.add.sprite(550, 430, 'turret');
    this.turret4.setScale(3);
    this.turret4.setAngle(270);

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
    this.bullets4 = this.physics.add.group({
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
    //*************************HP BAR AND ITEM BOX************
        //Add item box
        this.itemBox = this.add.sprite(170, 535, "itemBox").setScale(0.5);
        this.itemBox.setScrollFactor(0, 0);

        //Add HP bar
        this.player.HPBar = this.add.sprite(90, 470, "hp-bar").setScale(0.8);
        this.player.HPBar.setScrollFactor(0, 0);

        //Measurements to keep track of game progress
        this.gameOver = false;
        this.touchRoom = false;
        this.player.hp1 = this.add.sprite(100, 470, "hp").setScale(0.8);
        this.player.hp1.setScrollFactor(0, 0);
        this.player.hp2 = this.add.sprite(110.5, 470, "hp").setScale(0.8);
        this.player.hp2.setScrollFactor(0, 0);
        this.player.hp3 = this.add.sprite(121, 470, "hp").setScale(0.8);
        this.player.hp3.setScrollFactor(0, 0);
        this.player.hp4 = this.add.sprite(131.5, 470, "hp").setScale(0.8);
        this.player.hp4.setScrollFactor(0, 0);
        this.player.hp5 = this.add.sprite(142, 470, "hp").setScale(0.8);
        this.player.hp5.setScrollFactor(0, 0);
        this.player.hp1.setActive(false).setVisible(true);
        this.player.hp2.setActive(false).setVisible(false);
        this.player.hp3.setActive(false).setVisible(false);
        this.player.hp4.setActive(false).setVisible(false);
        this.player.hp5.setActive(false).setVisible(false);
        this.hpChange(this.player, 0, this.hptrack, 0);

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
    this.physics.add.collider(this.snake, platforms);
    //When they overlap, score is taken
    this.physics.add.overlap(this.player, this.shields, this.collectShield, null, this);
    this.physics.add.overlap(this.player, this.ghost, this.hitGhost, null, this);
    this.physics.add.overlap(this.player, this.snake, this.hitGhost, null, this);
    this.physics.add.overlap(this.player, this.swords, this.collectsword, null, this);
    this.physics.add.overlap(this.player, doors, this.sceneRoomKey, null, this);
    this.physics.add.overlap(this.player, doors2, this.sceneNext, null, this);
    this.rect = new Phaser.Geom.Rectangle(this.player.x-35, this.player.y+20, 55, 80);

    graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } }); // temporary
  }

  update (time, delta) {
    // Update the scene
    graphics.clear();
    graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } }); // temporary
    var grect = new Phaser.Geom.Rectangle(this.ghost.x-this.ghost.displayWidth/2, this.ghost.y-this.ghost.displayHeight/2, this.ghost.displayWidth, this.ghost.displayHeight);
    if (look == 1) {
      this.rect.setTo(this.player.x-35, this.player.y+20, 55, 80);
    }
    else {
      this.rect.setTo(this.player.x+90, this.player.y+20, 55, 80);
    }
    // graphics.fillRectShape(this.rect);
    // graphics.fillRectShape(grect);
    console.log(this.haveKey);
    // this.hpChange(this.hptrack);
    var towards = new Phaser.Math.Vector2();
    towards.x = this.player.x-this.ghost.x;
    towards.y = this.player.y-this.ghost.y;
    this.ghost.setVelocity(towards.x/2, towards.y/2);
    this.ghost.HPBar.x = this.ghost.x -10;
    this.ghost.HPBar.y = this.ghost.y-50;
    this.ghost.hp1.x = this.ghost.x ;
    this.ghost.hp1.y = this.ghost.y-50;
    this.ghost.hp2.x = this.ghost.x +10.5;
    this.ghost.hp2.y = this.ghost.y-50;
    this.ghost.hp3.x = this.ghost.x +21;
    this.ghost.hp3.y = this.ghost.y-50;
    this.ghost.hp4.x = this.ghost.x +31.5;
    this.ghost.hp4.y = this.ghost.y-50;
    this.ghost.hp5.x = this.ghost.x +42;
    this.ghost.hp5.y = this.ghost.y-50;
    if (towards.x > 0){
      this.ghost.anims.play("ghost_right", true);
    }
    else{
      this.ghost.anims.play("ghost_left", true);
    }
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
    this.bullets1.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap( b, this.enemyGroup, this.hitEnemy, null, this);
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
        this.scene.start('GameOver');
    }
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
      if (Phaser.Geom.Rectangle.Overlaps(this.rect, grect)) this.hpChange(this.ghost, -.03, this.ghost.hp, this.ghost.id);
      if (Phaser.Geom.Rectangle.Overlaps(this.rect, grect)) this.hpChange(this.snake, -.03, this.snake.hp, this.ghost.id);
      if (up.isDown == false){
      if (left.isDown ) {
        this.player.x -= speed;
        this.player.anims.play("swordswingL", true);
        look = 1;
      }
      else if (right.isDown) {
        this.player.x += speed;
        this.player.anims.play("swordswingR", true);
        look = 0;
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
        this.player.y -= 6;
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
  }

  render () {
    this.debug.cameraInfo(this.cameras, 32, 32);
  }

  //Adds to HP
  collectShield (player, shield){
      shield.disableBody(true, true);
      this.hpChange(player, 1, this.hptrack, 0);
      }
  hitHp (player, bullet){
    console.log('hit');
    bullet1.disableBody(true, true);
    bullet2.disableBody(true, true);
    bullet3.disableBody(true, true);
    bullet4.disableBody(true, true);
    this.hpChange(-1);
  }
  hitGhost (player, ghost){
    console.log('haunted');
    this.hpChange(this.player, -0.02, this.hptrack, ghost.id);
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
          this.hptrack = Math.min(thishp + hpplus, 5);
        }
        else{
          thing.hp = Math.min(thishp + hpplus, 5);
        }
      }
      if(thishp <= 0 && id == 0){
        this.gameOver = true;
      }
      // console.log(this.hptrack);
      if(thishp > 1.02){
        thing.hp2.setActive(false).setVisible(true);
      }
      if(thishp > 2.02){
        thing.hp3.setActive(false).setVisible(true);
      }
      if(thishp > 3.02){
        thing.hp4.setActive(false).setVisible(true);
      }
      if(thishp > 4.02){
        thing.hp5.setActive(false).setVisible(true);
      }
      if(thishp <= 1.02){
        thing.hp2.setActive(false).setVisible(false);
      }
      if(thishp <= 2.02){
        thing.hp3.setActive(false).setVisible(false);
      }
      if(thishp <= 3.02){
        thing.hp4.setActive(false).setVisible(false);
      }
      if(thishp <= 4.02){
        thing.hp5.setActive(false).setVisible(false);
      }
      if (thishp <= 0) {
        thing.hp1.setActive(false).setVisible(false);
        thing.HPBar.setActive(false).setVisible(false);
        thing.disableBody(true, true);
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
    this.scene.start("RoomSceneKey2", {haveKey: this.haveKey, hptrack: this.hptrack, level: this.level});
  }
  sceneRoom() {
    if (uplook <= 0) return;
    this.scene.start("RoomScene2", {haveKey: this.haveKey, hptrack: this.hptrack, level: this.level});
  }
  sceneNext() {
    if (uplook <= 0) return;
    if(this.haveKey == true){
      this.scene.start("Level4", {haveKey: false, hptrack: this.hptrack,  haveVisit: 0});
    }
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
      bullet4 = this.bullets4.get();
      bullet1.setAngle(90); // looks at angle and rotates the bullets in accordance to the turret direction
      bullet2.setAngle(90);
      bullet3.setAngle(90);
      bullet4.setAngle(90);
      bullet1.enableBody(true, this.turret1.x, this.turret1.y, true, true).setVelocity(velocity.x, (velocity.y) * -1);
      bullet2.enableBody(true, this.turret2.x, this.turret2.y, true, true).setVelocity(velocity.x, (velocity.y) * -1);
      bullet3.enableBody(true, this.turret3.x, this.turret3.y, true, true).setVelocity(velocity.x, (velocity.y) * -1);
      bullet4.enableBody(true, this.turret4.x, this.turret4.y, true, true).setVelocity(velocity.x, (velocity.y) * -1);
    }
}
