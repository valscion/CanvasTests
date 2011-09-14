/**
 * Author: Vesa "VesQ" Laakso
 */

var canvas = $("#maincanvas")[0];
var ctx = canvas.getContext("2d");

// Store information about player
var plr = {
  anim : "stance",
  x : 100,
  y : 100,
  frame : 0,
  jumping : false
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


function drawPlayer() {
  // Check whether all sprites are loaded
  if( allSpritesLoaded != true ) {
    return false;
  }
  
  switch( plr.sprite ) {
    case "runright":
      ctx.drawImage( sprites.runright, plr.frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "runleft":
      ctx.drawImage( sprites.runleft, plr.frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "jump":
      ctx.drawImage( sprites.jump, plr.frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "climb":
      ctx.drawImage( sprites.climb, plr.frame*16, 0, 16, 24, plr.x, plr.y, 16, 24 );
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
  ctx.clearRect(0,0,640,480);
  
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
var update = function() {
  if( 32 in keysDown) {
    // -- Return --
    // Toggle maintext flash
    flashes.maintext.toggled = !flashes.maintext.toggled;
    delete keysDown[32];
  }
  if( 19 in keysDown ) {
    // -- Pause/break --
    // Emergency stop. Need to refresh page to start the script again.
    clearInterval( mainInterval );
  }
}

// Main loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update();
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
