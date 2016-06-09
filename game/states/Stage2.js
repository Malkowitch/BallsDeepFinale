// The game itself
// var game;

// Background for the game
var background;

// The ball2 you are about to fire
var ball2;

// The rectangle where you can place the ball2 and charge the launch power
var launchRectangle = new Phaser.Rectangle(30, 400, 250, 170);

// Here we will draw the predictive trajectory
var trajectoryGraphics2;

// A simple multiplier to increase launch power
var forceMult = 5;

// Stored launch velocity
var launchVelocity2;

// This is the compound object which will represent the bucket
var bucketBody;

// Kill object
var deadZone;

// We are going to create a moving bucket, so this is bucket speed
var bucketSpeed = 160;

// New moving object
var movingWall;

// Speed of movingWall object
var wallSpeed = 100;

var sound;

var shots =  3;

var bounces2;

var shotActive = false;

var sound;

var shotsText;

var statusText;

var Stage2 = function(game) {};

Stage2.prototype = {
    // Preloading graphics and audio assets
    preload: function() {
        game.load.image("background", "images/background.png");
        game.load.image("ball2", "images/ball.png");
        game.load.audio("noProblem", "audio/noproblem.mp3");
        game.load.audio("laugh", "audio/laugh.mp3");
        game.load.audio("lucky", "audio/lucky.mp3");
        game.load.audio("gig", "audio/gig.mp3");
        game.load.audio("win", "audio/ohhyea.mp3");
        game.load.audio("yeahbaby", "audio/yeahbaby.mp3");
        game.load.audio("gameover", "audio/gameover.mp3");
    },
    // Function to be executed once the game has been created
    create: function() {
        // Added background image sprite
        background = game.add.tileSprite(0, 0, 800, 600, "background");

        // Adding a new graphics and drawing the launch rectangle in it
        var launchGraphics2 = game.add.graphics(0, 0);
        launchGraphics2.lineStyle(3, 0x551A8B);
        launchGraphics2.drawRect(launchRectangle.x, launchRectangle.y, launchRectangle.width, launchRectangle.height);

        // Also adding the graphics where we'll draw the trajectory
        trajectoryGraphics2 = game.add.graphics(0, 0);

        // Setting initial launch velocity to zero
        launchVelocity2 = new Phaser.Point(0, 0);

        // Initializing Box2D physics
        game.physics.startSystem(Phaser.Physics.BOX2D);

        // Setting gravity
        game.physics.box2d.gravity.y = 500;
        game.physics.box2d.setBoundsToWorld();

        // Waiting for player input then call placeball2 function
        game.input.onDown.add(placeball2);

        // This is how we build the bucket as a compound body
        // It's a kinematic body so it will act as a static body, but it will also react to forces
        bucketBody = new Phaser.Physics.Box2D.Body(game, null, 500, 440, 1);
        bucketBody.restitution = 0.8;
        bucketBody.addRectangle(120, 10, 0, 0);
        bucketBody.addRectangle(10, 110, -55, -60);
        bucketBody.addRectangle(10, 110, 55, -60);

        // Another kinematic body
        movingWall = new Phaser.Physics.Box2D.Body(game, null, 571, 50, 1);
        movingWall.restitution = 0.1;
        movingWall.addRectangle(10, 80, 0, 0);
        movingWall.setCollisionCategory(4);

				// Makes movingWall move in the y axis (up and down)
        movingWall.velocity.y = wallSpeed;

        // Placing static objects to make the game a bit harder
        var bar1Body = new Phaser.Physics.Box2D.Body(game, null, 350, 360, 0);
        bar1Body.setRectangle(50, 500, 0, 0);
        bar1Body.setCollisionCategory(4);

        var bar2Body = new Phaser.Physics.Box2D.Body(game, null, 470, 115, 0);
        bar2Body.setRectangle(190, 10, 0, 0);
        bar2Body.restitution = 0.1;
        bar2Body.setCollisionCategory(4);

        var bar3Body = new Phaser.Physics.Box2D.Body(game, null, 735, 210, 0);
        bar3Body.setRectangle(150, 10, 0, 0, Math.PI / -7);
        bar3Body.restitution = 0.1;
        bar3Body.setCollisionCategory(4);

        // Adding bitmapData graphics by drawing in Canvas
        // First middle wall
        // var wall = game.add.bitmapData(128, 500);
        //
        // // Drawing on canvas
        // wall.ctx.beginPath();
        // wall.ctx.rect(0, 0, 50, 1000);
        // wall.ctx.fillStyle = 'pink';
        // wall.ctx.fill();
        //
        // var wally = game.add.sprite(325, 110, wall);
        //
        // // The upper plank
        // var plank = game.add.bitmapData(300, 128);
        //
        // // Drawing on canvas
        // plank.ctx.beginPath(bar2Body);
        // plank.ctx.rect(0, 0, 191, 10);
        // plank.ctx.fillStyle = 'pink';
        // plank.ctx.fill();
        //
        // var planky = game.add.sprite(375, 110, plank);

        // Deadzone for the ball2 to be destroyed on collision
        deadZone = new Phaser.Physics.Box2D.Body(game, null, 400, 600, 4);

        var terminate = deadZone.addRectangle(800, 3, 0, 0);
        // Telling the object to kill ball2 when it hits the object
        terminate.m_userData = "die";
				// Links the collision so the collision kills the ball2
				deadZone.setCollisionCategory(4);

        // A sensor to detect if the ball2 is inside the bucket
        var sensor = bucketBody.addRectangle(100, 70, 0, -40);
        sensor.m_isSensor = true;
        // Adding custom user data to give bucket sensor a name
        sensor.m_userData = "inside";
        // Setting bucket bitmask to check for selective collisions
        bucketBody.setCollisionCategory(2);
        // Setting bucket horizontal velocity
        bucketBody.velocity.x = bucketSpeed;

        shotsText = game.add.text(16, 16, 'Shots: ' + shots, { font: "24px arial", fill: "#fff" });
        statusText = game.add.text(game.world.centerX, game.world.centerY, "", { font: "32px arial", fill: "#ff69b4", align: "center" });
        statusText.anchor.setTo(0.5, 0.5);

    },
    render: function() {
        // This is the debug draw in action
        game.debug.box2dWorld();
    },
    update: function() {
        // This makes the background move along the X axis
        background.tilePosition.x += 0.2;
        // Updating create velocity according to its position
        if (bucketBody.x > 710) {
            bucketBody.velocity.x = -bucketSpeed;
        }
        if (bucketBody.x < 500) {
            bucketBody.velocity.x = bucketSpeed;
        }
        if (movingWall.y > 155) {
            movingWall.velocity.y = -wallSpeed;
        }
        if (movingWall.y < 70) {
            movingWall.velocity.y = wallSpeed;
        }
        // if (shots === 0) {
        //   // game.state.start("Over");
        //   // alert("Game over!");
        //   statusText.text = "Game Over, Man!";
        //   // game.destroy();
        //   console.log("You failed!");
        //   shotActive = true;
        //   sound = game.add.audio("gameover");
        //   // sound.play();
        // }
    }
};

// This function will place the ball2
function placeball2(e) {
  if (!shotActive) {
    // We place a new ball2 only if we are inside launch rectangle
    if (launchRectangle.contains(e.x, e.y)) {
        // Adding ball2 sprite
        ball2 = game.add.sprite(e.x, e.y, "ball2");
        // Enabling physics to ball2 sprite
        game.physics.box2d.enable(ball2);
        // Temporarily set ball2 gravity to zero, so it won't fall down
        ball2.body.gravityScale = 0;
        // Telling Box2D we are dealing with a circle shape
        ball2.body.setCircle(ball2.width / 2);
        ball2.body.restitution = 0.8;
        // Removing onDown listener
        game.input.onDown.remove(placeball2);
        // When the player ends the input call launchball2 function
        game.input.onUp.add(launchball2);
        // When the player moves the input call chargeball2
        game.input.addMoveCallback(chargeball2);
    }
  }
}

// This function will allow the player to charge the ball2 before the launch, and it's the core of the example
function chargeball2(pointer, x, y, down) {
    // We do not allow multitouch, so we are only handling pointer which id is zero
    if (pointer.id === 0) {
        // Clearing trajectory graphics, setting its line style and move the pen on ball2 position
        trajectoryGraphics2.clear();
        trajectoryGraphics2.lineStyle(3, 0x00ff00);
        trajectoryGraphics2.moveTo(ball2.x, ball2.y);
        // Now we have two options: the pointer is inside the launch rectangle...
        if (launchRectangle.contains(x, y)) {
            // ... and in this case we simply draw a line to pointer position
            trajectoryGraphics2.lineTo(x, y);
            launchVelocity2.x = ball2.x - x;
            launchVelocity2.y = ball2.y - y;
        }
        // ... but the pointer can also be OUTSIDE launch rectangle
        else {
            // ... in this case we have to check for the intersection between launch line and launch rectangle
            var intersection = lineIntersectsRectangle(new Phaser.Line(x, y, ball2.x, ball2.y), launchRectangle);
            trajectoryGraphics2.lineTo(intersection.x, intersection.y);
            launchVelocity2.x = ball2.x - intersection.x;
            launchVelocity2.y = ball2.y - intersection.y;
        }
        // Now it's time to draw the predictive trajectory
        trajectoryGraphics2.lineStyle(1, 0x00ff00);
        launchVelocity2.multiply(forceMult, forceMult);
        for (var i = 0; i < 60; i += 5) {
            var trajectoryPoint2 = gettrajectoryPoint22(ball2.x, ball2.y, launchVelocity2.x, launchVelocity2.y, i);
            trajectoryGraphics2.moveTo(trajectoryPoint2.x - 3, trajectoryPoint2.y - 3);
            trajectoryGraphics2.lineTo(trajectoryPoint2.x + 3, trajectoryPoint2.y + 3);
            trajectoryGraphics2.moveTo(trajectoryPoint2.x - 3, trajectoryPoint2.y + 3);
            trajectoryGraphics2.lineTo(trajectoryPoint2.x + 3, trajectoryPoint2.y - 3);
        }
    }
}

// Function to launch the ball2
function launchball2() {
    // Sets the amount of bounces allowed before the ball is terminated
    bounces2 = 6;
    // Adjusting callbacks
    game.input.deleteMoveCallback(0);
    game.input.onUp.remove(launchball2);
    game.input.onDown.add(placeball2);
    // Setting ball2 velocity
    ball2.body.velocity.x = launchVelocity2.x;
    ball2.body.velocity.y = launchVelocity2.y;
    // Applying the gravity to the ball2
    ball2.body.gravityScale = 1;
    // ball2 collision listener callback
    ball2.body.setCategoryContactCallback(2, ball2HitsBucket);
    // Adds lives to bouncing
    ball2.body.setCategoryContactCallback(1, hitCollision2);
    shotActive = true;
}

// Adds lives to bouncing
function hitCollision2(body1, body2, fixture1, fixture2, begin) {


  if (!begin) {
    return;
  }
      bounces2--;
       console.log("bounces left: " + bounces2);

   if (bounces2 < 1) {
      body1.sprite.destroy();

      shotActive = false;
      shots--;

      shotsText.text = 'Shots: ' + shots;

      var num = getRandomInt(1,3);
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
      // sound.play();
      if (shots === 0) {
        sound = game.add.audio("gameover");
        sound.play();
        statusText.text = "Game Over, Man!";
        shotActive = true;
        console.log("Game Over, Man!");
      }

   }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to be executed when the ball2 hits the bucket
function ball2HitsBucket(body1, body2, fixture1, fixture2, begin) {
    // Body1 is the ship because it's the body that owns the callback
    // Body2 is the body it impacted with, in this case the enemy
    // Fixture1 is the fixture of body1 that was touched
    // Fixture2 is the fixture of body2 that was touched

    // We only want this to happen when the hit begins
    if(begin){
         // if the ball2 hits the sensor inside...
         if(fixture2.m_userData == "inside"){
          // setting restitution to zero to prevent the ball2 to jump off the box, but it's just a "hey I got the collision" test
          body1.restitution = 0;
          // now the ball2 looks for a contact category which does not exist, so we won't trigger anymore the contact with the sensor
          body1.setCategoryContactCallback(4, ball2HitsBucket);
          console.log("Level completed!");
          bounces2 = 200;
          statusText.text = "Yeah baby, Yeah!";
          shotActive = true;
          sound = game.add.audio("yeahbaby");
          sound.play();
         }

         if (fixture2.m_userData == "die") {
             body2.sprite.destroy();
            //  sound = game.add.audio("lucky");
            //  sound.play();
         }
    }
}

// Function to check for intersection between a segment and a rectangle
function lineIntersectsRectangle(l, r) {
    return l.intersects(new Phaser.Line(r.left, r.top, r.right, r.top), true) ||
        l.intersects(new Phaser.Line(r.left, r.bottom, r.right, r.bottom), true) ||
        l.intersects(new Phaser.Line(r.left, r.top, r.left, r.bottom), true) ||
        l.intersects(new Phaser.Line(r.right, r.top, r.right, r.bottom), true);
}

// Function to calculate the trajectory point taken from http://phaser.io/examples/v2/box2d/projected-trajectory
function gettrajectoryPoint22(startX, startY, velocityX, velocityY, n) {
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
