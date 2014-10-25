var angular = window.angular,
    ltshunt = window.ltshunt,
    ffi = require('ffi'),
    ref = require('ref'),
    ArrayType = require('ref-array'),
    Struct = require('ref-struct'),
    Union = require('ref-union');

var types = {
    charPtr: ref.refType('char'),
    stringArray: ArrayType('string')
};

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

        var zendObjectValue = Struct({
            handle: 'uint',
            handlers: 'pointer'
        });

        // TODO: would be great if this could be generated from php source code.
        var zvalValue = Union({
            lval: 'long',
            dval: 'double',
            str: Struct({
                val: 'string',
                len: 'int'
            }),
            ht: 'pointer', // TODO should be HashTable pointer
            obj: zendObjectValue
        });

        var zvalStruct = Struct({
            value: zvalValue,
            refcount: 'uint',
            type: 'uchar',
            is_ref: 'uchar'
        });

        var executeResult = service.phpLibrary.zend_eval_stringl(command, command.length, null, "lighttable command");

        var bufferContents = new zvalStruct();
        var getBufferCommand = "ob_get_contents();";
        executeResult = service.phpLibrary.zend_eval_stringl(getBufferCommand, getBufferCommand.length, bufferContents.ref(), "lighttable command (get result)");

        // TODO: switch to async functions
        // TODO: surround execution of commands in zend_try, otherwise fatal errors will exit;

        callback(null, bufferContents.value.str.val);
    }

    function changePhpPath(pathToPhp) {
        cleanUpZend();

        // TODO: support more versions of php & let user know when php version is not suppoted
        service.phpLibrary = ffi.Library(pathToPhp, {
            get_zend_version: ['string', []],
            php_embed_init: ['int', ['int', types.stringArray]],
            php_embed_shutdown: ['void', []],
            zend_eval_stringl: ['int', ['string', 'int', 'pointer', 'string']]
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

    function cleanUpZend() {
        if (service.phpLibrary) {
            service.phpLibrary.php_embed_shutdown();
            delete service.phpLibrary; // TODO: doesn't actually call dlclose()
        }
    }
}