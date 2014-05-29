'use strict';

angular.module('todoApp')
  .directive('todoFocus', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the todoFocus directive');
      }
    };
  });
