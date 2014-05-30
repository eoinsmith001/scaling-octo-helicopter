'use strict';

angular.module('todoApp')
  .factory('Todo', function ($resource) {
    return $resource('api/todos/:todoId', {
      todoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
