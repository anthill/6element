'use strict';

var CLIEngine = require('eslint').CLIEngine;
// 'git ls-files -om --exclude-standard' to list all files that were changed then filter out non-JS files

// process.chdir(__dirname);

var cli = new CLIEngine();

var report = cli.executeOnFiles(['./']);

var formatter = cli.getFormatter();

/*
 * Wait for the stdout buffer to drain.
 * See https://github.com/eslint/eslint/issues/317
 */

process.on('exit', function() {
	// output to console
	console.log('Lint report', formatter(report.results));

	// I haven't found how to output actual error code... so this will do the trick for now
	if (report.errorCount > 0)
		process.exit(99); 
	else
		process.exit();
});
