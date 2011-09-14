/**
 * Author: Vesa "VesQ" Laakso
 */

var canvas = $("#maincanvas")[0];
var ctx = canvas.getContext("2d");


// Lataa spritet, yksittäinen kuva on 16x24
var spriteLoaded = false;
var spriteImg = new Image();
spriteImg.onload = function () {
  spriteLoaded = true;
};
spriteImg.src = "images/running.png";

function drawSprite(o) {
  if( typeof o.sprite == 'undefined' ||
      typeof o.x == 'undefined' ||
      typeof o.y == 'undefined' ||
      typeof o.frame == 'undefined' )
  {
    return false;
  }
  switch( o.sprite ) {
    case "runright":
      break;
    case "runleft":
      break;
    case "jump":
      break;
    case "climb":
      break;
    default:
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

// Välkäytys
function createFlash( key, speed ) {
  this.toggled = false; // Onko väläytys käynnissä
  this.val = 0.0;       // Tämänhetkinen väläytysarvo
  this.mod = 1;         // Mennäänkö tummempaan vai kirkkaampaan.
  this.running = false; // Pyöriikö väläytys
  this.speed = speed;   // Välähdyksen nopeus sekunneissa
  
  flashes[key] = this;
}
var flashes = {};

var render = function() {
  var tmp = Math.round( 64.0 + flashes.maintext.val * 191 );
  ctx.fillStyle = "rgb("+0+","+0+","+0+")";
  ctx.fillRect(0,0,640,480);
  
  // Tekstiä
  ctx.fillStyle = "rgb("+tmp+","+tmp+","+tmp+")";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Hei, maailma!", 32, 32);
  
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
}

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

// Päivitykset
var update = function(delta) {
  if( 32 in keysDown) {
    flashes.maintext.toggled = !flashes.maintext.toggled;
    delete keysDown[32];
  }
  if( 27 in keysDown ) {
    // -- Escape --
    // Pause/resume main interval
    if( mainRunning ) {
      clearInterval( mainInterval );
      mainRunning = false;
    } else {
      mainInterval = setInterval(main, 10);
      mainRunning = true;
    }
  }
}

// Pääsilmukka
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  runFlashes( delta / 1000 );
  render();

  then = now;
};

// Resetointi
var reset = function() {
  for( f in flashes ) {
    var flash = flashes[f];
    flash.toggled = false;
    flash.val = 0.0;
    flash.mod = 1;
    flash.running = false;
  }
}

// Rullati rullaa!
reset();
createFlash( "maintext", 1.0 );
var then = Date.now();
var mainRunning = true;
var mainInterval = setInterval(main, 10); // (melkein) niin nopsaan kuin mahdollista
