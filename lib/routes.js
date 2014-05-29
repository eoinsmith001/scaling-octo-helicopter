'use strict';

var index = require('./controllers'),
    todos = require('./controllers/todos');

/**
 * Application routes
 */

module.exports = function(app) {

  // Server API Routes
  app.param('todoId', todos.todo);
  app.post('/api/todos', todos.create);
  app.get( '/api/todos', todos.query );
  app.get( '/api/todos/:todoId', todos.show );
  app.post('/api/todos/:todoId', todos.update );
  app.del( '/api/todos/:todoId', todos.remove );

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( index.index);
};
