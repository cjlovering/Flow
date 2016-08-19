//react
var React = require('react');
var $     = require('jquery'); //installed with node
var PlayConstants = require('./../flux/constants/PlayConstants');

/** script variables
 * @var {object} canvas, ctx: the canvas and context objects; what we draw on
 * @var {number} resizeId: an id that keeps track of timeout functions
 * @var {number} dropletNumber: the number of desired droplets
 * @var {object} droplets: an array of Droplets
 */
var canvas, ctx;
var resizeId;
var droplets = [];


var settings = {
  dropletNumber: 100,
  gravityOnWater: 0.02,
  bounceRadius: 100,
  slide: false,
  showRadius: true,
  play: true,
  clear: true
}

/** canvas attributes
 *  these are kept up to-date, and used rather than canvas.attribute in order to
 *  avoid re-flows.
 */
var canvasWidth, canvasHeight;

/**
 * These are tendencies the particles will use to simulate desired behavior
 */

var target;

var util = {
  rand: function (number){
    return (Math.random() * number + 1);
  },
  direction: function(){
    return Math.random() * 2 > 1 ? 1 : -1;
  },
  max: function(x,y){
    return x>y ? x : y;
  },
  maxAbs: function(x,y){
    return Math.abs(x)>Math.abs(y) ? x : y;
  },
  square: function(x){
    return x * x;
  },
  pyth: function(x1, y1, x2, y2){
    return (Math.sqrt( this.square(x1 - x2) + this.square(y1 - y2)));
  },
  sign: function(x) { return x ? x < 0 ? -1 : 1 : 0; }
}


function shakeDroplets(){
  for (var i = 0; i < droplets.length; i++) droplets[i].Shake();
}
function gravityChangeDroplets(){
  for (var i = 0; i < droplets.length; i++) droplets[i].GravityChanged();
}

/**
 * class of Droplets which will be the units of the water
 * @attribute {number} x: the x location in pixels
 * @attribute {number} y: the y location in pixels
 * @attribute {number} vx: the current velocity in the x direction
 * @attribute {number} vy: the current velocity in the y direction
 * @attribute {number} internalVx: the velocity in the x direction - internal random value
 * @attribute {number} internalVy: the velocity in the y direction - internal random value
 * @attribute {number} r: the radius of the droplet (this may be a global constant)
 */
function Droplet(i){
    this.gy = util.max(0.01, settings.gravityOnWater * util.rand(10));
    this.x = util.rand(canvasWidth);
    this.y = util.rand(canvasHeight);
    this.xx = this.x;
    this.yy = this.y;
    this.vx = util.direction() * util.rand(3);
    this.vy = util.direction() * util.rand(3);
    this.internalVx = 0;//direction() * rand(2); <-- consider this
    this.internalVy = 0;//direction() * rand(2);
    this.r = 3; //base it no neighbors??
    this.up = this.vy > 0;

    this.distanceApart = function(xxx, yyy){
      return (Math.sqrt( util.square(xxx - this.x) + util.square(yyy - this.y) ));
    }

    this.GravityChanged = function(){
      this.gy = util.max(0.01, settings.gravityOnWater * util.rand(10));
    }

    this.Shake = function(){
      this.vx = util.direction() * util.rand(5);
      this.vy = util.direction() * util.rand(25);
    }

    this.Draw   = function() {
      ctx = canvas.getContext('2d');
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(Math.floor(this.x), Math.floor(this.y), this.r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
     };

    this.Exist = function() {

    //wall collision
     if (this.x <= 0) {
       this.x = 1;
       this.vx = (-1 * this.vx);// % 1) * Math.abs(direction() * rand(3));
       this.internalVy = 0;
       this.internalVx = 0;
       this.up = false;
     }
     if (this.x >= canvasWidth) {
       this.x = canvasWidth - 1;
       this.vx = (-1 * this.vx);// % 1) * Math.abs(direction() * rand(3));
       this.internalVy = 0;
       this.internalVx = 0;
       this.up = false;
     }
     if (this.y <= 0) {
       this.y = 1;
       this.vy = (-1 * this.vy);
       this.internalVy = 0;
       this.internalVx = 0;
       this.up = false;
     }
     if (this.y >= canvasHeight) {
       this.y = canvasHeight - 1;
       this.vy = (-1 * this.vy);
       this.internalVy = 0;
       this.internalVx = 0;
       this.up = false;
     }

      //gravity on vy
      this.vy += util.max(Math.abs(this.vy) * this.gy, this.gy);

      //move
      this.xx = this.x;
      this.yy = this.y;
      this.x += (this.vx + this.internalVx);
      this.y += (this.vy + this.internalVy);



      var distBox = util.square(target.x - this.x) + util.square(target.y - this.y);
      if( distBox < util.square(settings.bounceRadius) ){
        var dist = Math.sqrt(distBox);
        var xDif = this.x - target.x;
        var yDif = this.y - target.y

        var k = settings.bounceRadius / dist;
        this.x += k * xDif - xDif;
        this.y += k * yDif - yDif;

        //var temp = this.vx;
        //this.vx = 0; //this.vy; //sign(xDif);//xDif > yDif ? -1 : 1; //xDif>0?-1:1;
        //this.vy = 0; //this.vx; // sign(yDif);//yDif > xDif ? -1 : 1; //(yDif*10%-1);

        //instead of dist, use squares of numbers

        // var twiceProjFactor =   (this.x*this.vx
        //                        + this.y*this.vy)/(settings.bounceRadius * settings.bounceRadius);
        // var vvx = this.vx - twiceProjFactor*this.x;
        // var vvy = this.vy - twiceProjFactor*this.y;
        // this.vx = vvy;
        // this.vy = vvx;

        // twiceProjFactor = 2*(exitX*p.velX
        //                    + exitY*p.velY)/boundaryRadSquare;
        // vx = p.velX - twiceProjFactor*exitX;
        // vy = p.velY - twiceProjFactor*exitY;
        // p.velX = vx;
        // p.velY = vy;


        if (settings.slide) {
          this.up = true;
          this.internalVx = util.maxAbs((util.sign(xDif)) * 10, this.vx * (util.sign(xDif)));
          this.internalVy = util.maxAbs((util.sign(yDif)) * 10, this.vy * (util.sign(yDif)));
        } else {
          this.vx = 0;
          this.vy = 0;
        }
      }

      if (this.up) {
        this.internalVx = util.maxAbs(0.01, this.internalVx - .01 * (util.sign(this.internalVx)));
        this.internalVy = util.maxAbs(0.01, this.internalVy - .01 * (util.sign(this.internalVy)));
        if (this.internalVx == 0.01 && this.internalVy == 0.01) this.up = false;
      }

    }
  }

function drawMouseRadius(){
  if (!settings.showRadius) return;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "grey";
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(Math.floor(target.x), Math.floor(target.y), settings.bounceRadius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1;
}

//module
var Flow = React.createClass({
  /**
   * this function sets up the display script.
   */
  play: function() {

        canvas = document.getElementById('waterpark');
        canvasWidth  = canvas.width;
        canvasHeight = canvas.height;

        if (canvas.getContext){

            ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = "soft-light";

            target = {x: -1, y: -1};//no mouse click to begin with

            this.createDroplets(settings.dropletNumber);

            this.drawDroplets();

            canvas.addEventListener("mousemove", function(eventInfo) {
              //push particles away
              target = {x: eventInfo.layerX, y:eventInfo.layerY};
            });

            canvas.addEventListener("mouseup",   function(eventInfo){
              //apply an outward tremor or ripple.
              shakeDroplets();
            });

            canvas.addEventListener("mouseout",  function(eventInfo){
              //idk.
              settings.showRadius = false;
            });

            canvas.addEventListener("mouseenter",  function(eventInfo){
              //idk.
              settings.showRadius = true;
            });

            this.loop();
        }
  },
  /**
   * the core function of the animation.
   */
  loop: function(){
    //if (this.props.play == "true")

    var l = settings.dropletNumber;
    var ll = droplets.length;

    if (l > ll)      this.createStars(1);
    else if (ll > l) this.reduceStars (1);

    this.existDroplets();
    this.drawDroplets();

    requestAnimationFrame(this.loop);

  },
  createDroplets: function(x){
    for ( var i = 0; i < x; i++)
      droplets.push( new Droplet(i) );
  },
  reduceDroplets: function(x){
    for (var i = 0; i < x; i++) droplets.pop();
  },
  existDroplets: function() {
    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //todo: for performance, draww all stars modulo the same at the same time (to do the same color)
    for (d in droplets) {
        droplets[d].Exist();
    }
  },
  drawDroplets: function() {
    if (settings.clear) ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawMouseRadius();
    //todo: for performance, draww all stars modulo the same at the same time (to do the same color)
    for (d in droplets) {
        droplets[d].Draw();
    }
  },
  // /**
  //  * react lifecycle function: gets called when the component will receive props,
  //  * note: they are not necessarily different.
  //  */
  // componentWillReceiveProps: function(nextProps){
  //   if(canvas.width  != canvas.width || canvas.height != canvas.height){
  //     canvasWidth  = canvas.width;
  //     canvasHeight = canvas.height;
  //   }
  // },
  /**
   * react lifecycle function: called after render
   */
  componentDidMount: function(){
    this.play();
  },
  /**
   * react lifecycle function: clean up function
   */
  componentWillUnmount: function(){
    droplets = [];
  },
  /**
   * react lifecycle function: what react should draw or render for this module
   */
  render: function() {
    var h = window.innerHeight;
    var w = window.innerWidth;

    return ( <canvas id='waterpark' height={this.props.height} width={this.props.width} > </canvas> );
  }
});

module.exports = Flow;
