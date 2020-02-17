/*global Phaser*/
var platforms;

export default class GameOver extends Phaser.Scene {
  constructor () {
    super('GameOver');
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
    this.registry.set('inventory', this.invent);
    this.viewOn = [["key", false, -1],
                    ["sword", false, -1],
                    ["shield", false, -1]];
    this.registry.set('ItemsinView', this.viewOn);
  }

  preload () {
    // Preload assets
    this.load.spritesheet("buttons", "./assets/spriteSheet/buttons-spritesheet.png", {
      frameHeight: 140,
      frameWidth: 455
    });

    //Player spritesheet
    this.load.spritesheet("playersAv", "./assets/spriteSheet/adventurer.png", {
      frameHeight: 32,
      frameWidth: 32
    });

    //Get background
    this.load.image('lose-background', './assets/images/lose-screen.png');

    // Temporary audio
    this.load.audio('buttonSound', './assets/sounds/Button.mp3');

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
    this.registry.get('music')[0].play();

    //Add background to scene
    var lose = this.add.image(500, 490, 'lose-background').setScale(0.66);

    this.youlose = this.add.text(355, 520, 'You were sunked', {
      fontFamily: 'Maven Pro',
      fontSize: '40px',
      fill: '#fff'
    });

    //Sounds
    var sound = this.sound.add('buttonSound');
    sound.addMarker({
      name: 'low',
      start: 0,
      duration: 1
    });

    //Buttons
    var tryagain = this.add.sprite(510, 660, 'buttons', 12).setScale(0.65).setInteractive();
    tryagain.on("pointerover", function() {
      sound.play('low');
      this.setFrame(13);
    });

    tryagain.on("pointerout", function() {
      this.setFrame(12);
    });

    tryagain.on("pointerup", function() {
      this.scene.start("SelectScene", {haveKey: this.haveKey, hptrack: this.hptrack});
    }, this
  );

    var mainmenu = this.add.sprite(510, 780, 'buttons', 16).setScale(0.65).setInteractive();
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

    //Measurements for scores
    this.gameOver = false;
    this.score = 0;

    //This for text for scores
    //Add player sprite with arcade physics and boundaries
    this.player = this.physics.add.sprite(500, 0, "playersAv");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 1280, 960);

    // this.add.text(320, 650, 'GAME OVER', {
    //   fontSize: '70px',
    //   fill: '#009'
    // });

    //Set main camera's bounraries and tell it follow the player
    this.cameras.main.setBounds(0, 0, 1280, 960);
    this.cameras.main.startFollow(this.player);

  }

  update (time, delta) {
    // Update the scene
    if (this.gameOver)
    {
        return;
    }
  }

}
