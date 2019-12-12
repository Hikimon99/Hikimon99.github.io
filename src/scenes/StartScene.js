/*global Phaser*/
import * as ChangeScene from './changeScene.js';
export default class StartScene extends Phaser.Scene {
  constructor () {
    super('StartScene');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet("waves", "./assets/spriteSheet/waves-spritesheet3.png", {
      frameHeight: 480,
      frameWidth: 120
    });

    this.load.spritesheet("playersAv", "./assets/spriteSheet/adventurer.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    this.load.image('start-background', './assets/images/start-screen.png');

    //Load background
    this.load.image('background', './assets/images/background1.png');

    this.load.spritesheet("buttons", "./assets/spriteSheet/buttons-spritesheet.png", {
      frameHeight: 140,
      frameWidth: 455
    });

    this.load.image('crack', './assets/sprites/wall-crack.png');

    //Get platforms
    this.load.image('ground', './assets/platform.png');

    // Preload room assets
    this.load.image('bed', './assets/sprites/bed.png');
    this.load.image('bookshelf', './assets/sprites/bookshelf.png');
    this.load.image('couch', './assets/sprites/couch.png');
    this.load.image('painting', './assets/sprites/painting.png');
    this.load.image('rug', './assets/sprites/rug.png');
    this.load.image('stool', './assets/sprites/stool.png');
    this.load.image('table', './assets/sprites/table.png');
    this.load.image('floor', './assets/sprites/floor.png');
    this.load.image('keyer', './assets/sprites/green-key.png');
    this.load.image('ground', './assets/platform.png');
    this.load.image('green-bed', './assets/sprites/green-bed.png');
    this.load.image('bookshelf-brown', './assets/sprites/bookshelf-brown.png');
    this.load.image('rug-green', './assets/sprites/rug-green.png');
    this.load.image('stool-white', './assets/sprites/stool-white.png');
    this.load.image('door-open', './assets/sprites/door-open.png');

    // DOORS
        //Load doors
        this.load.image('door-open', './assets/sprites/door-open.png');
        this.load.image('door-closed', './assets/sprites/door-closed.png');
        this.load.image('reddoor-open', './assets/sprites/reddoor-open.png');
        this.load.image('reddoor-closed', './assets/sprites/reddoor-closed.png');
        this.load.image('greendoor-open', './assets/sprites/greendoor-open.png');
        this.load.image('greendoor-closed', './assets/sprites/greendoor-closed.png');

    // AUDIO
        // Sound effects (copy/paste)
        this.load.audio('button', './assets/sounds/Button.mp3');
        this.load.audio('pluskey', './assets/sounds/CollectKey.wav');
        this.load.audio('plusshield', './assets/sounds/CollectShield.mp3');
        this.load.audio('slamdoor', './assets/sounds/Door.mp3');
        this.load.audio('gothit', './assets/sounds/GotHit.wav');
        this.load.audio('losegame', './assets/sounds/Lose.wav');
        this.load.audio('nextlevel', './assets/sounds/NextLevel.wav');
        this.load.audio('slashy', './assets/sounds/SwordSlash.wav');
        this.load.audio('PowerDown-Not', './assets/sounds/PowerDown7.mp3');
        this.load.audio('PowerDown', './assets/sounds/Laser-Shot-1.mp3');
    //HP
    this.load.image("hp", "./assets/images/GreenHealth.png");
    this.load.image("hp-bar", "./assets/images/HealthBar.png");

    //Item box
    this.load.image("itemBox", "./assets/images/ItemBox.png");

    //Shields for hp
    this.load.image("shield", "./assets/sprites/seaweed.png");

    // Music as of 11/18/2019
    this.load.audio('losemusic', './assets/music/LoseMusic.mp3');
    this.load.audio('menumusic', './assets/music/StartMusic.mp3');
    this.load.audio('roommusic', './assets/music/RoomMusic.mp3');
    this.load.audio('winmusic', './assets/music/WinMusic.mp3');
    this.load.audio('gamemusic', './assets/ArcadeAdventures.mp3');

    //LEVEL 2
    //Load sword
    this.load.image('sword', './assets/sprites/sword.png');

    //Load background
    this.load.image('background2', './assets/images/background2.png');

    //Bullets to dodge
    this.load.image('turret', './assets/sprites/tankTurret.png');
    this.load.image("bullet", "./assets/sprites/bullet.png");

    // Blue ball for water spill
    this.load.image('blu', './assets/sprites/bluBall.png');

    //Character spritesheets
    this.load.spritesheet("shark", "./assets/spriteSheet/shark-spritesheet.png", {
      frameHeight: 35,
      frameWidth: 70
    });

    this.load.spritesheet("ghost", "./assets/spriteSheet/ghostSheet.png", {
      frameHeight: 512,
      frameWidth: 511
    });

    this.load.spritesheet("king-ghost", "./assets/spriteSheet/king-ghost.png", {
      frameHeight: 512,
      frameWidth: 511
    });

    this.registry.set('HoldSword', true);
    this.registry.set('MenuPlay', true);
    this.registry.set("hitme", false);

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    if (this.registry.get('music') != null) {
          this.registry.get('music')[0].stop();
          this.registry.get('music')[1].stop();
          this.registry.get('music')[2].stop();
          this.registry.get('music')[3].stop();
          if (!this.registry.get('music')[4].isPlaying) {
            this.registry.get('music')[4].play();
          }
        }
        else {
          this.music = [];
          this.music.push(this.sound.add('losemusic', {loop: true}));
          this.music.push(this.sound.add('gamemusic', {loop: true}));
          this.music.push(this.sound.add('roommusic', {loop: true}));
          this.music.push(this.sound.add('winmusic', {loop: true}));
          this.music.push(this.sound.add('menumusic', {loop: true}));
          this.registry.set('music', this.music);
          this.registry.get('music')[0].stop();
          this.registry.get('music')[1].stop();
          this.registry.get('music')[2].stop();
          this.registry.get('music')[3].stop();
          this.registry.get('music')[4].stop();
          this.registry.get('music')[4].play();
          // No need for a 'for' loop when there's not that many songs
        }

    this.invent = [[279, 60, 0],
                   [326, 60, 0],
                   [374, 60, 0],
                   [422, 60, 0],
                   [470, 60, 0],
                   [518, 60, 0]];
    this.registry.set('inventory', this.invent);
    this.registry.set('levelskip', 1);
    this.registry.set('waveloco', 1550)

    //Add event listeners
    ChangeScene.addSceneEventListeners(this);
    this.haveKey = false;
    this.hptrack = 1.0;
    this.registry.set('currentHP', 5);

    this.registry.set('HealItem', 0);

    //Create the scene
    var start = this.add.image(this.centerX, this.centerY, 'start-background').setScale(0.67);

    //Button sound
    var sound = this.sound.add('button');
    sound.addMarker({
      name: 'low',
      start: 0,
      duration: 1
    });

    //Title
    this.title = this.add.text(455, 150, 'Sunked', {
      fontFamily: 'Tomorrow',
      fontSize: '70px',
      fill: '#D5F3FF'
    });

    //Buttons
    var b1 = this.add.sprite(580, 325, 'buttons', 0).setScale(0.6).setInteractive();
    b1.on("pointerover", function() {
      sound.play('low');
      this.setFrame(1);
    });

    b1.on("pointerout", function() {
      this.setFrame(0);
    });

    b1.on("pointerup", function() {
      this.scene.start("SelectScene");
    }, this
  );

    var b2 = this.add.sprite(580, 430, 'buttons', 2).setScale(0.6).setInteractive();
    b2.on("pointerover", function() {
      sound.play('low');
      this.setFrame(3);
    });

    b2.on("pointerout", function() {
      this.setFrame(2);
    });

    b2.on("pointerup", function() {
      this.scene.start("HelpScene", {haveKey: this.haveKey, hptrack: this.hptrack});
    }, this
  );
  }


  update (time, delta) {
    // Update the scene
  }
}
