var angular = window.angular;

/**
 * TODO
 */
angular.module('phpRepl').controller('ReplSidebarController', ReplSidebarController);

ReplSidebarController.$inject = ['Zend'];

function ReplSidebarController(Zend) {
    var vm = this;
    vm.commands = [];
    vm.executeCommand = executeCommand;

    function executeCommand(commandText) {
        Zend.executeCommand(commandText, function (error, output) {
            vm.commands.push({command: commandText, output: output});
        });
    }
}