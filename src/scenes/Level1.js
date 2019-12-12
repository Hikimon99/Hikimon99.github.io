/*global Phaser*/
var platforms;
var doors;
var haveKey;
var doors2;
var uplook = 0;
var look = 0;
var shields;
var wavetime = 0;
var healclick = false;
var dict = {}

export default class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    this.haveKey = data.haveKey;
    this.hptrack = this.registry.get('currentHP');
    this.haveVisit = data.haveVisit;
    this.textisSet = false;
    this.numShield = this.registry.get('HealItem');
    this.haveSword = false;
  }
  preload () {
    // Preload assets

    this.load.spritesheet("playersAv", "./assets/spriteSheet/adventurer.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    //Load background
    this.load.image('background', './assets/images/background1.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    // Event listener to change scenes
    this.level = 1;

    //Music
    if (!this.registry.get('music')[1].isPlaying) {
      this.registry.get('music')[0].stop();
      this.registry.get('music')[2].stop();
      this.registry.get('music')[3].stop();
      this.registry.get('music')[4].stop();
      this.registry.get('music')[1].play();
    }

    var background = this.add.sprite(1000, 500, 'background').setScale(1.1);

    // ***********************WATER*************************
    this.water = this.physics.add.sprite(900, this.registry.get('waveloco'), 'waves');
    this.water.setScale(20, 2);
    this.water.body.setAllowGravity(false);
    this.anims.create({key: "wavefeel", frames: this.anims.generateFrameNumbers("waves", {start: 0, end: 3}), frameRate: 6, repeat: -1});

    // Background water spilling
    var crack = this.add.sprite(450, 500, 'crack').setScale(0.3);
    var wpark0 = this.add.particles('blu');
    var emitter0 = wpark0.createEmitter({lifespan: 3000, speedX:{min: -50, max: 50}, speedY:{min: 0, max: 0},
      scale: {start: 0, end: 0}, // won't end
      blendMode: 'NORMAL'
    });
    emitter0.setScale(0.5);
    emitter0.setPosition(450, 500);
    emitter0.setGravityY(500);

    var crack = this.add.sprite(1600, 200, 'crack').setScale(0.3);
    var wpark1 = this.add.particles('blu');
    var emitter1 = wpark1.createEmitter({lifespan: 3000, speedX:{min: -50, max: 50}, speedY:{min: 0, max: 0},
      scale: {start: 0, end: 0}, // won't end
      blendMode: 'NORMAL'
    });

    // *************Particle Emitter********
    emitter1.setScale(0.5);
    emitter1.setPosition(1600, 200);
    emitter1.setGravityY(500);

    //***********************END OF WATER*************************

    //*******************BUTTONS****************
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
    }, this
  );

    //Level number
    this.levelNumber = this.add.text(725, 20, 'Level 1', {
      fontFamily: 'Maven Pro',
      fontSize: '20px',
      fill: '#000'
    });
    this.levelNumber.setScrollFactor(0, 0);

    //Tutorial
    this.howToMove = this.add.text(1620, 930, 'Use arrow keys to move around/jump', {
      fontFamily: 'Maven Pro',
      fontSize: '15px',
      fill: '#fff'
    });

    this.howToDoors = this.add.text(50, 680, 'Press "up" arrow to enter', {
      fontFamily: 'Maven Pro',
      fontSize: '15px',
      fill: '#fff'
    });


    //************************PLATFORMS**************************
    //Add the platforms with staticGroup
    platforms = this.physics.add.staticGroup();

    //Top
    platforms.create(1000, 0, 'ground').setScale(10, 1).refreshBody();

    //Platforms level 1
    platforms.create(1700, 900, 'ground').setScale(1, .5).refreshBody();
    platforms.create(1350, 850, 'ground').setScale(1, .5).refreshBody();
    platforms.create(100, 800, 'ground').setScale(8, .5).refreshBody();
    platforms.collideWorldBounds = true;

    //Platforms level 2
    platforms.create(500, 700, 'ground').setScale(1, .5).refreshBody();
    platforms.create(850, 650, 'ground').setScale(1, .5).refreshBody();
    platforms.create(1700, 550, 'ground').setScale(5, .5).refreshBody();
    platforms.collideWorldBounds = true;

    //*************************END OF PLATFORMS****************************

    //************************DOORS**************************
    //Add doors
    doors = this.physics.add.staticGroup();
    doors2 = this.physics.add.staticGroup();
    doors.create(125, 750, "reddoor-open").setScale(1).refreshBody();
    if (this.haveKey){
      doors2.create(1900, 500, "greendoor-open").setScale(1).refreshBody();
    }
    else{
      doors2.create(1900, 500, "greendoor-closed").setScale(1).refreshBody();
    }

    //*************************END OF DOORS************


    //*************************HP BAR AND ITEM BOX************
    //Add item box
    this.itemBox = this.add.sprite(400, 50, "itemBox").setScale(0.5);
    this.itemBox.setScrollFactor(0, 0);

    this.presstwo = this.add.text(300, 20, '(Press "C" to heal)', {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      fill: '#000'
    });
    this.presstwo.setScrollFactor(0, 0);

    //Add the player
    if (this.haveVisit == 0){
      this.player = this.physics.add.sprite(1900, 800, "playersAv");
    }
    else{
      this.player = this.physics.add.sprite(170, 700, "playersAv");
    }
    this.player.setSize(20, 25, true);
    this.player.displayOriginX = 0;
    this.player.displayOriginY = 0;
    this.player.displayWidth = 90;
    this.player.displayHeight = 90;
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 2000, 1000);
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
    // 0 is fixed to camera. 1 is fixed to world. Everything else is in between.
    this.refill();
    //Add player sprite with arcade physics and boundaries
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
    if (this.registry.get('NewWeed')==0) {
      this.registry.set('NewWeed', 1);
      this.registry.set('ThereWeed', [1,1,1,1,1]);
    }
    shields = this.physics.add.staticGroup();

    shields.create(1350, 815, 'shield').setScale(0.3).refreshBody();
    shields.create(250, 765, 'shield').setScale(0.3).refreshBody();
    shields.create(800, 765, 'shield').setScale(0.3).refreshBody();
    shields.create(850, 615, 'shield').setScale(0.3).refreshBody();
    shields.create(1600, 515, 'shield').setScale(0.3).refreshBody();

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
    //************************END OF CAMERA***************************

    //************************COLLIDER AND OVERLAPS************
    //this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(doors, platforms);
    this.physics.add.collider(shields, platforms);
    //When they overlap, score is taken
    this.physics.add.overlap(this.player, shields, this.collectShield, null, this);
    this.physics.add.overlap(this.player, doors, this.sceneRoomKey, null, this);
    this.physics.add.overlap(this.player, doors2, this.sceneNext, null, this);
    this.physics.add.overlap(this.player, this.water, this.hitWater, null, this);
    // Like in other adventure games, we have to choose to go into the room to go into the room.
    //***********************END OF COLLIDER AND OVERLAPS************
  }

  update (time, delta) {
    this.water.anims.play("wavefeel", true);
    if (wavetime % 1000 >= 0 && wavetime % 1000 < 1) {
      this.water.y -= .3;
    }
    //*****************************PLAYER ANIMATION*******************
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
    if (this.physics.overlap(this.player, platforms) || this.physics.collide(this.player, platforms)) {
      if (this.haveSword && attackKey.isDown) {
        this.sound.play('slashy');
        if (up.isDown == false) {
        if (left.isDown) {
          this.player.setVelocityX(0-60*speed);
          this.player.anims.play("swordswingL", true);
          look = 1;
        }
        else if (right.isDown) {
          this.player.setVelocityX(0+60*speed);
          this.player.anims.play("swordswingR", true);
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
          // this.player.y -= 5.5;
          if (left.isDown){
              this.player.setVelocityX(0-60*speed);
              this.player.anims.play("swordswingL", true);
              look = 1;
            }
          else if(right.isDown){
              this.player.setVelocityX(0+60*speed);
              this.player.anims.play("swordswingR", true);
              look = 0;
            }
          else if (look == 1 && right.isDown == false && left.isDown == false){
            this.player.setVelocityX(0);
            this.player.anims.play("swordswingL", true);
          }
          else if (look == 0){
            this.player.setVelocityX(0);
            this.player.anims.play("swordswingR", true);
          }
        }
      }
      else if (up.isDown == false){
        uplook = 0;
      if (left.isDown) {
        this.player.setVelocityX(0-60*speed);
        this.player.anims.play("left", true);
        look = 1;
      }
      else if (right.isDown) {
        this.player.setVelocityX(0+60*speed);
        this.player.anims.play("right", true);
        look = 0;
      }
      else {
        this.player.setVelocityX(0);
        if(look == 0){
          this.player.anims.play("idleR", true);
        }
        else{
          this.player.anims.play("idleL", true);
        }
      }
      if (down.isDown) {
        uplook = 0;
        // this.player.y += speed;
      }
    }
      else if (up.isDown) {
        uplook = 1;
        // this.player.y -= 6;
        if (left.isDown){
            this.player.setVelocityX(0-60*speed);
            this.player.anims.play("jumpL", true);
            look = 1;
          }
        else if(right.isDown){
            this.player.setVelocityX(0+60*speed);
            this.player.anims.play("jumpR", true);
            look = 0;
          }
        else if (look == 1 && right.isDown == false && left.isDown == false){
          this.player.setVelocityX(0);
          this.player.anims.play("jumpIdleL", true);
        }
        else if (look == 0){
          this.player.setVelocityX(0);
          this.player.anims.play("jumpIdleR", true);
        }
      }
    }
    // big if statement concluded
    else if (this.haveSword && attackKey.isDown) {
      this.sound.play('slashy');
      if (Phaser.Geom.Rectangle.Overlaps(this.rect, grect)) this.hpChange(this.ghost, -1, this.ghost.hp, this.ghost.id);
      if (Phaser.Geom.Rectangle.Overlaps(this.rect, srect)) this.hpChange(this.snake, -1, this.snake.hp, this.ghost.id);
      if (up.isDown == false) {
      if (left.isDown) {
        this.player.setVelocityX(0-60*speed);
        this.player.anims.play("swordswingL", true);
        look = 1;
      }
      else if (right.isDown) {
        this.player.setVelocityX(0+60*speed);
        this.player.anims.play("swordswingR", true);
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
        this.player.y -= 5.5;
        if (left.isDown){
            this.player.setVelocityX(0-60*speed);
            this.player.anims.play("swordswingL", true);
            look = 1;
          }
        else if(right.isDown){
            this.player.setVelocityX(0+60*speed);
            this.player.anims.play("swordswingR", true);
            look = 0;
          }
        else if (look == 1 && right.isDown == false && left.isDown == false){
          this.player.setVelocityX(0);
          this.player.anims.play("swordswingL", true);
        }
        else if (look == 0){
          this.player.setVelocityX(0);
          this.player.anims.play("swordswingR", true);
        }
      }
    }
    else if (up.isDown == false){
      uplook = 0;
    if (left.isDown) {
      this.player.setVelocityX(0-60*speed);
      this.player.anims.play("left", true);
      look = 1;
    }
    else if (right.isDown) {
      this.player.setVelocityX(0+60*speed);
      this.player.anims.play("right", true);
      look = 0;
    }
    else {
      this.player.setVelocityX(0);
      if(look == 0){
        this.player.anims.play("idleR", true);
      }
      else{
        this.player.anims.play("idleL", true);
      }
    }
    if (down.isDown) {
      uplook = 0;
      // this.player.y += speed;
    }
  }
    else if (up.isDown) {
      uplook = 1;
      this.player.y -= 6;
      if (left.isDown){
          this.player.setVelocityX(0-60*speed);
          this.player.anims.play("jumpL", true);
          look = 1;
        }
      else if(right.isDown){
          this.player.setVelocityX(0+60*speed);
          this.player.anims.play("jumpR", true);
          look = 0;
        }
      else if (look == 1 && right.isDown == false && left.isDown == false){
        this.player.setVelocityX(0);
        this.player.anims.play("jumpIdleL", true);
      }
      else if (look == 0){
        this.player.setVelocityX(0);
        this.player.anims.play("jumpIdleR", true);
      }
    }
    if(slot1.isDown){
      healclick = true;
    }
    if(slot1.isUp){
      if(healclick){
        this.heal();
        healclick = false;
      }
    }

//*****************************GAME OVER CHANGE SCENE*********
    if(this.gameOver)
    {
        this.physics.pause();
        this.scene.start('GameOver');
    }
//*******************************END OF GAME OVER CHANGE SCENE
  }
  //************************END OF PLAYER ANIMATION********************
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
    else if (id !=0){``
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
  }
}
  sceneRoom() {
    if (uplook <= 0) return;
    console.log(this.hptrack);
    this.registry.set('waveloco', this.water.y);
    if (this.haveKey == true){
      this.scene.start("RoomScene", {haveKey: this.haveKey, hptrack: this.hptrack});
    }
    else {
      this.scene.start("RoomSceneKey2", {haveKey: this.haveKey, hptrack: this.hptrack});
    }
  }
  sceneRoomKey() {
    if (uplook <= 0) return;
    this.registry.set('waveloco', this.water.y);
    this.registry.set('currentHP', this.hptrack);
    this.registry.set('HealItem', this.numShield);
    this.scene.start("RoomSceneKey2", {haveKey: this.haveKey, level: this.level});
  }
  sceneNext() {
    if (uplook <= 0)  return;
    if(this.haveKey == true){
      this.registry.set('waveloco', 1650);
      this.registry.set('NewWeed', 0)
      this.registry.set('currentHP', this.hptrack);
      this.registry.set('HealItem', this.numShield);
      if(this.registry.get('levelskip') < 2){
        this.registry.set('levelskip', 2)
      };
      this.sound.play('nextlevel');
      this.scene.start("Level2", {haveKey: false, haveVisit: 0});
    }
  }
  //*******identify
  // 0 = key
  // 1 = sword
  // 2 = shield
                 // [[279, 60, 0],
                 // [326, 60, 0],
                 // [374, 60, 0],
                 // [422, 60, 0],
                 // [470, 60, 0],
                 // [518, 60, 0]];
  fillInvent(refill, identify){
    if( identify == 2 && this.numShield > 0){
      if (this.textisSet == false){
        this.shieldImage = this.add.sprite(326, 60, "shield");
        this.shieldImage.setScale(.18);
        this.shieldImage.setScrollFactor(0, 0);
        this.showshield = this.add.text(336, 68, this.numShield, {
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
  }
  refill(){
        if(this.haveKey){
          this.inventKey = this.add.sprite(279, 60, "keyer");
          this.inventKey.setScale(.3);
          this.inventKey.setScrollFactor(0, 0);
        }
        if(this.numShield > 0){
          this.shieldImage = this.add.sprite(326, 60, "shield");
          this.shieldImage.setScale(.18);
          this.shieldImage.setScrollFactor(0, 0);
          this.textisSet = true;
          this.showshield = this.add.text(336, 68, this.numShield, {
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
  hitWater (player, water) {
    console.log('submerged');
    this.hpChange(this.player, -0.03, this.hptrack, 0);
  }
}
