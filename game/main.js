// Global Variables
var
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: false,
    playMusic: false
  },
  musicPlayer;




Main.prototype = {

  preload: function () {
    game.load.image('background',    'assets/images/background.png');
    game.load.image('progress',  'assets/images/progress.png');
    game.load.image('logo',    'assets/images/logo1.png');
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('box2d', 'lib/box2d-plugin-full.js');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
