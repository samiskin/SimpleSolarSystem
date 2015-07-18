
var React = require('React');
var sun = new Image();
var moon = new Image();
var earth = new Image();

var System = require('objects/System');
var Body = require('objects/Body');
var Vec = require('Vec');


var width = 500;
var height = 500;
var fps = 60;
var fpsInterval = 1000/fps;
var then = Date.now();

var Canvas = React.createClass({

  componentDidMount() {
    this.system = new System();

    var body1 = new Body(1000, 10, new Vec(100, 100));
    this.system.addBody(body1);

    var body2 = new Body(1000, 10, new Vec(300, 300));
    this.system.addBody(body2);

    this.draw();
  },

  draw() {

    window.requestAnimationFrame(this.draw);
    var now = Date.now();
    var elapsed = now - then;
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      var canvas = React.findDOMNode(this.refs.canvas);
      var ctx = canvas.getContext('2d');

      ctx.clearRect(0,0,width,height); // clear canvas

      this.system.tick();
      this.system.render(ctx);
    }
  },

  render() {
    return (
      <div className="Canvas">
        <canvas width={width} height={height} ref="canvas"></canvas>
      </div>
    );
  }
});

export default Canvas;
