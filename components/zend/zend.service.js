var angular = window.angular,
    ltshunt = window.ltshunt,
    ffi = require('ffi'),
    ref = require('ref'),
    ArrayType = require('ref-array'),
    Struct = require('ref-struct'),
    Union = require('ref-union');

angular.module('phpRepl').service('Zend', ZendService);

ZendService.$inject = ['ZendLt'];

function ZendService(ZendLt) {
    var service = this;
    service.phpLibrary = null;
    service.changePhpPath = changePhpPath;
    service.executeCommand = executeCommand;

    ZendLt.$watch('path-to-php', function (newValue, oldValue) {
        service.changePhpPath(newValue);
    });

    return service;

    function executeCommand(command, callback) {
        if (!service.phpLibrary) {
            callback(new Error("Path to php library not set!"));
        }

        command = "ob_start();" + command + ";";

        service.phpLibrary.zend_eval_stringl(ref.allocCString(command), command.length, null, ref.allocCString("lighttable command"));

        var bufferContents = new service.phpMod.zval();
        var getBufferCommand = "ob_get_contents();";
        service.phpLibrary.zend_eval_stringl(ref.allocCString(getBufferCommand), getBufferCommand.length, bufferContents.ref(), ref.allocCString("lighttable command (get result)"));

        // TODO: switch to async functions
        // TODO: surround execution of commands in zend_try, otherwise fatal errors will exit;

        var output = "";
        if (!bufferContents.value.str.val.isNull()) {
            output = bufferContents.value.str.val.readCString();
        }

        callback(null, output);
    }

    function changePhpPath(pathToPhp) {
        cleanUpZend();

        // TODO: support more versions of php & let user know when php version is not supported
        service.phpMod = require('node-ffi-php-bindings/lib/5.6');
        service.phpMod.loadDependentSymbols();
        service.phpMod.loadAllBindings();

        service.phpLibrary = service.phpMod(pathToPhp);

        // initialize php for embedding
        startupZend();

        // test our embedded connection by calling get_zend_version
        var zendVersion = service.phpLibrary.get_zend_version().readCString();
        console.log("Zend version: " + zendVersion);
    }

    function startupZend() {
        service.phpLibrary.php_embed_init(0, null);
    }

    function cleanUpZend() {
        if (service.phpLibrary) {
            service.phpLibrary.php_embed_shutdown();
            service.phpLibrary.close();

            delete service.phpLibrary;
            delete service.phpMod;
        }
    }
}