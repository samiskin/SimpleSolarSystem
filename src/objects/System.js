

import Body from 'objects/Body';
import _ from 'lodash';

export default class System {
  bodies = [];

  addBody(body) {
    this.bodies.push(body);
  }

  removeBody(body) {
    this.bodies = _.remove(this.bodies, body);
  }

  tick() {
    var removedBodies = [];
    this.bodies.forEach((body) =>  {
      this.bodies.forEach((other) => {
        body.interact(other);
      });
    });

    this.bodies = _.without(this.bodies, removedBodies);

    this.bodies.forEach((body) =>  {
      body.tick();
    });
  }

  render(context) {
    this.bodies.forEach((body) => {
      body.render(context);
    });
  }

}
