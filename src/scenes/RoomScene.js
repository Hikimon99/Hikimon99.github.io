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
var healclick = false;
export default class RoomScene extends Phaser.Scene {
  constructor () {
    super('RoomScene');
  }

  init (data) {
    // console.log(data.hptrack);
    this.haveKey = data.haveKey;
    this.hptrack = this.registry.get("currentHP");
    this.numShield = this.registry.get('HealItem');
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

    //Text box
    this.load.image('text', './assets/images/text-box.png');

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
    //Create the scene
    bed = this.physics.add.staticGroup();
    bed.create(410, 350, 'green-bed').setScale(1.5).refreshBody();
    rug = this.physics.add.staticGroup();
    rug.create(650, 430, 'rug-green').setScale(2).refreshBody();
    bookshelf = this.physics.add.staticGroup();
    bookshelf.create(150, 275, 'bookshelf-brown').setScale(1.5).refreshBody();
    couch = this.physics.add.staticGroup();
    couch.create(650, 320, 'couch').setScale(1.5).refreshBody();
    table = this.physics.add.staticGroup();
    table.create(650, 450, 'table').setScale(2).refreshBody();
    stool = this.physics.add.staticGroup();
    stool.create(315, 340, 'stool-white').setScale(1.5).refreshBody();
    painting = this.physics.add.staticGroup();
    painting.create(410, 170, 'painting').setScale(1.5).refreshBody();


    //door out
    doors = this.physics.add.staticGroup();
    doors.create(700, 525, "door-open").refreshBody();

    //Add item box
    this.itemBox = this.add.sprite(400, 50, "itemBox").setScale(0.5);
    this.itemBox.setScrollFactor(0, 0);

    //Add text box
    this.textBox = this.add.sprite(330, 550, "text").setScale(0.7);


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

    //Add HP bar
    this.player.HPBar = this.add.sprite(400, 120, "hp-bar").setScale(0.8);
    this.player.HPBar.setScrollFactor(0, 0);

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
    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    var slot1 = this.input.keyboard.addKey('C');
    var attackKey = this.input.keyboard.addKey('SPACE');
    var up = this.input.keyboard.addKey('UP');
    var left = this.input.keyboard.addKey('LEFT');
    var right = this.input.keyboard.addKey('RIGHT');
    var down = this.input.keyboard.addKey('DOWN');
    if (this.physics.overlap(this.player, platforms)) this.player.y = this.player.y;
    else if (this.registry.get('HoldSword') && attackKey.isDown){
      this.sound.play('slashy');
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
    if(slot1.isDown){
      healclick = true;
    }
    if(slot1.isUp){
      if(healclick){
        this.heal();
        healclick = false;
      }
    }
  }
  //change HP based on gain or loss
  hpChange (thing, hpplus, thishp, id){
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
  refill(){
    if(this.haveKey){
      this.inventKey = this.add.sprite(279, 60, "keyer");
      this.inventKey.setScale(.3);
      this.inventKey.setScrollFactor(0, 0);
    }
    if(this.registry.get('HoldSword')){
      this.inventSword = this.add.sprite(326, 60, "sword");
      this.inventSword.setScale(1.2);
      this.inventSword.setScrollFactor(0, 0);
    }
    if(this.numShield > 0){
      this.shieldImage = this.add.sprite(374, 60, "shield");
      this.shieldImage.setScale(.18);
      this.shieldImage.setScrollFactor(0, 0);
      this.showshield = this.add.text(384, 60, this.numShield, {
        fontFamily: 'Maven Pro',
        fontSize: '15px',
        fill: '#000'
      });
      this.showshield.setScrollFactor(0, 0);
    }
  }
  sceneRoom() {
    if (uplook <= 0) return;
    ChangeScene.addSceneEventListeners(this);
    this.registry.set('currentHP', this.hptrack);
    this.registry.set('HealItem', this.numShield);
    this.scene.start("Level3", {haveKey: false, haveVisit: 0});
  }
  heal(){
    if(this.numShield > 0 && this.hptrack < 5 ){
      this.numShield -= 1;
      this.hpChange(this.player, 1, this.hptrack, 0);
    }
  }
}
