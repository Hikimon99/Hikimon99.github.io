/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 500 },
        debug: false,
        // turned debug on; the player hit box is too large
        //allowGravity: true
        checkCollision: {
                up: true,
                down: true,
                left: true,
                right: true
           }
    }
  },
  pixelArt: true
};
