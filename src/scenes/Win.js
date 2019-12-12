/*global Phaser*/
import * as ChangeScene from "./ChangeScene.js";
var platforms;

export default class Win extends Phaser.Scene {
  constructor () {
    super('Win');
  }

  init (data) {
    // Initialization code goes here
    this.registry.set('currentHP', 5);
    this.registry.set('HealItem', 0);
    this.invent = [[50,550, 0],
                   [97,550, 0],
                   [147, 550, 0],
                   [195, 550, 0],
                   [245, 550, 0],
                   [290, 550, 0]];
  }

  preload () {
    // Preload assets
    this.load.image('win-screen', './assets/images/win-screen.png');

    this.load.spritesheet("buttons", "./assets/spriteSheet/buttons-spritesheet.png", {
      frameHeight: 140,
      frameWidth: 455
    });

    //Audio
    this.load.audio('button', './assets/sounds/Button.mp3');

    // Music as of 11/18/2019
    this.load.audio('losemusic', './assets/music/LoseMusic.mp3');
    this.load.audio('gamemusic', './assets/music/StartMusic.mp3');
    this.load.audio('roommusic', './assets/music/RoomMusic.mp3');
    this.load.audio('winmusic', './assets/music/WinMusic.mp3');
    this.load.audio('MainSong', './assets/ArcadeAdventures.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }


  create (data) {
    if (!this.registry.get('music')[3].isPlaying) {
      this.registry.get('music')[0].stop();
      this.registry.get('music')[1].stop();
      this.registry.get('music')[2].stop();
      this.registry.get('music')[4].stop();
      this.registry.get('music')[3].play();
    }

    /*
    var winsong = this.sound.add('winmusic', {loop: true});
    winsong.play(); // debug check
    */

    // Event listener to change scenes
    ChangeScene.addSceneEventListeners(this);

    //Add background to scene
    var win = this.add.image(400, 300, 'win-screen').setScale(.7);

    this.youlose = this.add.text(150, 180, 'You survived the shipwreck!', {
      fontFamily: 'Quantico',
      fontSize: '40px',
      fill: '#fff'
    });

    //Sounds
    var sound = this.sound.add('button');
    sound.addMarker({
      name: 'low',
      start: 0,
      duration: 1
    });

    //Buttons
    var playagain = this.add.sprite(400, 300, 'buttons', 14).setScale(0.7).setInteractive();
    playagain.on("pointerover", function() {
      sound.play('low');
      this.setFrame(15);
    });

    playagain.on("pointerout", function() {
      this.setFrame(14);
    });

    playagain.on("pointerup", function() {
      this.scene.start("SelectScene", {haveKey: this.haveKey, hptrack: this.hptrack});
    }, this
  );

    var mainmenu = this.add.sprite(400, 420, 'buttons', 16).setScale(0.7).setInteractive();
    mainmenu.on("pointerover", function() {
      sound.play('low');
      this.setFrame(17);
    });

    mainmenu.on("pointerout", function() {
      this.setFrame(16);
    });

    mainmenu.on("pointerup", function() {
      this.scene.start("StartScene", {haveKey: this.haveKey, hptrack: this.hptrack});
    }, this
    );

    //Set main camera's bounraries and tell it follow the player
    this.cameras.main.setBounds(0, 0, 1280, 960);
  }

  update (time, delta) {

    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();


  }
}
