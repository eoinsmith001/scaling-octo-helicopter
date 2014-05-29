'use strict';

// focus the todo item currently being edited

angular.module('todoApp')
  .directive('todoFocus', function todoFocus ($timeout) {
    return function(scope,elem,attrs) {
      scope.$watch(attrs.todoFocus, function(newVal) {
        if (newVal) {
          $timeout(function() {
	    elem[0].focus();
          }, 0, false);
        }
      });
    };
  });
