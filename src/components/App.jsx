'use strict';

var React = require('react');
var Canvas = require('Canvas.jsx');
var Overlay = require('Overlay.jsx');

require('./styles/App.scss');

export default class App extends React.Component{

  render() {
    return (
      <div className="App">
        <Canvas />
        <Overlay />
      </div>
    );
  }

};
