#!/usr/bin/env node

var linter = require("../lib/linter");
var reporter = require("../lib/reporter");
var nopt = require("nopt");
var fs = require("fs");

function commandOptions () {
    var flags = [
        'adsafe', 'bitwise', 'browser', 'cap', 'confusion', 'continue', 'css',
        'debug', 'devel', 'eqeq', 'es5', 'evil', 'forin', 'fragment', 'module',
        'newcap', 'node', 'nomen', 'on', 'onevar', 'passfail', 'plusplus',
        'regexp', 'rhino', 'safe', 'sloppy', 'sub', 'undef', 'unparam', 'vars',
        'white', 'widget', 'windows'
    ];

    var commandOpts = {
        'indent' : Number,
        'maxerr' : Number,
        'maxlen' : Number,
        'predef' : [String, null]
    };

    flags.forEach(function (option) {
        commandOpts[option] = Boolean;
    });

    return commandOpts;
}

var options = commandOptions();
var parsed = nopt(options);

function die(why) {
    console.warn(why);
    console.warn("Usage: " + process.argv[1] +
        " [--" + Object.keys(options).join("] [--") +
        "] [-" + shorthands.join("] [-") +
        "] <scriptfile>...");
    process.exit(1);
}

if (!parsed.argv.remain.length) {
    die("No files specified.");
}

function lintFile(file) {
    fs.readFile(file, function (err, data) {
        if (err) {
            throw err;
        }
        data = data.toString("utf8");
        var lint = linter.lint(data, parsed);
        if (parsed.json) {
            console.log(JSON.stringify([file, lint]));
        } else {
            reporter.report(file, lint);
        }
    });
    // TODO process.exit with correct return value
}

parsed.argv.remain.forEach(lintFile);
