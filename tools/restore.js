#!/usr/bin/env node

"use strict";

var child_process = require('child_process');
var os = require('os')
var spawn = child_process.spawn;

spawn('pg_restore', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-Fc', '-a', '-j', os.cpus().length, '-d', 'postgres', '/usr/6element-backups/6element.bak'], {stdio: 'inherit'});
