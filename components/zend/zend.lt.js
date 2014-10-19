var lt = window.lt,
    ltshunt = window.ltshunt,
    cljs = ltshunt.cljs;

ltshunt.ns("lt.plugins.php-repl");

var zendTemplate = ltshunt.object.type('zend', {
    ':tags': [':zend-engine', ':php-engine'],
    ':path': "",
    ':label': 'zend',
    ':active': null,
    ':init': function () {
        // TODO: fill out or leave blank?
    }
});

zendTemplate.new();

ltshunt.behavior.new('set-php-location', {
    desc: 'PHP-REPL: Set PHP Location',
    triggers: [':object.instant'],
    type: cljs.keyword('user', null),
    params: [
        {
            label: 'path',
            type: 'text' // TODO: can this be path (ie, use a file selector dialog)?
        }
    ],
    reaction: function (self, path) {
        ltshunt.angular.invoke(function (Zend) {
            Zend.setPathToPhp(path);
        });
    }
});