// the ball3 you are about to fire
var ball3;

// the rectangle where you can place the ball3 and charge the launch power
var launchRectangle = new Phaser.Rectangle(50, 360, 200, 150);

// here we will draw the predictive trajectory
var trajectoryGraphics3;

// a simply multiplier to increase launch power
var forceMult = 5;

// here we will store the launch velocity
var launchVelocity3;

// this is the compound object which will represent the crate
var crateBody;

// we are going to create a moving crate, so this is crate speed
var crateSpeed = 160;

var barBody;

var shots =  3;


var shotActive = false;

var sound;

var shotsText;

var statusText;
var bounces3;

var Stage3 = function(game){};

Stage3.prototype = {
     // preloading graphic assets (only the ball3)
  preload: function(){
        game.load.image("background", "images/background.png");
        game.load.image("ball3", "images/ball.png");
        game.load.image("pole", "images/ShapedPole.png")
        game.load.audio("noProblem", "audio/noproblem.mp3");
        game.load.audio("laugh", "audio/laugh.mp3");
        game.load.audio("lucky", "audio/lucky.mp3");
        game.load.audio("win", "audio/ohhyea.mp3");
        game.load.audio("gig", "audio/gig.mp3");
  },
     // function to be executed onche game has been created
    create: function(){
        // Added background image sprite
          background = game.add.tileSprite(0, 0, 800, 600, "background");
          // adding a new graphics and drawing the launch rectangle in it
          var launchGraphics = game.add.graphics(0, 0);
          launchGraphics.lineStyle(5, 0x551A8B);
          launchGraphics.drawRect(launchRectangle.x, launchRectangle.y, launchRectangle.width, launchRectangle.height);
          // also adding the graphics where we'll draw the trajectory
          trajectoryGraphics3 = game.add.graphics(0, 0);
          // setting initial launch velocity to zero
          launchVelocity3 = new Phaser.Point(0, 0);
          // changing game background to dark grey
          game.stage.backgroundColor = "#222222";
          // initializing Box2D physics
          game.physics.startSystem(Phaser.Physics.BOX2D);
          game.physics.box2d.setBoundsToWorld();
          // setting gravity
          game.physics.box2d.gravity.y = 500;
          // waiting for player input then call placeball3 function
          game.input.onDown.add(placeball3);
          // this is how we build the crate as a compound body
          // it's a kinematic body so it will act as a static body, but it will also react to forces
          crateBody = new Phaser.Physics.Box2D.Body(game, null, 500, 440, 1);
          crateBody.restitution = 0.98;
          crateBody.m_userData = "outside";
          crateBody.addRectangle(120, 10, 0, 0);
          crateBody.addRectangle(10, 110, -55, -60);
          crateBody.addRectangle(10, 110, 55, -60);
          crateBody.m_userData = "outside";
          // inside the crate we also place a sensor to check if the ball3 is inside the crate
          var sensor = crateBody.addRectangle(100, 70, 0, -40);
          sensor.m_isSensor = true;
          // adding custom user data to give crate sensor a name
          sensor.m_userData = "inside";
          // setting crate bitmask to check for selective collisions
          crateBody.setCollisionCategory(2);
          // setting crate horizontal velocity
          crateBody.velocity.x = crateSpeed;
          // also placing a static object to make the game a little harder
          barBody = new Phaser.Physics.Box2D.Body(game, null, 350, 150, 1);
          barBody.setRectangle(10, 150, 0, 0);
          // barBody.color = 0x00ffff;
          barBody.velocity.y = (crateSpeed * 2);
          barBody.setCollisionCategory(2);
          shotsText = game.add.text(16, 16, 'Shots: ' + shots, { font: "24px arial", fill: "#fff" });
          statusText = game.add.text(game.world.centerX, game.world.centerY, "", { font: "32px arial", fill: "#ff69b4", align: "center" });
          statusText.anchor.setTo(0.5, 0.5);

     },
     render: function(){
          // this is the debug draw in action
          game.debug.box2dWorld();

     },
     update: function(){
        background.tilePosition.x += 0.2;
          // updating create velocity according to its position

          if(crateBody.x > 720){
               crateBody.velocity.x = - crateSpeed;
          }
          if(crateBody.x < 500){
               crateBody.velocity.x = crateSpeed;
          }
          if(barBody.y > 300) {
            barBody.velocity.y = - (crateSpeed * 2);
          }
          if (barBody.y < 150) {
            barBody.velocity.y = (crateSpeed * 2);
          }
          // if (shots === 0) {
          // //game.state.start("Over");
          // //alert("Game over!");
          // statusText.text = "Game Over!";
          // //game.destroy();
          //   console.log("you dead!!");
          // //  console.log("you dead!!");
          // }
     },
     balldie: function(){
       if (shots===0) {
       }
     }
};
// this function will place the ball3
function placeball3(e){
  if (!shotActive) {

     // we place a new ball3 only if we are inside launch rectangle
     if(launchRectangle.contains(e.x, e.y)){
          // adding ball3 sprite
          ball3 = game.add.sprite(e.x, e.y, "ball3");
          // enabling physics to ball3 sprite
          game.physics.box2d.enable(ball3);
          // temporarily set ball3 gravity to zero, so it won't fall down
          ball3.body.gravityScale = 0;
          // telling Box2D we are dealing with a circle shape
          ball3.body.setCircle(ball3.width / 2);
          ball3.body.restitution = 0.98;
          // removing onDown listener
          game.input.onDown.remove(placeball3);
          // when the player ends the input call launchball3 function
          game.input.onUp.add(launchball3);
          // when the player moves the input call chargeball3
          game.input.addMoveCallback(chargeball3);
     }
  }
}
// this function will allow the player to charge the ball3 before the launch, and it's the core of the example
function chargeball3(pointer, x, y, down){
     // we does not allow multitouch, so we are only handling pointer which id is zero
     if(pointer.id == 0){
          // clearing trajectory graphics, setting its line style and move the pen on ball3 position
          trajectoryGraphics3.clear();
          trajectoryGraphics3.lineStyle(3, 0xff00ff);
          trajectoryGraphics3.moveTo(ball3.x, ball3.y);
          // now we have two options: the pointer is inside the launch rectangle...
          if(launchRectangle.contains(x, y)){
               // ... and in this case we simply draw a line to pointer position
               trajectoryGraphics3.lineTo(x, y);
               launchVelocity3.x = ball3.x - x;
               launchVelocity3.y = ball3.y - y;
          }
          // ... but the pointer cal also be OUTSIDE launch rectangle
          else{
               // ... in this case we have to check for the intersection between launch line and launch rectangle
               var intersection = lineIntersectsRectangle(new Phaser.Line(x, y, ball3.x, ball3.y), launchRectangle);
               trajectoryGraphics3.lineTo(intersection.x, intersection.y);
               launchVelocity3.x = ball3.x - intersection.x;
               launchVelocity3.y = ball3.y - intersection.y;
          }
          // now it's time to draw the predictive trajectory
          trajectoryGraphics3.lineStyle(1, 0x00ffff);
          launchVelocity3.multiply(forceMult, forceMult);
          for (var i = 0; i < 30; i += 6){
               var trajectoryPoint3 = gettrajectoryPoint3(ball3.x, ball3.y, launchVelocity3.x, launchVelocity3.y, i);
               trajectoryGraphics3.moveTo(trajectoryPoint3.x - 3, trajectoryPoint3.y - 3);
               trajectoryGraphics3.lineTo(trajectoryPoint3.x + 3, trajectoryPoint3.y + 3);
               trajectoryGraphics3.moveTo(trajectoryPoint3.x - 3, trajectoryPoint3.y + 3);
               trajectoryGraphics3.lineTo(trajectoryPoint3.x + 3, trajectoryPoint3.y - 3);
          }
     }
}

// function to launch the ball3
function launchball3(){

     bounces3 = 3;
     // adjusting callbacks
     game.input.deleteMoveCallback(0);
     game.input.onUp.remove(launchball3);
     game.input.onDown.add(placeball3);
     // setting ball3 velocity
     ball3.body.velocity.x = launchVelocity3.x;
     ball3.body.velocity.y = launchVelocity3.y;
     // applying the gravity to the ball3
     ball3.body.gravityScale = 1;
     // ball3 collision listener callback
     ball3.body.setCategoryContactCallback(2, ball3HitsCrate);
     //Adds lives to bouncing
     ball3.body.setCategoryContactCallback(1, hitCollision3);
     shotActive = true;

}

//Adds lives to bouncing
function hitCollision3(body1, body2, fixture1, fixture2, begin) {


  if (!begin) {
    return;
  }
      bounces3--;
       console.log("bounces3 left: " + bounces3);

   if (bounces3 < 1) {
      body1.sprite.destroy();

      shotActive = false;
      shots--;

      shotsText.text = 'Shots: ' + shots;

      var num = getRandomInt(1,3);

      }
      sound.play();
      if (shots === 0) {
        // game.state.start("Over");
        shotActive = true;
      statusText.text = "Game Over!";
        console.log("you dead!!");
      }
      else {
      switch (num) {
        case 1:
              sound = game.add.audio("gig");
        break;
          case 2:
                sound = game.add.audio("laugh");
                      sound.volume = 20;
          break;
        default:
              sound = game.add.audio("noProblem");
        break;

      }

   }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to be executed when the ball3 hits the crate
function ball3HitsCrate(body1, body2, fixture1, fixture2, begin){
     // we only want this to happen when the hit begins
     if(begin){
          // if the ball3 hits the sensor inside...
          if(fixture2.m_userData == "inside"){
               // setting restitution to zero to prevent the ball3 to jump off the box, but it's just a "hey I got the collision" test
               body1.restitution = 0;
               // now the ball3 looks for a contact category which does not exist, so we won't trigger anymore the contact with the sensor
               body1.setCategoryContactCallback(4, ball3HitsCrate);
               bounces3 = 1000;
               shotActive = true;
               console.log("Game won");
                //game.state.start("Over");
            sound = game.add.audio('win');
            sound.play();

          }
     }
}

// simple function to check for intersection between a segment and a rectangle
function lineIntersectsRectangle(l, r){
     return l.intersects(new Phaser.Line(r.left, r.top, r.right, r.top), true) ||
          l.intersects(new Phaser.Line(r.left, r.bottom, r.right, r.bottom), true) ||
          l.intersects(new Phaser.Line(r.left, r.top, r.left, r.bottom), true) ||
          l.intersects(new Phaser.Line(r.right, r.top, r.right, r.bottom), true);
}

// function to calculate the trajectory point taken from http://phaser.io/examples/v2/box2d/projected-trajectory
function gettrajectoryPoint3(startX, startY, velocityX, velocityY, n) {
     var t = 1 / 60;
     var stepVelocityX = t * game.physics.box2d.pxm(-velocityX);
     var stepVelocityY = t * game.physics.box2d.pxm(-velocityY);
     var stepGravityX = t * t * game.physics.box2d.pxm(-game.physics.box2d.gravity.x);
     var stepGravityY = t * t * game.physics.box2d.pxm(-game.physics.box2d.gravity.y);
     startX = game.physics.box2d.pxm(-startX);
     startY = game.physics.box2d.pxm(-startY);
     var tpx = startX + n * stepVelocityX + 0.5 * (n * n + n) * stepGravityX;
     var tpy = startY + n * stepVelocityY + 0.5 * (n * n + n) * stepGravityY;
     tpx = game.physics.box2d.mpx(-tpx);
     tpy = game.physics.box2d.mpx(-tpy);
     return {
          x: tpx,
          y: tpy
     };
}
