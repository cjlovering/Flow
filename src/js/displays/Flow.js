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
var dropletNumber = 100;
var droplets = [];

/**
 * TODO:
 *  increase smoothness (decrease base speeds) - look at one ball to see changes
 *  do math for angles better
 *  add other events! (cohesion, adhesion, gravity more effective, then mouse)
 *  make it move at least one pixel at a time (it might be already)
 */


/** canvas attributes
 *  these are kept up to-date, and used rather than canvas.attribute in order to
 *  avoid re-flows.
 */
var canvasWidth, canvasHeight;

/**
 * These are tendencies the particles will use to simulate desired behavior
 */
var GRAVITY_ON_WATER = 0.01;
var COHESION = 3;
var ADHESION = 2;
var COLLISION_PARTICLE = 1.5;
var COLLISION_WALL = 2;
var COLLISION_MOUSE = 3;
var flipFlop = -1;

function rand(number){
  return (Math.random() * number + 1);
}
function direction(){
  flipFlop *= -1;
  return flipFlop;
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
function Droplets(i){
    this.x = rand(canvasWidth);
    this.y = rand(canvasHeight);
    this.vx = direction() * rand(3);
    this.vy = direction() * rand(3);
    this.internalVx = 0;//direction() * rand(2); <-- consider this
    this.internalVy = 0;//direction() * rand(2);
    this.r = 3; //base it no neighbors??

    this.Exist = function() {
      //move
      this.x += (this.vx + this.internalVx);
      this.y += (this.vy + this.internalVy);

      //gravity on vy
      this.vy += this.vy * GRAVITY_ON_WATER;

      //particle collission


      //mouse collission


      //wall collision
      if (this.x <= 0) {
        this.x = 1;
        this.vx = (-1 * this.vx % 1) * Math.abs(direction() * rand(3));
      }
      if (this.x >= canvasWidth) {
        this.x = canvasWidth - 1;
        this.vx = (-1 * this.vx % 1) * Math.abs(direction() * rand(3));
      }
      if (this.y <= 0) {
        this.y = 1;
        this.vy = (-1 * this.vy % 1) * Math.abs(direction() * rand(3));
      }
      if (this.y >= canvasHeight) {
        this.y = canvasHeight - 1;
        this.vy = (-1 * this.vy % 1) * Math.abs(direction() * rand(3));
      }


    };
    this.Draw   = function() {
      //perhaps this will later connect inner area of droplets, and smoothly draw the edges
      ctx = canvas.getContext('2d');
      ctx.fillStyle = "#0000A0";
      ctx.beginPath();
      ctx.arc(Math.floor(this.x), Math.floor(this.y), this.r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    };
};

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

            target = {x: -1, y: -1};//no mouse click to begin with

            this.createDroplets(dropletNumber);

            this.drawDroplets();

            canvas.addEventListener("mousemove", function(eventInfo) {
              //push particles away
            });

            canvas.addEventListener("mouseup",   function(eventInfo){
              //apply an outward tremor or ripple.
            });

            canvas.addEventListener("mouseout",  function(eventInfo){
              //idk.
            });

            this.loop();
        }
  },
  /**
   * the core function of the animation.
   */
  loop: function(){
    //if (this.props.play == "true")

    var l = dropletNumber;
    var ll = droplets.length;

    if (l > ll)      this.createStars(1);
    else if (ll > l) this.reduceStars (1);

    this.existDroplets();
    this.drawDroplets();

    requestAnimationFrame(this.loop);

  },
  createDroplets: function(x){
    for ( var i = 0; i < x; i++)
      droplets.push( new Droplets(i) );
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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
