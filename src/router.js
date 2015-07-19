
var App = require('App.jsx');

var Router = require('react-router');
var Route = Router.Route;

var routes = (
    <Route path={"/SimpleSolarSystem/"} handler={App}>
    </Route>
);

module.exports = Router.create({
    routes: routes,
    location: Router.HistoryLocation
});
