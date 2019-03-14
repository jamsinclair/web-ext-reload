#!/usr/bin/env node
'use strict'
const meow = require('meow')
const {startServer} = require('.')

const cli = meow(
  `
	Usage
	  $ web-ext-reload path/to/watch

	Options
	  --ignoredPaths, -i File/Glob of paths to ignore (Default: node_modules)
	  --port,         -p Port number to start the reload server on (Default: 3030)

	Examples
    $ web-ext-reload ./
	  $ web-ext-reload ./dist -p 9000 -i ./dist/config
`,
  {
    flags: {
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

startServer({
  paths: cli.input[0],
  port: cli.flags.port && Number(cli.flags.port),
  ignoredPaths: cli.flags.ignoredPaths
})
