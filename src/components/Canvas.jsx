
var React = require('React');
var _ = require('lodash');  // Needed for twojs
var twojs = require('two.js');
var Vec = require('Vec');

var DataStore = require('stores/DataStore');

var width = window.innerWidth;
var height = window.innerHeight;
var two = new Two({ fullscreen: true });

for (var i = 0; i < 800; i++) {
  var x = Math.round(Math.random() * 3000);
  var y = Math.round(Math.random() * 3000);
  var star = two.makeCircle(x, y, 1);
  star.opacity = 0.5;
  star.noStroke();
}

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
      var circle = two.makeCircle(0, 0, Math.max(DataStore.getPlanetData(planet).radius * DataStore.getPlanetScale(), 1));
      circle.fill = colors[planet];
      circle.noStroke();
      planets[planet] = circle;
      planetGroup.add(circle);
    }
    this.centerPlanets();
    window.addEventListener('resize', this.centerPlanets);
    two.bind('update', this.draw).play();  // Finally, start the animation loop
  },

  centerPlanets() {
    planetGroup.translation.set(two.width / 2, two.height / 2);
  },

  draw(frameCount) {
    DataStore.incDays(1);
    for (var planet in planets) {
      var pos = DataStore.getPlanetPositions()[planet];
      planets[planet].translation.set(pos.x, pos.y);
    }
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
