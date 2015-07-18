
var React = require('React');
var _ = require('lodash');  // Needed for twojs
var twojs = require('two.js');

var two = new Two({width: width, height: height});


var width = 500;
var height = 500;

var data = require('data.json');

function sind(angle) {
  return Math.sin(angle * (Math.PI/180));
}

function cosd(angle) {
  return Math.cos(angle * (Math.PI / 180));
}

var Canvas = React.createClass({



//http://www.stargazing.net/kepler/ellipse.html
  getPos(date) {
    // Mars
    var planet = "Mars";
    var {i, o, p, a, n, e, L} = data.Planets[planet];
    // Values from august 20th 1997
    var dele = data.DaysSinceMonth["NormalYear"][7] + 20 + data.daysSinceJ2000["1997"];
    console.log("dele: ", dele);
    // Value wanted for 21st of June 1997
    var dpos = data.DaysSinceMonth["NormalYear"][5] + 21 + data.daysSinceJ2000["1997"];
    console.log("dpos: ", dpos);
    var d= dpos - dele;
    var hour = 0;
    var minutes = 0;
    d+= (hour + minutes/60)/24;
     console.log("d: ", d);

    var M = n * d + L - p; // mean anomaly
    while (M < 0) { M += 360; }
    while (M > 360) { M -= 360; }
    console.log("M: ", M);
    var v = M + 180/Math.PI * [ (2 * e - e*e*e / 4) * sind(M) + 5/4 * e*e * sind(2*M) + 13/12 * e*e*e * sind(3*M)];
    console.log("v: ", v);

    var r = a * (1 - e*e) / [1 + e*cosd(v)];
    console.log("r: ", r);

    var x = r * [cosd(o) * cosd(v + p - o) - sind(o) * sind(v + p - o) * cosd(i)];
    var y = r * [sind(o) * cosd(v + p - o) + cosd(o) * sind(v + p - o) * cosd(i)];
    var z = r * [sind(v + p - o) * sind(i)];

    console.log("Pos(x, y, z): ", x, y, z);

  },

  componentDidMount() {

    this.getPos();

    var elem = React.findDOMNode(this.refs.twojs);
    two.appendTo(elem);

    var circle = two.makeCircle(-70, 0, 50);
    var rect = two.makeRectangle(70, 0, 100, 100);
    circle.fill = '#FF8000';
    circle.stroke = 'orangered';
    rect.fill = 'rgba(0, 200, 255, 0.75)';
    rect.stroke = '#1C75BC';

    // Groups can take an array of shapes and/or groups.
    var group = two.makeGroup(circle, rect);

    // And have translation, rotation, scale like all shapes.
    group.translation.set(two.width / 2, two.height / 2);
    group.rotation = Math.PI;
    group.scale = 0.75;

    // You can also set the same properties a shape have.
    group.linewidth = 7;
    // Bind a function to scale and rotate the group
    // to the animation loop.
    two.bind('update', function(frameCount) {
      // This code is called everytime two.update() is called.
      // Effectively 60 times per second.
      if (group.scale > 0.9999) {
        group.scale = group.rotation = 0;
      }
      var t = (1 - group.scale) * 0.125;
      group.scale += t;
      group.rotation += t * 4 * Math.PI;
    }).play();  // Finally, start the animation loop
  },

  draw() {


  },

  render() {
    return (
      <div className="Canvas">
        <div ref="twojs"></div>
      </div>
    );
  }
});

export default Canvas;
