var lt = window.lt,
    ltshunt = window.ltshunt,
    cljs = ltshunt.cljs;

ltshunt.ns("lt.plugins.php-repl");

var sideBarTemplate = ltshunt.object.type('repl-sidebar', {
    ':tags': [':sidebar-repl'],
    ':path': "",
    ':label': 'php-repl',
    ':active': null,
    ':init': function () {
        return ltshunt.angular.directive('phpRepl', 'repl-sidebar', {});
    }
});

var sidebar = sideBarTemplate.new();

ltshunt.command.new('show-repl-sidebar', {
    desc: 'Command: Show PHP REPL bar',
    hidden: false,
    exec: function () {
        lt.object.raise(lt.objs.sidebar.rightbar, cljs.keyword('toggle', null), sidebar, {});
    }
});

lt.objs.sidebar.add_item(lt.objs.sidebar.rightbar, sidebar);