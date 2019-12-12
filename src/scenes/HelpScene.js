/*global Phaser*/
export default class HelpScene extends Phaser.Scene {
  constructor () {
    super('HelpScene');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets

    //Background
    this.load.image('help-screen', './assets/images/help-screen.png');

    //Buttons
    this.load.spritesheet("buttons", "./assets/spriteSheet/buttons-spritesheet.png", {
      frameHeight: 250,
      frameWidth: 512
    });

    // Temporary audio
    this.load.audio('5b', './assets/5b.mp3');
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
    // this.registry.get('music')[4].stop();
    // this.registry.get('music')[4].play();

    //Create the scene
    var help = this.add.image(this.centerX, this.centerY, 'help-screen').setScale(0.77);

    this.instructions = this.add.text(270, 25, 'Instructions', {
      fontFamily: 'Quantico',
      fontSize: '50px',
      fill: '#D5F3FF'
    });


    var sound = this.sound.add('buttonSound');
    sound.addMarker({
      name: 'low',
      start: 0,
      duration: 1
    });

    //Button
    var back = this.add.sprite(50, 25, 'buttons', 4).setScale(0.3).setInteractive();
    back.on("pointerover", function() {
      sound.play('low');
      this.setFrame(5);
    });

    back.on("pointerout", function() {
      this.setFrame(4);
    });

    back.on("pointerup", function() {
      this.scene.start("StartScene");
    }, this
  );
  }


  update (time, delta) {
    // Update the scene
  }
}
