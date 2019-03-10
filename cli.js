#!/usr/bin/env node
'use strict'
const meow = require('meow')
const ReloadServer = require('./server')

const cli = meow(
	`
	Usage
	  $ web-ext-reload path/to/watch

	Options
	  --debounceWait, -d The wait after file change events before triggering reload
	  --ignoredPaths, -i Glob of paths to ignore
	  --port,         -p Port number to start the reload server on

	Examples
	  $ web-ext-reload ./ --port=9000 --ignoredPaths=node_modules
	  $ web-ext-reload ./ -p 9000 -i node_modules
`,
	{
		flags: {
			debounceWait: {
				type: 'string',
				alias: 'd'
			},
			ignoredPaths: {
				type: 'string',
				alias: 'i'
			},
			port: {
				type: 'string',
				alias: 'p'
			}
		}
	}
)

const server = new ReloadServer({
	paths: cli.input[0],
	port: cli.flags.port && Number(cli.flags.port),
	ignoredPaths: cli.flags.ignoredPaths,
	debounceWait: cli.flags.debounceWait && Number(cli.flags.debounceWait)
})

server.start()
