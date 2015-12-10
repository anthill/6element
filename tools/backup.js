#!/usr/bin/env node

"use strict";

var spawn = require('child_process').spawn;

spawn('pg_dump', ['-p', process.env.DB_PORT_5432_TCP_PORT, '-h', process.env.DB_PORT_5432_TCP_ADDR, '-U', process.env.POSTGRES_USER, '-Fc', '-d', 'postgres'], {stdio: 'inherit'});
