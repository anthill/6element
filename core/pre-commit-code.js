"use strict";

var CLIEngine = require("eslint").CLIEngine;
// 'git ls-files -om --exclude-standard' to list all files that were changed then filter out non-JS files

process.chdir(__dirname);

var cli = new CLIEngine({});

var report = cli.executeOnFiles(["./"]);
var errorReport = CLIEngine.getErrorResults(report.results);

if(errorReport.length >= 1)
console.error(errorReport);

/*
 * Wait for the stdout buffer to drain.
 * See https://github.com/eslint/eslint/issues/317
 */
process.on("exit", function() {
    process.exit(exitCode);
});
