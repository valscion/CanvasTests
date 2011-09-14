/**
 * Author: Vesa "VesQ" Laakso
 */

var canvas = $("#maincanvas")[0];
var ctx = canvas.getContext("2d");

// Information about camera
var camera = {
  x : 0,
  y : 0,
  speed : 64
}

// Store information about player
var plr = {
  x : 312,          // -- Player x-coordinate
  y : 228,          // -- Player y-coordinate
  speed : 128,      // Movement, pixels per second
  anim : "stance",  // Current player animation
  frame : 0.0,      // What frame are we currently running in the animation (will be rounded)
  jumping : false,  // Is the player currently mid-air
  climbing : 0      // Is the player currently climbing in ladders. 
                    // 0 = not, 1 = yes, 2 = yes and moves horizontally
}

// Object to fit all sprites in
var sprites = {
  stance : null,
  runright : null,
  runleft : null,
  jumpright : null,
  jumpleft : null,
  climb : null
}
var spritesLoaded = 0;        // Amount of sprites already loaded
var allSpritesLoaded = false; // Are all sprites loaded

// Load the sprites, one part is 16x24
function loadSprites() {
  // Stance
  sprites.stance = new Image();
    sprites.stance.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.stance.src = "images/stance.png";
  
  // Run right
  sprites.runright = new Image();
    sprites.runright.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.runright.src = "images/run_right.png";
  
  // Run left
  sprites.runleft = new Image();
    sprites.runleft.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.runleft.src = "images/run_left.png";
  
  // Jump right
  sprites.jumpright = new Image();
    sprites.jumpright.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.jumpright.src = "images/jump_right.png";
  
  // Jump left
  sprites.jumpleft = new Image();
    sprites.jumpleft.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.jumpleft.src = "images/jump_left.png";
  
  // Climbing
  sprites.climb = new Image();
    sprites.climb.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.climb.src = "images/climb.png";
}

// Draw player
function drawPlayer() {
  // Check whether all sprites are loaded
  if( allSpritesLoaded != true ) {
    return false;
  }
  
  var frame = Math.round( plr.frame );
  switch( plr.anim ) {
    case "runright":
      ctx.drawImage( sprites.runright, frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "runleft":
      ctx.drawImage( sprites.runleft, frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "jump":
      ctx.drawImage( sprites.jump, frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "climb":
      ctx.drawImage( sprites.climb, frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "stance":
      ctx.drawImage( sprites.stance, 0, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    default:
      ctx.drawImage( sprites.stance, 0, 0, 16, 24, plr.x, plr.y, 16, 24 );
      return false;
  }
  return true;
}


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  if( e.keyCode in keysDown ) {
    delete keysDown[e.keyCode];
  }
}, false);

// Creating a new flash and appending it to the flashes-object
function createFlash( key, speed ) {
  this.toggled = false; // Is flash toggled
  this.val = 0.0;       // Current value of the flash (from 0.0 to 1.0)
  this.mod = 1;         // Are we going higher or lower
  this.running = false; // Is the flash running
  this.speed = speed;   // How fast does flash go from 0.0 to 1.0 in seconds
  
  flashes[key] = this;
}
var flashes = {};

var render = function() {
  
  // Clear the screen
  ctx.clearRect(-camera.x,-camera.y,640,480);
  
  // Draw some text
  // ...add some flash
  var tmp = Math.round( 64.0 + flashes.maintext.val * 191 );
  ctx.fillStyle = "rgb("+tmp+","+tmp+","+tmp+")";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Hei, maailma!", 32, 32);
  
  // Draw the dude
  drawPlayer();
  
  
  /* // Draw some debug-info
  ctx.fillStyle = "rgb(128,128,128)";
  ctx.font = "12px Helvetica";
  ctx.textAlign = "right";
  ctx.fillText("flashes.maintext.toggled:", 580, 32 );
  ctx.fillText("flashes.maintext.val:", 580, 46 );
  ctx.fillText("flashes.maintext.mod:", 580, 60 );
  ctx.fillText("flashes.maintext.speed:", 580, 74 );
  
  ctx.textAlign = "left";
  ctx.fillText(flashes.maintext.toggled, 590, 32 );
  ctx.fillText(flashes.maintext.val, 590, 46 );
  ctx.fillText(flashes.maintext.mod, 590, 60 );
  ctx.fillText(flashes.maintext.speed, 590, 74 );
  */
}

// Update all flashes
var runFlashes = function(delta) {
  for( f in flashes ) {
    var flash = flashes[f];
    if( flash.toggled ) {
      flash.running = true;
      flash.val = flash.val + delta * flash.mod * flash.speed;
      if( flash.val > 1.0 ) { flash.val = 1.0; flash.mod = -1; }
      if( flash.val < 0.0 ) { flash.val = 0.0; flash.mod = 1; }
    } else if( flash.running ) {
      flash.mod = 1;
      flash.val = flash.val - delta * flash.speed;
      if( flash.val < 0.0 ) {
        flash.val = 0.0;
        flash.running = false;
      }
    } else {
      flash.val = 0.0;
    }
  }
}

// Update keys
var update = function( modifier ) {
  if( 19 in keysDown ) {
    // -- Pause/break --
    // Emergency stop. Need to refresh page to start the script again.
    clearInterval( mainInterval );
  }
  if( 32 in keysDown) {
    // -- Return --
    // Toggle maintext flash
    flashes.maintext.toggled = !flashes.maintext.toggled;
    delete keysDown[32];
  }
  
  // Running can only happen when player isn't climbing
  if ( plr.climbing == 0 ) {
    // Controlling left/right movement
    if (37 in keysDown) {
      // -- Left arrow --
      plr.x -= plr.speed * modifier;
      plr.anim = "runleft";
      plr.frame += plr.speed * modifier / 8;
    } else if (39 in keysDown) {
      // -- Right arrow --
      plr.x += plr.speed * modifier;
      plr.anim = "runright";
      plr.frame += plr.speed * modifier / 8;
    } else {
      // If player isn't moving, play stance animation.
      plr.anim = "stance";
      // Also reset running frame.
      plr.frame = 0.0
    }
  } else {
    // If the player is climbing, we may move horizontally, but slower than normal
    
    if (37 in keysDown) {
      // -- Left arrow --
      plr.x -= plr.speed * modifier / 2;
      plr.frame += plr.speed * modifier / 12;
      // We move horizontally
      plr.climbing = 2;
    } else if (39 in keysDown) {
      // -- Right arrow --
      plr.x += plr.speed * modifier / 2;
      plr.frame += plr.speed * modifier / 12;
      // We move horizontally
      plr.climbing = 2;
    } else {
      // We're not moving horizontally
      plr.climbing = 1;
    }
  }
  
  // Controlling climbing ladders
	if (38 in keysDown) {
    // -- Up arrow --
    // Climb down the ladders
		plr.y -= plr.speed/2 * modifier;
    // If we weren't climbing before, reset framecounter
    if ( plr.climbing == 0 ) {
      plr.climbing = 1;
      plr.frame = 0;
      plr.anim = "climb";
    }
    // Only if we don't move horizontally, we animate the character here.
    if ( plr.climbing == 1 ) {
      plr.frame += plr.speed * modifier / 12;
    }
	} else if (40 in keysDown) {
    // -- Down arrow --
		plr.y += plr.speed/2 * modifier;
    if( plr.climbing == 0 ) {
      plr.climbing = 1;
      plr.frame = 0;
      plr.anim = "climb";
    }
    if ( plr.climbing == 2 ) {
      // If we move horizontally, we need to double the animation speed,
      // because player is already running an animation in different direction.
      plr.frame -= plr.speed * modifier / 6;
    } else {
      plr.frame -= plr.speed * modifier / 12;
    }
	}
  
  // Check frame limits
  if( plr.anim == "runleft" || plr.anim == "runright" ) {
    if( plr.frame > 15 ) { plr.frame = 0.0; }
  } else if ( plr.anim == "climb" ) {
    if( plr.frame < 0 ) { plr.frame = 5; }
    else if ( plr.frame > 5.0 ) { plr.frame = 0.0; }
  }
  
  // Move the "camera" with WASD
  camera.x += ( ( 68 in keysDown ) - ( 65 in keysDown ) ) * modifier * camera.speed;
  camera.y += ( ( 83 in keysDown ) - ( 87 in keysDown ) ) * modifier * camera.speed;
  
  // Ugly hack to release climbing animation
  if ( 13 in keysDown ) {
    plr.climbing = false;
  }
  
  // Position the canvas according to camera.x and camera.y
  ctx.restore();
  ctx.save();
  ctx.translate( camera.x, camera.y );
}

// Main loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update( delta / 1000 );
  runFlashes( delta / 1000 );
  render();

  then = now;
};

// Reset
var reset = function() {
  for( f in flashes ) {
    var flash = flashes[f];
    flash.toggled = false;
    flash.val = 0.0;
    flash.mod = 1;
    flash.running = false;
  }
}

// Run it!
loadSprites();
reset();
createFlash( "maintext", 1.0 );
var then = Date.now();
var mainInterval = setInterval(main, 10); // Run (almost) as fast as possible
