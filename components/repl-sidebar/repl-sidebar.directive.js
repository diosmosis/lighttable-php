var path = require('path'),
    angular = window.angular;

/**
 * TODO
 */
angular.module('phpRepl').directive('replSidebar', phpRepl);

phpRepl.$inject = [];

function phpRepl() {
    return {
        restrict: 'E',
        scope: {
            // TODO
        },
        templateUrl: 'file://' + path.join(__dirname, 'repl-sidebar.directive.html'),
        controller: 'ReplSidebarController',
        controllerAs: 'replSidebar',
        compile: function (element, attrs) {
            return function (scope, element, attrs) {
                // TODO
            }
        }
    };
}