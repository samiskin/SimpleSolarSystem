



import { EventEmitter } from 'events';
import data from 'data.json';
import Vec from 'Vec';
var refDate = new Date(1997, 5, 21);
var sunRadius = 464.9; // in AU * 10^-5

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

var spaceScale = 60*.45;
var planetScale = 2*.45;

var currentDay = 4577;


  function getPosFromDate(planet, date) {
    var dpos = data.DaysSinceMonth[isLeap(date) ? "LeapYear" : "NormalYear"][date.getMonth()]
                + date.getDate()
                + data.daysSinceJ2000[date.getFullYear()]
                + (date.getHours() + date.getMinutes() / 60) / 24;
    return getPos(dpos - date.planetDataDayCount);
  }

function getPos(planet, days) {
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


class DataStore extends EventEmitter{

  constructor() {
    super();
    this.calculatePlanets(0);
  }

  incDays(days) {
    currentDay += days;
    this.calculatePlanets(currentDay);
    this.emitChange();
  }

  calculatePlanets(day) {
    for (var planet in planets) {
      var pos = getPos(planet, day);
      pos = new Vec(pos.x, pos.y);
      pos = pos.scale(spaceScale);
      planets[planet] = pos;
    }
  }

  getPlanetPositions() {
    return planets;
  }

  getPlanetData(planet) {
    return data.Planets[planet];
  }

  getPlanetScale() {
    return planetScale;
  }

  getSpaceScale() {
    return spaceScale;
  }

  getCurrentDate() {
    var currDate = new Date(refDate);
    currDate.setDate(currDate.getDate() + currentDay);
    return currDate;
  }

  emitChange() {
    this.emit('change');
  }

  subscribe(callback) {
    this.on('change', callback);
  }

  unsubscribe(callback) {
    this.removeListener('change', callback);
  }

}

export default new DataStore();
