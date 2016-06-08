var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/GameMenu.js');
    game.load.script('stage1', 'states/Stage1.js');
    game.load.script('stage2', 'states/Stage2.js');
    game.load.script('stage3', 'states/Stage3.js');
    //game.load.script('playGame', 'states/Game2.js');
    game.load.script('Over','states/gameover.js');
    game.load.script('credits', 'states/Credits.js');
    game.load.script('options', 'states/Options.js');
  },

  loadBgm: function () {
    // Musik
    game.load.audio('dangerous', 'assets/bgm/love_muscle.mp3');
    game.load.audio('exit', 'assets/bgm/love_muscle.mp3');
  },

  loadImages: function () {
    game.load.image('menu-bg', 'assets/images/menu-bg2.png');
    game.load.image('options-bg', 'assets/images/menu-bg2.png');
    game.load.image('gameover-bg', 'assets/images/menu-bg2.png');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['assets/style/theminion.css']
      }
    }
  },

  init: function () {
    //Adds loading bar
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "progress");
    //Adds logo
    this.logo       = game.make.sprite(game.world.centerX, 200, 'logo');
    //Adds text to loading bar
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    //Centrerer objekter
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'background');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("Over",Over);
    game.state.add("Stage1",Stage1);
    game.state.add("Stage2",Stage2);
    game.state.add("Stage3",Stage3);
    //game.state.add("playGame", playGame)
    game.state.add("Credits",Credits);
    //game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
