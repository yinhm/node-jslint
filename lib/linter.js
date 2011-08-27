var JSLINT = require("../lib/jslint");

function addDefaults(options) {
    ['module', 'es5'].forEach(function (opt) {
        if (!options.hasOwnProperty(opt)) {
            options[opt] = true;
        }
    });
    if (!options.predef) {
        options.predef = ['Buffer', 'clearInterval', 'clearTimeout', 'console',
            'exports', 'global', 'module', 'process', 'querystring', 'require',
            'setInterval', 'setTimeout', '__dirname', '__filename'];
    }
    return options;
}

exports.lint = function(script, options) {
    // remove shebang
    script = script.replace(/^\#\!.*/, "");

    options = options || {};
    delete options.argv;
    options = addDefaults(options);

    if (options.predef && !Array.isArray(options.predef)) {
        options.predef = options.predef.split(',')
            .filter(function (n) { return !!n; });
    }

    var ok = JSLINT(script, options);

    var result = {
        ok: true,
        errors: []
    };

    if (!ok) {
        result = JSLINT.data();
        result.ok = ok;
    }

    result.options = options;

    return result;
};
