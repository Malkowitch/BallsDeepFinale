var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 330
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Balls Deep", {
      font: 'bold 60pt TheMinion',
      fill: '#ffffff',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {

    if (music.name !== "dangerous" && playMusic) {
      music.stop();
      music = game.add.audio('dangerous');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);
        this.addMenuOption('Level 1', function () {
          game.state.start("Stage1");
        });
        this.addMenuOption('Level 2', function () {
          game.state.start("Stage2");
        });

    this.addMenuOption('Level 3', function () {
      game.state.start("Stage3");
    });
    /*this.addMenuOption('Options', function () {
      game.state.start("Options");
    });
    this.addMenuOption('Credits', function () {
      game.state.start("Credits");
    });*/
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
