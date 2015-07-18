
var React = require('React');
var _ = require('lodash');  // Needed for twojs
var twojs = require('two.js');
var Vec = require('Vec');

var width = window.innerWidth;
var height = window.innerHeight;
var two = new Two({ fullscreen: true });

for (var i = 0; i < 300; i++) {
  var x = Math.round(Math.random() * width * 2); // * 2 in case of zoom
  var y = Math.round(Math.random() * height * 2);
  var star = two.makeCircle(x, y, 1);
  star.opacity = 0.5;
  star.noStroke();
}


var scale = 60;
var planetScale = 2;


var sunRadius = 464.9; // in AU * 10^-5
// var sun = two.makeCircle(0, 0, sunRadius * planetScale);
var planets = {
  "Mercury" : null,
  "Venus"   : null,
  "Earth"   : null,
  "Mars"    : null,
  "Jupiter" : null,
  "Saturn"  : null,
  "Uranus"  : null,
  "Neptune" : null,
  "Pluto"   : null
};

var planetGroup = two.makeGroup();




var time = new Date();
    time.setDate(21);
    time.setMonth(5);
    time.setYear(1997);
    time.setHours(0);


var data = require('data.json');

function sind(angle) {
  return Math.sin(angle * (Math.PI/180));
}

function cosd(angle) {
  return Math.cos(angle * (Math.PI / 180));
}

function isLeap(date) {
  var y = date.getUTCFullYear();
  return !(y % 4) && (y % 100) || !(y % 400);
}

//http://www.stargazing.net/kepler/ellipse.html
function getPosFromDate(planet, date) {
  var dpos = data.DaysSinceMonth[isLeap(date) ? "LeapYear" : "NormalYear"][date.getMonth()]
              + date.getDate()
              + data.daysSinceJ2000[date.getFullYear()]
              + (date.getHours() + date.getMinutes() / 60) / 24;
  return getPos(dpos - date.planetDataDayCount);
}

function getPos(planet, days) {
  // Mars
  var {i, o, p, a, n, e, L} = data.Planets[planet]; // n = sqrt(G(M + m)/a^3)
  // Values from August 20th 1997

  var M = n * days + L - p; // mean anomaly
  while (M < 0) { M += 360; }
  while (M > 360) { M -= 360; }
  var v = M + 180/Math.PI * [ (2 * e - e*e*e / 4) * sind(M) + 5/4 * e*e * sind(2*M) + 13/12 * e*e*e * sind(3*M)];

  var r = a * (1 - e*e) / [1 + e*cosd(v)];

  var x = r * [cosd(o) * cosd(v + p - o) - sind(o) * sind(v + p - o) * cosd(i)];
  var y = r * [sind(o) * cosd(v + p - o) + cosd(o) * sind(v + p - o) * cosd(i)];
  var z = r * [sind(v + p - o) * sind(i)];

  return {x: x, y: y, z: z};
}


var Canvas = React.createClass({

  componentDidMount() {


    var elem = React.findDOMNode(this.refs.twojs);
    two.appendTo(elem);




    var colors = {
      "Mercury": '#9E9E9E',
      "Venus": '#795548',
      "Earth": '#2196F3',
      "Mars": '#FF7043',
      "Jupiter": '#E67E22',
      "Saturn": '#A1887F',
      "Uranus": '#4DB6AC',
      "Neptune": '#3F51B5',
      "Pluto": '#EABC98'
    }

    for (var planet in planets) {
      var circle = two.makeCircle(0, 0, Math.max(data.Planets[planet].radius * planetScale, 2));
      circle.fill = colors[planet];
      planets[planet] = circle;
      planetGroup.add(circle);
    }
    planetGroup.translation.set(two.width / 2, two.height / 2);
    planetGroup.scale = 0.45;


    two.bind('update', this.draw).play();  // Finally, start the animation loop
  },

  draw(frameCount) {
    for (var planet in planets) {
      var pos = getPos(planet,  frameCount + 4750);
      pos = new Vec(pos.x, pos.y);
      pos = pos.scale(scale);
      planets[planet].translation.set(pos.x, pos.y);
    }

    planetGroup.translation.set(two.width / 2, two.height / 2);

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
