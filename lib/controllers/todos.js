// CRUD operations using standard mongoose

var mongoose = require('mongoose'),
        Todo = require('Todo');

exports.todo = function( req, res, next, id ) {
  Todo.findById(id, function(err, todo) {
    if (err) return next(err);
    if (!todo) return next(new Error('Failed to load todo ' + id) );
    req.todo = todo;
    next();
  });
};

exports.query = function( req, res ) {
  Todo.find().sort('-createdAt').exec(function(err,todos) {
    if (err) return res.json(500, err);
    res.json(todos);
  });
};

exports.show = function( req, res ) {
  req.json( req.todo );
};

exports.create = function( req, res ) {
  var todo = new Todo( req.body );
  todo.save(function(err){
    if (err) return res.json(500, err);
    res.json(todo);
  });
};

exports.update = function( req, res ) {
  Todo.update({ _id: req.todo._id } req.body, {}, function(err, updatedTodo) {
    if (err) return res.json(500,err);
    res.json(updatedTodo);
  });
};

exports.remove = function(req, res) {
  var todo = req.todo;
  todo.remove( function(err) {
    if (err) return res.json(500, err);
    res.json( todo );
  });
};
