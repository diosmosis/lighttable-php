var lt = window.lt,
    ltshunt = window.ltshunt,
    cljs = ltshunt.cljs;

ltshunt.ns("lt.plugins.php-repl");

// TODO: would be better if this was automatic (ie, go through angularjs injected objects and automatatically create)
//       tags can be specified via a $ltTags member (like $inject)
ltshunt.object.forAngularService('Zend', [':zend-engine', ':php-engine']);

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
        ltshunt.object.set(self, 'path-to-php', path);
    }
});