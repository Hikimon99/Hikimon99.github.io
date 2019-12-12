export { addSceneEventListeners };

function addSceneEventListeners (that) {
  that.input.keyboard.on(
    "keydown_ZERO",
      function () {
        that.scene.start('MainMenu');
      }
  );
  that.input.keyboard.on(
    "keydown_FIVE",
      function () {
        that.scene.start('Level5');
      }
  );
  // that.input.keyboard.on(
  //   "keydown_ESC",
  //     function () {
  //       that.scene.start('Boot');
  //     }
  // );
}
