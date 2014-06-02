'use strict';

angular.module('todoApp')
  .controller('MainCtrl', function ($scope, $timeout, Todo, filterFilter, $location) {

    $scope.todos = [];
    $scope.newTodo = '';
    $scope.editedTodo = null;

    // set filter status to initial search query
    $scope.status = $location.search().q || '';

    // watch todos array for changes and update the counts
    $scope.$watch( 'todos', function() {
      $scope.remainingCount = filterFilter($scope.todos, {completed: false}).length;
      $scope.completedCount = $scope.todos.length - $scope.remainingCount;
      $scope.allChecked     = !$scope.remainingCount;
    }, true);

    // monitor current location for changes and adjust filter accordingly
    $scope.$on( '$locationChangeSuccess', function() {
      var status = $scope.status = $location.search().q || '';
      $scope.statusFilter = ( status === 'active' ) ?
	{ completed: false } : ( status === 'completed' ) ?
	{ completed: true  } : null;
    });

    // create new todo locally and save remotely
    $scope.addTodo = function() {
      var todoTitle = $scope.newTodo.trim();
      if (!todoTitle.length) {
        return;
      }
      var newTodo = new Todo({
        title: todoTitle,
        completed: false
      });
      newTodo.$save();
      $scope.todos.unshift(newTodo);
      $scope.newTodo = '';
    };

    // remove todo locally and remotely
    $scope.removeTodo = function(id) {
      $scope.todos[id].$remove();
      $scope.todos.splice(id,1);
    };

    // begin editing a todo and save original in case of cancel
    $scope.editTodo = function(id) {
      $scope.editedTodo = $scope.todos[id];
      $scope.originalTodo = angular.extend({}, $scope.editedTodo);
    };

    // update when done editing or if title erased remove todo
    $scope.doneEditing = function(id) {
      $scope.editedTodo = null;
      var title = $scope.todos[id].title.trim();
      if (title) {
        $scope.todos[id].$update();
      } else {
        $scope.removeTodo(id);
      }
    };

    // revert edited todo back to what it was
    $scope.revertEditing = function(id) {
      $scope.todos[id] = $scope.originalTodo;
      $scope.doneEditing(id);
    };

    // toggle todo completed and update remotely
    $scope.toggleCompleted = function(id) {
      var todo = $scope.todos[id];
      todo.completed = !todo.completed;
      todo.$update();
    };

    // remove completed todos locally and from server
    $scope.clearCompletedTodos = function() {
      var remainingTodos = [];
      angular.forEach($scope.todos, function(todo) {
	if (todo.completed) {
          todo.$remove();
        } else {
          remainingTodos.push(todo);
        }
      });
      $scope.todos = remainingTodos;
    };

    // mark all as completed or not and update remotely
    $scope.markAll = function(allCompleted) {
      angular.forEach($scope.todos, function(todo) {
        todo.completed = !allCompleted;
        todo.$update();
      });
    };

    // poll server to regularly update todos
    (function refreshTodos() {
      Todo.query(function(response) {
        // update todos if a todo is not being edited
        if ($scope.editedTodo === null) {
	  $scope.todos = response;
        }
        $scope.promise = $timeout(refreshTodos,5000);
      });
    })();

    // when controller destroyed cancel polling
    $scope.$on( 'destroy', function() {
      $timeout.cancel($scope.promise);
    });
  });
