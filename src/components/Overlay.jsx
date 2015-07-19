import React from 'React';
import DataStore from 'stores/DataStore';

require('./styles/Overlay.scss');

export default class Overlay extends React.Component {

  constructor() {
    super();
    DataStore.subscribe(() => this.setState(this.updatedState));
  }

  state = this.updatedState();

  updatedState() {
    return {
      planetScale: DataStore.getPlanetScale() / 10000,
      spaceScale: DataStore.getSpaceScale(),
      date: DataStore.getCurrentDate()
    }
  }

  render() {
    var date = this.state.date;
    var dateString =
      date.getUTCFullYear() +"/"+
      ("0" + (date.getUTCMonth()+1)).slice(-2) +"/"+
      ("0" + date.getUTCDate()).slice(-2);
    return (
      <div className="Overlay">
        <div className="Overlay-title"></div>
        <div className="Overlay-content">
          <b>Planets</b>: 1px = {this.state.planetScale} AU<br/>
          <b>Space</b>: 1px = {this.state.spaceScale} AU<br/>
          <b>Date</b>: {dateString}
        </div>

      </div>
    )
  }

}
