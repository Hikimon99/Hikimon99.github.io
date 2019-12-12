/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import StartScene from './scenes/StartScene.js';
import SelectScene from './scenes/SelectScene.js';
import HelpScene from './scenes/HelpScene.js';
import JumpTut1 from './scenes/JumpTut1.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Level3 from './scenes/Level3.js';
import Level4 from './scenes/Level4.js';
import Level5 from './scenes/Level5.js';
import GameOver from './scenes/GameOver.js';
import MainMenu from './scenes/MainMenu.js';
import Win from './scenes/Win.js';
import RoomScene from './scenes/RoomScene.js';
import RoomSceneKey from './scenes/RoomSceneKey.js';
import RoomScene2 from './scenes/RoomScene2.js';
import RoomScene3 from './scenes/RoomScene3.js';
import RoomSceneKey2 from './scenes/RoomSceneKey2.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('StartScene', StartScene);
    this.scene.add('HelpScene', HelpScene);
    this.scene.add('JumpTut1', JumpTut1);
    this.scene.add('Level1', Level1);
    this.scene.add('Level2', Level2);
    this.scene.add('Level3', Level3);
    this.scene.add('Level4', Level4);
    this.scene.add('Level5', Level5);
    this.scene.add('GameOver', GameOver);
    this.scene.add('MainMenu', MainMenu);
    this.scene.add('RoomScene', RoomScene);
    this.scene.add('RoomSceneKey', RoomSceneKey);
    this.scene.add('RoomScene2', RoomScene2);
    this.scene.add('RoomScene3', RoomScene3);
    this.scene.add('RoomSceneKey2', RoomSceneKey2);
    this.scene.add('Win', Win);
    this.scene.add('SelectScene', SelectScene);
    this.scene.start('StartScene');
  }
}

window.game = new Game();
