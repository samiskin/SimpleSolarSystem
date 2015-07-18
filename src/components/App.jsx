'use strict';

var React = require('react');
var Canvas = require('Canvas.jsx');

require('./styles/App.scss');

export default class App extends React.Component{

  render() {
    return (
      <div className="App">
        <Canvas />
      </div>
    );
  }

};
