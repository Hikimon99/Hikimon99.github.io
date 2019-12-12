/*global Phaser*/
import * as ChangeScene from './changeScene.js';
export default class StartScene extends Phaser.Scene {
  constructor () {
    super('SelectScene');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('start-background', './assets/images/start-screen.png');

    this.load.spritesheet("level-button", "./assets/spriteSheet/level-button.png", {
      frameHeight: 141,
      frameWidth: 453
    });

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
    if( this.registry.get('MenuPlay') == false){
      this.registry.get('music')[4].play();
    }
    else{
      this.registry.set('MenuPlay', false);
    }
    this.registry.set('waveloco', 1650);
    this.registry.set('NewWeed', 0);

    //Add event listeners
    ChangeScene.addSceneEventListeners(this);

    //Create the scene
    this.cameras.main.setBackgroundColor(0x3874d6);

    this.add.text(260, 80, 'Select Level', {
      fontFamily: 'Quantico',
      fontSize: '50px',
      fill: '#fff'
    });

    //Sound
    var sound = this.sound.add('button');
    sound.addMarker({
      name: 'low',
      start: 0,
      duration: 1
    });

    if(this.registry.get('levelskip') >= 1){
    var b1 = this.add.sprite(225, 225, 'level-button', 0).setScale(0.6).setInteractive();
    b1.on("pointerover", function() {
      sound.play('low');
      this.setFrame(1);
    });

    b1.on("pointerout", function() {
      this.setFrame(0);
    });

    b1.on("pointerup", function() {
      this.scene.start("Level1", {haveKey: false,  haveVisit: 0});
    }, this
    );
    }

    if(this.registry.get('levelskip') >= 2){
    var b2 = this.add.sprite(575, 225, 'level-button', 2).setScale(0.6).setInteractive();
    b2.on("pointerover", function() {
      sound.play('low');
      this.setFrame(3);
    });

    b2.on("pointerout", function() {
      this.setFrame(2);
    });

    b2.on("pointerup", function() {
      this.scene.start("Level2", {haveKey: false, haveVisit: 0,});
    }, this
  );
  }

  if(this.registry.get('levelskip') >= 3){
  var b3 = this.add.sprite(225, 350, 'level-button', 4).setScale(0.6).setInteractive();
  b3.on("pointerover", function() {
    sound.play('low');
    this.setFrame(5);
  });

  b3.on("pointerout", function() {
    this.setFrame(4);
  });

  b3.on("pointerup", function() {
    this.scene.start("Level3", {haveKey: false, haveVisit: 0});
  }, this
);
  }

  if(this.registry.get('levelskip') >= 4){
  var b4 = this.add.sprite(575, 350, 'level-button', 6).setScale(0.6).setInteractive();
  b4.on("pointerover", function() {
    sound.play('low');
    this.setFrame(7);
  });

  b4.on("pointerout", function() {
    this.setFrame(6);
  });

  b4.on("pointerup", function() {
    this.scene.start("Level4", {haveKey: false, haveVisit: 0});
  }, this
);
  }

  if(this.registry.get('levelskip') >= 5){
  var b5 = this.add.sprite(400, 475, 'level-button', 8).setScale(0.6).setInteractive();
  b5.on("pointerover", function() {
    sound.play('low');
    this.setFrame(9);
  });

  b5.on("pointerout", function() {
    this.setFrame(8);
  });

  b5.on("pointerup", function() {
    this.scene.start("Level5", {haveKey: false,  haveVisit: 0});
  }, this
);
  }

//   var back = this.add.sprite(60, 40, 'buttons', 4).setScale(0.7).setInteractive();
//   back.setScale(.4);
//   back.setScrollFactor(0,0);
//   back.on("pointerover", function() {
//     sound.play('low');
//     this.setFrame(5);
//   });
//
//   back.on("pointerout", function() {
//     this.setFrame(4);
//   });
//
//   back.on("pointerup", function() {
//     this.scene.start("StartScene");
//   }, this
// );
  }


  update (time, delta) {
    // Update the scene
  }
}
