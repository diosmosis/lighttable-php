var angular = window.angular,
    ffi = require('ffi'),
    ref = require('ref'),
    ArrayType = require('ref-array');

var types = {
    charPtr: ref.refType('char'),
    stringArray: ArrayType('string')
};

angular.module('phpRepl').service('Zend', ZendService);

ZendService.$inject = [];

function ZendService() {
    var service = this;
    service.setPathToPhp = setPathToPhp;
    service.executeCommand = executeCommand;
    return service;

    function executeCommand(command, callback) {
        callback(null, command); // TODO replace w/ real code
    }

    function setPathToPhp(pathToPhp) {
        // TODO: support more versions of php & let user know when php version is not suppoted
        service.phpLibrary = ffi.Library(pathToPhp, {
            get_zend_version: ['string', []],
            php_embed_init: ['int', ['int', types.stringArray]]
        });

        // initialize php for embedding
        startupZend();

        // test our embedded connection by calling get_zend_version
        var zendVersion = service.phpLibrary.get_zend_version();
        console.log("Zend version: " + zendVersion);
    }

    function startupZend() {
        service.phpLibrary.php_embed_init(0, []);
    }
}