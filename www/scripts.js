/**
 * Author: Vesa "VesQ" Laakso
 */

// Information about screen
var scr = {
  w : 640,            // Canvas width
  h : 480,            // --||-- height
  x : 0,              // Calculated when camera is moved
  y : 0,              // --||--
  fullscreen : false, // Is fullscreen mode toggled
  normalw : 0,        // Save normal canvas width
  normalh : 0         // and height when going to fullscr mode
}

// Information about camera
var camera = {
  x : 0,
  y : 0,
  speed : 64,   // Speed of camera when moving it via WASD (in px per sec)
  border : 20   // How far away from the border of the canvas we may go
                // with our player before camera is moved
}

// Store information about player
var plr = {
  x : 0,            // -- Player x-coordinate
  y : 0,            // -- Player y-coordinate
  speed : 196,      // Movement, pixels per second
  w : 16,           // Player width
  h: 24,            // Player height
  anim : "stance",  // Current player animation
  frame : 0.0,      // What frame are we currently running in the animation (will be rounded)
  midair : true,    // Is the player currently mid-air (so that gravity affects them)
  climbing : 0,     // Is the player currently climbing in ladders. 
                    // 0 = not, 1 = yes, 2 = yes and moves horizontally
  safex : 0,        // -- Last player x-coordinate where there was no collision
  safey : 0,        // -- Last player y-coordinate where there was no collision
  weight : 70,      // Player weight in kg
  yPlus : 0,        // Gravity acceleration
  jumpPower : 25000 // Jump power in newtons
}

// Store objects that have gravity.
// Every object that gravity affects must have the following fields:
//  * y:        (float) y-coordinate
//  * yPlus:    (float) current acceleration in the vertical axis
//  * weight:   (float/int) weight in kg
//  * midair:   (boolean) sets the object to be mid-air and receive gravity updates
var gravObj = {
  "player" : plr
}

// Store information about tiles on sides and under the player
var tiles = {
  left : [],
  right : [],
  above : [],
  below : [],
  under : []
}

// Object to fit all sprites in
var sprites = {
  stance : null,
  runright : null,
  runleft : null,
  jumpright : null,
  jumpleft : null,
  climb : null,
  walls : null,
  ladders : null,
  coin : null
}
var spritesLoaded = 0;        // Amount of sprites already loaded
var allSpritesLoaded = false; // Are all sprites loaded

// Object to fit all levels in
var levels = {
  current : 0,
  "1" : {
    dataImg : null,
    tileMap : null,
    w : null,
    h : null
  }
}
var levelsLoaded = 0;
var allLevelsLoaded = false;
var levelsAmount = 1;

// Object for drawing stuff as debug info
var debugObj = {}
var showDebug = true;

// Constant for gravity
const GRAVITY = 800;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = scr.w;
canvas.height = scr.h;
$("#canvascontainer")[0].appendChild(canvas);

// Set an ID for the main canvas
$("#canvascontainer canvas").attr("id", "maincanvas");

// Set canvas' containers width and height
$("#canvascontainer").css( 'width', scr.w );
$("#canvascontainer").css( 'height', scr.h );

// Create temporary canvas for modifying images and such
var tmpCanvas = document.createElement("canvas");
var tmpCtx = tmpCanvas.getContext("2d");

// Setup kinetic 2d
var kinetic = new Kinetic_2d("maincanvas");
kinetic.listen();

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
  
  // Walls
  sprites.walls = new Image();
    sprites.walls.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.walls.src = "images/walls.png";
  
  // Ladders
  sprites.ladders = new Image();
    sprites.ladders.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.ladders.src = "images/ladders.png";
  
  // Coin
  sprites.coin = new Image();
    sprites.coin.onload = function() { 
      if( ++spritesLoaded == Object.keys(sprites).length ) {
        allSpritesLoaded = true;
      }
    }
  sprites.coin.src = "images/coin.png";
}

// Load the levels
function loadLevels() {
  levels["1"].dataImg = new Image();
    levels["1"].dataImg.onload = function() { 
      if( ++levelsLoaded == levelsAmount ) {
        allLevelsLoaded = true;
      }
    }
  levels["1"].dataImg.src = "images/levels/1/data.png";
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
    case "jumpright":
      ctx.drawImage( sprites.runright, 0, 0, 16, 24, plr.x, plr.y, 16, 24 );
      break;
    case "jumpleft":
      ctx.drawImage( sprites.runleft, 0, 0, 16, 24, plr.x, plr.y, 16, 24 );
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
var preventKeyDefaults = true;

$("body").keydown( function (e) {
  keysDown[e.keyCode] = true;
  if( e.keyCode != 122 && preventKeyDefaults ) {
    // Don't prevent fullscr mode
    return false;
  }
  return true;
});

$("body").keyup( function (e) {
  if( e.keyCode in keysDown ) {
    delete keysDown[e.keyCode];
  }
  if( e.keyCode != 122 && preventKeyDefaults ) {
    // Don't prevent fullscr mode
    return false;
  }
  return true;
});

// Handle mouse clicking
var mouseClicked = false;
$("body").click( function(e) {
  e.preventDefault();
  mouseClicked = true;
});

// Creating a new animation timer and appending it to the animTimers-object
function createAnimTimer( key, speed, oscillate ) {
  if( typeof oscillate != 'undefined' && oscillate != false ) {
    oscillate = true;
  } else {
    oscillate = false;
  }

  animTimers[key] = {};
  
  animTimers[key].toggled = false;       // Is timer toggled
  animTimers[key].val = 0.0;             // Current value of the timer (from 0.0 to 1.0)
  animTimers[key].running = false;       // Is the timer running
  animTimers[key].speed = speed;         // How fast does timer go from 0.0 to 1.0 in seconds
  animTimers[key].oscillate = oscillate  // Will the timer start counting down from 1 or jump to 0
  animTimers[key].mod = 1;               // Are we going higher or lower (only used if oscillating)
}
var animTimers = {};

// Render all stuff to screen
function render() {
  
  // Clear the screen
  ctx.clearRect(-camera.x,-camera.y,scr.w,scr.h);
  
  // Draw the level
  drawCurrentLevel();
  
  /* // Draw some text
  // ...add some flash
  var tmp = Math.round( 64.0 + animTimers.maintext.val * 191 );
  ctx.fillStyle = "rgb("+tmp+","+tmp+","+tmp+")";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  var tmp = Math.round( 64.0 + animTimers.maintext.val * 191 );
  ctx.fillText("Hei, maailma!", 0, 0);
  */
  
  // Draw some debug-info
  debugObj["plr.midair"] = plr.midair;
  debugObj["plr.climbing"] = plr.climbing;
  debugObj["plr.x:"] = plr.x;
  debugObj["plr.y:"] = plr.y;
  debugObj["camera.x:"] = camera.x;
  debugObj["camera.y:"] = camera.y;
  var mousePos = kinetic.getMousePos();
  if( mousePos != null ) {
    debugObj["Mouse X:"] = mousePos.x;
    debugObj["Mouse Y:"] = mousePos.y;
  } else {
    debugObj["Mouse X:"] = "No mouseover";
    debugObj["Mouse Y:"] = "No mouseover";
  }
  debugObj["Under tile:"] = getTilesAsString("under");
  debugObj["Left tile:"] = getTilesAsString("left");
  debugObj["Right tile:"] = getTilesAsString("right");
  debugObj["Above tile:"] = getTilesAsString("above");
  debugObj["Below tile:"] = getTilesAsString("below");
  
  drawDebug( scr.x + scr.w-150, scr.y+24 );
  // Draw the dude
  drawPlayer();
}

// Draw debug info
function drawDebug( x, startY ) {
  var tmp = Math.round( 255 - ( animTimers.maintext.val * 128 ) );
  ctx.fillStyle = "rgb("+tmp+","+tmp+",0)";
  ctx.font = "12px Helvetica";
  ctx.textBaseline = "top";
  var i = 0;
  for( o in debugObj ) {
    ctx.textAlign = "right";
    ctx.fillText( o, x, startY + i );
    ctx.textAlign = "left";
    ctx.fillText( debugObj[o], x+10, startY + i );
    i += 14;
  }
  
  // Clear the debug object after drawing
  for( o in debugObj ) {
    delete debugObj[o];
  }
}

// Main update function for doing stuff according to delta-time
function update( modifier ) {
  // Update flashes / animTimers
  for( f in animTimers ) {
    var flash = animTimers[f];
    if( flash.oscillate ) {
      if( flash.toggled ) {
        flash.running = true;
        flash.val = flash.val + modifier * flash.mod * flash.speed;
        if( flash.val > 1.0 ) { flash.val = 1.0; flash.mod = -1; }
        if( flash.val < 0.0 ) { flash.val = 0.0; flash.mod = 1; }
      }
      else if( flash.running ) {
        flash.mod = 1;
        flash.val = flash.val - modifier * flash.speed;
        if( flash.val < 0.0 ) {
          flash.val = 0.0;
          flash.running = false;
        }
      }
      else {
        flash.val = 0.0;
      }
    } else {
      // Much simpler "flash"
      if( flash.toggled ) {
        flash.val = flash.val + modifier * flash.speed;
        if( flash.val > 1.0 ) { flash.val = 0.0; }
      }
    }
  }
  
  if( 32 in keysDown) { // -- Spacebar --
    // Toggle maintext flash
    animTimers.maintext.toggled = !animTimers.maintext.toggled;
    delete keysDown[32];
  }
  
  // Clicking on the canvas sets the player coordinates
  var mousePos = kinetic.getMousePos();
  if( mouseClicked && mousePos !== null ) {
    plr.x = scr.x + mousePos.x;
    plr.y = scr.y + mousePos.y;
    plr.midair = true;
  }
  
  // Check whether we are on anything solid or climbing and if not, we're mid-air.
  if( !( ("wall" in tiles.below) || ("ladders" in tiles.below) || plr.climbing ) ) {
    plr.midair = true;
  }
  
  // Update keys that control player
  updatePlayerControls( modifier );
  
  // Check frame limits
  if( plr.anim == "runleft" || plr.anim == "runright" ) {
    if( plr.frame > 15 ) { plr.frame = 0.0; }
  }
  else if ( plr.anim == "jumpleft" || plr.anim == "jumpright" ) {
    // Jumping animation is done using animTimers
    animTimers.jump.toggled = true;
    plr.frame = animTimers.jump.val * 9;
  }
  else if ( plr.anim == "climb" ) {
    if( plr.frame < 0 ) { plr.frame = 5; }
    else if ( plr.frame > 5.0 ) { plr.frame = 0.0; }
  }
  
  // Check collisions with map
  var hitDirections = checkMapCollisions();
  debugObj["Hit wall"] = false;
  if( Object.keys(hitDirections).length > 0 ) {
    debugObj["Hit wall"] = getObjectAsString( hitDirections );
    if( "below" in hitDirections && plr.yPlus <= 0 ) {
      // If we hit something solid from the bottom, position the player
      // directly above it so that one doesn't just float around.
      plr.y = Math.ceil( plr.y / 24 ) * 24 - 1;
      plr.midair = false;
    }
    else if ( "above" in hitDirections && plr.yPlus > 0 ) {
      // We hit the ceiling so stop going up
      plr.yPlus = 0.0;
    }
  }
  
  // Release climbing-status if the player is not on ladders
  if( !inTile("under", "ladders") ) {
    plr.climbing = 0;
  }
  
  // Move the "camera" with WASD
  camera.x += ( ( 68 in keysDown ) - ( 65 in keysDown ) ) * modifier * camera.speed; // [D] - [A]
  camera.y += ( ( 83 in keysDown ) - ( 87 in keysDown ) ) * modifier * camera.speed; // [S] - [W]
  
  // Move the player arbitrary with IJKL
  if( (73 in keysDown)||(74 in keysDown)||(75 in keysDown)||(76 in keysDown) ) {
    plr.x = plr.safex += ( ( 76 in keysDown ) - ( 74 in keysDown ) ); // [L] - [J]
    plr.y = plr.safey += ( ( 75 in keysDown ) - ( 73 in keysDown ) ); // [K] - [I]
  }
  
  /* // Don't let the player escape outside the screen!
  if ( plr.x + plr.w + camera.x > scr.w - camera.border ) {
    camera.x = scr.w - camera.border - plr.x - plr.w;
  }
  else if ( plr.x + camera.x < camera.border ) {
    camera.x = camera.border - plr.x;
  }
  if ( plr.y + plr.h + camera.y > scr.h - camera.border ) {
    camera.y = scr.h - camera.border - plr.y - plr.h;
  }
  else if ( plr.y + camera.y < camera.border ) {
    camera.y = camera.border - plr.y;
  }
  */
  
  // Glue the camera to the player
  camera.x = scr.w/2 - plr.x;
  camera.y = scr.h/2 - plr.y;
  
  // Camera can't go outside the worlds boundaries. If the world is smaller than
  // the screen, center the camera to the middle of the screen.
  var level = levels[levels.current];
  
  if( scr.w < level.w*16 ) {
    if ( camera.x > 0 ) camera.x = 0;
    if ( camera.x < scr.w - level.w*16 ) camera.x = scr.w - level.w*16;
  }
  else {
    camera.x = scr.w/2 - level.w*8;
  }
  if( scr.h < level.h*24 ) {
    if ( camera.y > 0 ) camera.y = 0;
    if ( camera.y < scr.h - level.h*24 ) camera.y = scr.h - level.h*24;
  }
  else {
    camera.y = scr.h/2 - level.h*12;
  }
  
  // Ugly hack to release climbing animation
  if ( 13 in keysDown ) {
    plr.climbing = false;
  }
  
  // If we want to change the canvas width or height, modify these variables below.
  var newWidth = scr.w;
  var newHeight = scr.h;
  
  /*  // Modify canvas width and height with IJKL
  newWidth  += ( ( 76 in keysDown ) - ( 74 in keysDown ) ); // [L] - [J]
  newHeight += ( ( 75 in keysDown ) - ( 73 in keysDown ) ); // [K] - [I]
  */
  
  // Also check whether we pressed F11. If so, toggle fullscreen!
  if( 122 in keysDown ) {
    delete keysDown[122];
    scr.fullscreen = !scr.fullscreen;
    // Did we just toggle it ON?
    if ( scr.fullscreen ) {
      // Save old dimensions
      scr.normalw = scr.w;
      scr.normalh = scr.h;
   
      newWidth = screen.width;
      newHeight = screen.height;
      
      // Pop the canvas out of the normal flow
      $("#canvascontainer").css({
        'border': '0',
        'margin' : '0',
        'position' : 'absolute',
        'left' : '0',
        'top' : '0',
        'background-color': 'black'
      });
    }
    else {
      // Reset old dimensions
      newWidth = scr.normalw;
      newHeight = scr.normalh;
      
      // Pop the canvas back to its normal position.
      $("#canvascontainer").css({
        'border': '1px solid #777',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '20px',
        'position': 'static',
        'left' : 'auto',
        'top' : 'auto',
        'background-color': 'transparent'
      });
    }
  }
  // Wait for the browser to be in fullscreen before resizing canvas
  if( scr.fullscreen ) {
    var waitStart = Date.now();
    while( screen.availWidth < 1 || screen.availHeight < 1 ) {
      // Wait for max. 2,5s and then forget fullscreen
      if( Date.now() - waitStart > 2500 ) {
        scr.fullscreen = false;
        
        // Reset old dimensions
        newWidth = scr.normalw;
        newHeight = scr.normalh;
      
        // Pop the canvas back to its normal position.
        $("canvas").css('position','static');
        
        alert("fail");
        
        break;
      }
    }
    if ( scr.fullScreen ) {
      // If the while-loop waited successfully, set new dimensions.
      newWidth = screen.width;
      newHeight = screen.height;
    }
  }
  
  if ( newWidth != scr.w ) {
    scr.w = newWidth;
    $("#canvascontainer").width( scr.w );
    canvas.width = scr.w;
  }
  if ( newHeight != scr.h ) {
    scr.h = newHeight;
    $("#canvascontainer").height( scr.h );
    canvas.height = scr.h;
  }

  // Position the canvas according to camera.x and camera.y
  ctx.restore();
  ctx.save();
  ctx.translate( Math.round( camera.x ), Math.round( camera.y ) );
  
  // Calcute screen coordinates, so we can glue stuff to it.
  scr.x = -Math.round( camera.x );
  scr.y = -Math.round( camera.y );
}

// Update keys that control player
function updatePlayerControls( modifier ) {
  
  var xMove = 0;
  var yMove = 0;
  
  // Running can only happen when player isn't climbing
  if ( plr.climbing == 0 ) {
    // Controlling left/right movement
    if (37 in keysDown) { // -- Left arrow --
      xMove -= plr.speed * modifier;
      // Only play animation if we are not mid-air
      if( !plr.midair ) {
        plr.anim = "runleft";
        plr.frame += plr.speed * modifier / 8;
      }
      else {
        plr.anim = "jumpleft"
      }
    }
    else if (39 in keysDown) { // -- Right arrow --
      xMove += plr.speed * modifier;
      if( !plr.midair ) {
        plr.anim = "runright";
        plr.frame += plr.speed * modifier / 8;
      }
      else {
        plr.anim = "jumpright"
      }
    }
    else if ( !plr.midair ) {
      // If player isn't moving nor mid-air, play stance animation.
      plr.anim = "stance";
      // Also reset running frame.
      plr.frame = 0.0
    }
  }
  else {
    // If the player is climbing, we may move horizontally, but slower than normal
    // If we move horizontally to a place where there's no ladders, unclimb.
    
    if (37 in keysDown) { // -- Left arrow --
      if( !(("ladders" in tiles.left) || ("wall" in tiles.left)) ) {
        if( !((38 in keysDown) || (40 in keysDown)) ) {
          // We release our grip from the ladders if there's no ladders or wall to the left
          // of the player nor are we pressing up/down arrow keys.
          plr.climbing = 0;
          plr.midair = true;
          plr.anim = "jumpleft"
          plr.frame = 0.0;
        }
      }
      else {
        // We move horizontally on the ladders
        xMove -= plr.speed * modifier / 2;
        plr.climbing = true;
      }
    }
    else if (39 in keysDown) { // -- Right arrow --
      if( !(("ladders" in tiles.right) || ("wall" in tiles.right)) ) {
        if( !((38 in keysDown) || (40 in keysDown)) ) {
          // We release our grip from the ladders if there's no ladders or wall to the right
          // of the player nor are we pressing up/down arrow keys.
          plr.climbing = false;
          plr.midair = true;
          plr.anim = "jumpright"
          plr.frame = 0.0;
        }
      }
      else {
        // We move horizontally on the ladders
        xMove += plr.speed * modifier / 2;
        plr.climbing = true;
      }
    }
  }
  
  // Controlling climbing ladders
  if (38 in keysDown) { // -- Up arrow --
    // Climb down the ladders
    
    // If we weren't climbing before, check are we under ladders
    // and if so, reset framecounter and set player climbing.
    if ( !plr.climbing ) {
      if ( "ladders" in tiles.under ) {
        // Center the player to the ladders horizontally
        if ( tiles.under.ladders & 1 ) {
          // Ceil X, CX
          plr.x = Math.ceil( plr.x / 16 ) * 16;
          xMove = 0;
        }
        else if ( tiles.under.ladders & 2 ) {
          // Floor X, FX
          plr.x = Math.floor( plr.x / 16 ) * 16;
          xMove = 0;
        }
        plr.climbing = true;
        plr.frame = 0;
        plr.anim = "climb";
      }
    }
    
    if ( plr.climbing ) {
      // Animate the player
      plr.frame += plr.speed * modifier / 12;
      yMove -= plr.speed/2 * modifier;
    }
  } 
  else if (40 in keysDown) { // -- Down arrow --
    if( !plr.climbing ) {
      if ( "ladders" in tiles.under || "ladders" in tiles.below ) {
        // Center the player to the ladders horizontally
        var tileObj = null;
        if( "ladders" in tiles.below ) tileObj = tiles.below;
        else tileObj = tiles.under;
        if ( tileObj.ladders & 1 ) {
          // Ceil X, CX
          plr.x = Math.ceil( plr.x / 16 ) * 16;
          xMove = 0;
        }
        else if ( tileObj.ladders & 2 ) {
          // Floor X, FX
          plr.x = Math.floor( plr.x / 16 ) * 16;
          xMove = 0;
        }
        plr.climbing = true;
        plr.frame = 0;
        plr.anim = "climb";
      }
    }
    if ( plr.climbing ) {
      plr.frame -= plr.speed * modifier / 12;
      yMove += plr.speed/2 * modifier;
    }
  }
  
  plr.x += xMove;
  plr.y += yMove;
  
  // If we are climbing, we are not midair.
  if( plr.climbing ) plr.midair = false;
  
  // JUMP
  if( 90 in keysDown ) { // [Z]
    if( !plr.midair && plr.climbing == 0 ) {
      plr.yPlus = plr.jumpPower / plr.weight;
      plr.midair = true;
      // Decide what animation to play
      if( 37 in keysDown ) { // -- Left arrow --
        plr.anim = "jumpleft";
      }
      else if( 39 in keysDown ) { // -- Right arrow --
        plr.anim = "jumpright";
      }
      else {
        // If we're not moving anywhere, play something else than "stance" animation.
        plr.anim = "jumpleft";
      }
    }
  }
}

// Update collisions with map
function checkMapCollisions() {
  if ( !allLevelsLoaded ) {
    return {};
  }
  
  var tileMap = levels[levels.current].tileMap;
  
  var hitDirections = {};
  
  try {
    var checkTile = tileMap[Math.round((plr.x + (plr.w-1)/2) / 16 )][Math.round((plr.y + plr.h/2) / 24 )];
    if( typeof checkTile === 'undefined' || checkTile == "wall" ) {
      // We are hitting a wall from below and right
      if( "wall" in tiles.below ) hitDirections["below"] = true;
      if( "wall" in tiles.right ) hitDirections["right"] = true;
    }
    checkTile = tileMap[Math.round((plr.x + (plr.w-1)/2) / 16 )][Math.round((plr.y - plr.h/2) / 24 )];
    if( typeof checkTile === 'undefined' || checkTile == "wall" ) {
      // We are hitting a wall from above and right
      if( "wall" in tiles.above ) hitDirections["above"] = true;
      if( "wall" in tiles.right ) hitDirections["right"] = true;
    }
    checkTile = tileMap[Math.round((plr.x - (plr.w-1)/2) / 16 )][Math.round((plr.y + plr.h/2) / 24 )];
    if( typeof checkTile === 'undefined' || checkTile == "wall" ) {
      // We are hitting a wall from below and left
      if( "wall" in tiles.below ) hitDirections["below"] = true;
      if( "wall" in tiles.left ) hitDirections["left"] = true;
    }
    checkTile = tileMap[Math.round((plr.x - (plr.w-1)/2) / 16 )][Math.round((plr.y - plr.h/2) / 24 )];
    if( typeof checkTile === 'undefined' || checkTile == "wall" ) {
      // We are hitting a wall from above and left
      if( "wall" in tiles.above ) hitDirections["above"] = true;
      if( "wall" in tiles.left ) hitDirections["left"] = true;
    }
  }
  catch(e) {
    // Probably the tileMaps x-coordinate was malformed. Let's just set
    // all directions as if we had hit them.
    hitDirections["below"] = true;
    hitDirections["above"] = true;
    hitDirections["left"] = true;
    hitDirections["right"] = true;
  }
    
  // Only restrict player's horizontal movement if there's collisions on sides
  if( "left" in hitDirections || "right" in hitDirections ) {
    plr.x = plr.safex;
  }
  else {
    plr.safex = plr.x;
  }
  
  // Only restrict player's vertical movement if there's collisions on above/below
  if( "above" in hitDirections && plr.y < plr.safey ) {
    plr.y = plr.safey;
  }
  else if( "below" in hitDirections && plr.y > plr.safey ) {
    plr.y = plr.safey;
  }
  else {
    plr.safey = plr.y;
  }
  
  return hitDirections;
}

// Update gravity on objects that have gravity
function updateGravity( modifier ) {
  for( o in gravObj ) {
    var obj = gravObj[o];
    if( obj.midair ) {
      obj.yPlus -= GRAVITY * modifier;
      obj.y -= obj.yPlus * modifier;
    }
    else {
      obj.yPlus = 0;
    }
  }
}

// Load a level and set it as the current one
function playLevel( level ) {
  if( allLevelsLoaded == false ) { return false; }
  var lvl = null;
  switch( level ) {
    case 1:
    case "1":
      levels.current = 1;
      lvl = "1";
      break;
    default:
      return false;
  }
  
  if( levels[lvl].tileMap != null ) {
    return true;
  }
  
  // ------------------------
  // Parse level img
  // ------------------------
  
  var width = levels[lvl].dataImg.width;
  var height = levels[lvl].dataImg.height;
  
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  
  tmpCtx.drawImage( levels[lvl].dataImg, 0, 0 );
  
  var imageData = tmpCtx.getImageData( 0, 0, width, height );
  var data = imageData.data;
  
  var tileMap = new Array( width );
  for( var i=0; i<width; ++i ) {
    tileMap[i] = new Array( height );
  }
  
  var x = 0;
  var y = 0;
  for (var i = 0, n = data.length; i < n; i += 4) {
    tileMap[x][y] = tileType( data[i], data[i+1], data[i+2], data[i+3] );
    
    // If that was the startpoint, set player coordinates.
    if( tileMap[x][y] == "start" ) {
      plr.x = x*16 + plr.w/2;
      plr.y = y*24;
    }
    
    ++x;
    if( x >= width ) {
      x = 0;
      ++y;
    }
  }
  
  levels[lvl].tileMap = tileMap;
  levels[lvl].w = width;
  levels[lvl].h = height;
  
  animTimers["coins"].toggled = true;
  animTimers["coins"].val = 0.0;
  return true;
}

// Draw the current level
function drawCurrentLevel( ) {
  if ( levels.current < 1 ) { 
    return false;
  }
  var level = levels[levels.current];
  var tileMap = level.tileMap;
  
  var coinFrame = Math.round( animTimers["coins"].val * 5 );
  
  // Limit those loops to draw only those tiles that are visible
  
  var x = Math.floor( scr.x / 16 ); if( x < 0 ) x = 0;
  var y = Math.floor( scr.y / 24 ); if( y < 0 ) y = 0;
  var nx = Math.ceil( ( scr.x + scr.w ) / 16 ); if( nx > level.w ) nx = level.w;
  var ny = Math.ceil( ( scr.y + scr.h ) / 24 ); if( ny > level.h ) ny = level.h;
  
  //var x = 0, y = 0, nx = level.w, ny = level.h;
  while(x < nx ) {
    while( y < ny ) {
      if( tileMap[x][y] == "wall" ) {
        ctx.drawImage( sprites.walls, 0, 0, 16, 24, x*16, y*24, 16, 24 );
      }
      else if( tileMap[x][y] == "ladders" ) {
        ctx.drawImage( sprites.ladders, 0, 0, 16, 24, x*16, y*24, 16, 24 );
      }
      else if( tileMap[x][y] == "coin" ) {
        ctx.drawImage( sprites.coin, coinFrame*16, 0, 16, 24, x*16, y*24, 16, 24 );
      }
      ++y;
    }
    ++x;
    y = 0;
  }
}

// Get tile type based on the RGBa value of a pixel
function tileType( r, g, b, a ) {
  if( a == 0 ) { // Nothing
    return "";
  }
  
  if( r == 0 && g == 0 && b == 0 ) { // Wall
    return "wall";
  }
  
  if( r == 0 && g == 255 && b == 0 ) { // Ladders
    return "ladders";
  }
  
  if( r == 0 && g == 0 && b == 255 ) { // Coin
    return "coin";
  }
  
  if( r == 255 && g == 0 && b == 0 ) { // Start point
    return "start";
  }
  
  if( r == 128 && g == 128 && b == 128 ) { // Crumbling wall
    // return "crumblingwall";
    return "wall";
  }
  
  return "";
}

// Update nearby tiles and set the info to tiles-object
function updateNearbyTiles() {
  if ( !allLevelsLoaded ) {
    return "";
  }
  var tileMap = levels[levels.current].tileMap;
  var tileX = Math.round( ( plr.x ) / 16 );
  var tileCeilX = Math.ceil( ( plr.x-1 ) / 16 );
  var tileFloorX = Math.floor( ( plr.x+1 ) / 16 );
  var tileY = Math.round( ( plr.y ) / 24 );
  var tileCeilY = Math.ceil( ( plr.y-1 ) / 24 );
  var tileFloorY = Math.floor( ( plr.y+1 ) / 24 );
  
  /*
  debugObj["tileX"] = tileX;
  debugObj["tileCeilX"] = tileCeilX;
  debugObj["tileFloorX"] = tileFloorX;
  debugObj["tileY"] = tileY;
  debugObj["tileCeilY"] = tileCeilY;
  debugObj["tileFloorY"] = tileFloorY;
  */
  
  // Reset tiles
  tiles.under = {};
  tiles.left = {};
  tiles.right = {};
  tiles.above = {};
  tiles.below = {};
  
  tiles.under[tileMap[tileCeilX][tileY]] |= 1;
  tiles.under[tileMap[tileFloorX][tileY]] |= 2;
  tiles.under[tileMap[tileX][tileCeilY]] |= 4;
  tiles.under[tileMap[tileX][tileFloorY]] |= 8;
  
  if( tileX > 0 ) {
    tiles.left[tileMap[tileX-1][tileCeilY]] |= 4;
    tiles.left[tileMap[tileX-1][tileFloorY]] |= 8;
  } else {
    tiles.left["wall"] |= 4;
    tiles.left["wall"] |= 8;
  }
  
  if( tileX < levels[levels.current].w ) {
    tiles.right[tileMap[tileX+1][tileCeilY]] |= 4;
    tiles.right[tileMap[tileX+1][tileFloorY]] |= 8;
  } else {
    tiles.right["wall"] |= 4;
    tiles.right["wall"] |= 8;
  }
  
  if( tileY > 0 ) {
    tiles.above[tileMap[tileCeilX][tileY-1]] |= 1;
    tiles.above[tileMap[tileFloorX][tileY-1]] |= 2;
  } else {
    tiles.above["wall"] |= 1;
    tiles.above["wall"] |= 2;
  }
  
  if( tileCeilY < levels[levels.current].h ) {
    tiles.below[tileMap[tileCeilX][tileY+1]] |= 1;
    tiles.below[tileMap[tileFloorX][tileY+1]] |= 2;
  } else {
    tiles.below["wall"] |= 1;
    tiles.below["wall"] |= 2;
  }
}

// Check if a specific tile is in a specific direction
// Example: check if there's ladders below the player:
//    inTile( "below", "ladders" );
function inTile( direction, tileType ) {
  var arr = null;
  switch( direction ) {
    case "under":
      arr = tiles.under;
      break;
    case "left":
      arr = tiles.left;
      break;
    case "right":
      arr = tiles.right;
      break;
    case "above":
      arr = tiles.above;
      break;
    case "below":
      arr = tiles.below;
      break;
    default:
      return false;
  }
  
  return ( tileType in arr );
}

// Returns the tiles in certain direction as a string. Useful for debugging.
function getTilesAsString( direction ) {
  var ret = "";
  for( o in tiles[direction] ) {
    if( o != "" ) {
      var pos = "";
      var bitmask = tiles[direction][o];
      if( bitmask & 1 ) pos += "CX";
      if( bitmask & 2 ) pos += "FX";
      if( bitmask & 4 ) pos += "CY";
      if( bitmask & 8 ) pos += "FY";
      
      ret += pos + ":" + o;
    }
  }
  return ret;
}

// Gets any objects prop+values as a string
function getObjectAsString( obj ) {
  var ret = "";
  for( o in obj ) {
    ret += o+":" + obj[o] + " ";
  }
  return ret;
}

// Reset
function reset() {
  for( f in animTimers ) {
    var flash = animTimers[f];
    flash.toggled = false;
    flash.val = 0.0;
    flash.mod = 1;
    flash.running = false;
  }
  
  // Put the dude in the middle of the screen
  plr.x = ( scr.w - plr.w ) / 2 + scr.x;
  plr.y = ( scr.h - plr.h ) / 2 + scr.y;
}

// Main loop
var forceExit = false;
var main = function () {
  if( 19 in keysDown || forceExit == true ) { // -- Pause/break --
    // Emergency stop. Need to refresh page to start the script again.
    // Disable key-prevention, too.
    preventKeyDefaults = false;
    clearInterval( mainInterval );
  }

  var now = Date.now();
  var delta = now - then;

  if( levels.current != 1 ) {
    playLevel( 1 );
  } else {
    updateNearbyTiles();
    update( delta / 1000 );
    updateGravity( delta / 1000 );
    render();
  }
  
  mouseClicked = false;
  then = now;
};

// Run it!
loadSprites();
loadLevels();
reset();
createAnimTimer( "maintext", 1.0, true );
createAnimTimer( "coins", 1.0 );
createAnimTimer( "jump", 1.0 );
var then = Date.now();
var mainInterval = setInterval(main, 10); // Run (almost) as fast as possible
