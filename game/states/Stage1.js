// the game itself
// var game;

// the ball1 you are about to fire
var ball1;

// the rectangle where you can place the ball1 and charge the launch power
var launchRectangle = new Phaser.Rectangle(30, 400, 200, 150);

// here we will draw the predictive trajectory
var trajectoryGraphics1;

// a simply multiplier to increase launch power
var forceMult = 5;

// here we will store the launch velocity
var launchVelocity1;

// this is the compound object which will represent the crate
var crateBody;

// we are going to create a moving crate, so this is crate speed
var crateSpeed = 160;

var barBody2Speed = 160;

var shots = 3;

var bounces1;

var shotActive = false;

var shotsText;
var statusText;

var Stage1 = function(game){};

Stage1.prototype = {
     // preloading graphic assets (only the ball1)
	preload: function(){
        game.load.image("background", "images/background.png");
        game.load.image("ball1", "images/ball.png");
        game.load.image("pole", "images/pole.png")
        game.load.audio("noProblem", "audio/noproblem.mp3");
        game.load.audio("laugh", "audio/laugh.mp3");
        game.load.audio("lucky", "audio/lucky.mp3");
        game.load.audio("gig", "audio/gig.mp3");
        game.load.audio("win", "audio/ohhyea.mp3");
        game.load.audio("gameover", "audio/gameover.mp3");

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
          trajectoryGraphics1 = game.add.graphics(0, 0);
          // setting initial launch velocity to zero
          launchVelocity1 = new Phaser.Point(0, 0);
          // changing game background to dark grey
		game.stage.backgroundColor = "#222222";
          // initializing Box2D physics
		game.physics.startSystem(Phaser.Physics.BOX2D);
          //Set bounces1
          game.physics.box2d.setBoundsToWorld();
          // setting gravity
          game.physics.box2d.gravity.y = 500;
		// waiting for player input then call placeball1 function
          game.input.onDown.add(placeball1);
          // this is how we build the crate as a compound body
          // it's a kinematic body so it will act as a static body, but it will also react to forces
          crateBody = new Phaser.Physics.Box2D.Body(game, null, 500, 440, 1);
          crateBody.restitution = 0.98;
          crateBody.addRectangle(120, 10, 0, 0);
          crateBody.addRectangle(10, 110, -55, -60);
          crateBody.addRectangle(10, 110, 55, -60);
          /*var crateTop = crateBody.addRectangle(10, 40, 68, -124, Math.PI / 4);
          // adding custom user data to give crate parts a name
          crateTop.m_userData = "top";
          crateTop = crateBody.addRectangle(10, 40, -68, -124, -Math.PI / 4);
          crateTop.m_userData = "top"; */
          // inside the crate we also place a sensor to check if the ball1 is inside the crate
          var sensor = crateBody.addRectangle(100, 70, 0, -40);
          sensor.m_isSensor = true;
          // adding custom user data to give crate sensor a name
          sensor.m_userData = "inside";
          // setting crate bitmask to check for selective collisions
          crateBody.setCollisionCategory(2);
          // setting crate horizontal velocity
          crateBody.velocity.x = crateSpeed;
          // also placing a static object to make the game a little harder
          var barBody = new Phaser.Physics.Box2D.Body(game, null, 350, 300, 0);
          barBody.setRectangle(140, 250, 0, 0);
          barBody.setCollisionCategory(1);

          var barBody2 = new Phaser.Physics.Box2D.Body(game, null, 650, 200, 0);
          barBody2.setRectangle(140, 50, 0, 0);
          barBody2.setCollisionCategory(1);

          shotsText = game.add.text(30, 30, 'Shots: 3', { fontSize: '32px', fill: '#fff' });
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
          if(crateBody.x > 710){
               crateBody.velocity.x = - crateSpeed;
          }
          if(crateBody.x < 500){
               crateBody.velocity.x = crateSpeed;
          }
     }

}

// this function will place the ball1
function placeball1(e){

 if (!shotActive) {

     // we place a new ball1 only if we are inside launch rectangle
     if(launchRectangle.contains(e.x, e.y)){
          // adding ball1 sprite
          ball1 = game.add.sprite(e.x, e.y, "ball1");
          // enabling physics to ball1 sprite
          game.physics.box2d.enable(ball1);
          // temporarily set ball1 gravity to zero, so it won't fall down
          ball1.body.gravityScale = 0;
          // telling Box2D we are dealing with a circle shape
          ball1.body.setCircle(ball1.width / 2);
          ball1.body.restitution = 0.98;
          // removing onDown listener
          game.input.onDown.remove(placeball1);
          // when the player ends the input call launchball11 function
          game.input.onUp.add(launchball11);
          // when the player moves the input call chargeball11
          game.input.addMoveCallback(chargeball11);
     }
}
}
// this function will allow the player to charge the ball1 before the launch, and it's the core of the example
function chargeball11(pointer, x, y, down){
     // we does not allow multitouch, so we are only handling pointer which id is zero
     if(pointer.id == 0){
          // clearing trajectory graphics, setting its line style and move the pen on ball1 position
          trajectoryGraphics1.clear();
          trajectoryGraphics1.lineStyle(3, 0x00ff00);
          trajectoryGraphics1.moveTo(ball1.x, ball1.y);
          // now we have two options: the pointer is inside the launch rectangle...
          if(launchRectangle.contains(x, y)){
               // ... and in this case we simply draw a line to pointer position
               trajectoryGraphics1.lineTo(x, y);
               launchVelocity1.x = ball1.x - x;
               launchVelocity1.y = ball1.y - y;
          }
          // ... but the pointer cal also be OUTSIDE launch rectangle
          else{
               // ... in this case we have to check for the intersection between launch line and launch rectangle
               var intersection = lineIntersectsRectangle(new Phaser.Line(x, y, ball1.x, ball1.y), launchRectangle);
               trajectoryGraphics1.lineTo(intersection.x, intersection.y);
               launchVelocity1.x = ball1.x - intersection.x;
               launchVelocity1.y = ball1.y - intersection.y;
          }
          // now it's time to draw the predictive trajectory
          trajectoryGraphics1.lineStyle(1, 0x00ff00);
          launchVelocity1.multiply(forceMult, forceMult);
          for (var i = 0; i < 180; i += 6){
               var trajectoryPoint = getTrajectoryPoint1(ball1.x, ball1.y, launchVelocity1.x, launchVelocity1.y, i);
               trajectoryGraphics1.moveTo(trajectoryPoint.x - 3, trajectoryPoint.y - 3);
               trajectoryGraphics1.lineTo(trajectoryPoint.x + 3, trajectoryPoint.y + 3);
               trajectoryGraphics1.moveTo(trajectoryPoint.x - 3, trajectoryPoint.y + 3);
               trajectoryGraphics1.lineTo(trajectoryPoint.x + 3, trajectoryPoint.y - 3);
          }
     }
}

// function to launch the ball1
function launchball11(){
     bounces1 = 3;
     // adjusting callbacks
     game.input.deleteMoveCallback(0);
     game.input.onUp.remove(launchball11);
     game.input.onDown.add(placeball1);
     // setting ball1 velocity
     ball1.body.velocity.x = launchVelocity1.x;
     ball1.body.velocity.y = launchVelocity1.y;
     // applying the gravity to the ball1
     ball1.body.gravityScale = 1;
     // ball1 collision listener callback
     ball1.body.setCategoryContactCallback(2, ball1HitsCrate);
     ball1.body.setCategoryContactCallback(1, hitCollision1);
     shotActive = true;

}

// function to be executed when the ball1 hits the crate
function ball1HitsCrate(body1, body2, fixture1, fixture2, begin){
     // we only want this to happen when the hit begins
     if(begin){
          // if the ball1 hits the sensor inside...
          if(fixture2.m_userData == "inside"){
               // setting restitution to zero to prevent the ball1 to jump off the box, but it's just a "hey I got the collision" test
               body1.restitution = 0;
               // now the ball1 looks for a contact category which does not exist, so we won't trigger anymore the contact with the sensor
               body1.setCategoryContactCallback(4, ball1HitsCrate);
               bounces1 = 1000;
               shotActive = true;
               console.log("Game won");
               statusText.text = "You won Creampie!";
							    //  setTimeout(function () {
							    //    game.state.start("Stage2");
							    //  }, 2000);
               sound = game.add.audio('lucky');
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
function getTrajectoryPoint1(startX, startY, velocityX, velocityY, n) {
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

//Adds lives to bouncing
function hitCollision1(body1, body2, fixture1, fixture2, begin) {


  if (!begin) {
    return;
  }
      bounces1--;
       console.log("bounces left: " + bounces1);

   if (bounces1 < 1) {
		 body1.sprite.destroy();

 		shotActive = false;
 		shots--;

 		shotsText.text = 'Shots: ' + shots;

 		var num = getRandomInt(1,3);
 		if (shots === 0) {
 			// game.state.start("Over");
 			sound = game.add.audio("gameover");
 			sound.play();
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
 		sound.play();

 		}

   }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
