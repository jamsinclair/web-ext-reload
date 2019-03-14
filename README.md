# web-ext-reload

>

Reload your Chrome extension during development via websockets.

## Install

```
$ npm install web-ext-reload
```

You'll also need to copy the `chrome-background-reload.js` to your chrome extension
as a persistent background script.

```json
{
  "background": {
    "scripts": [ "chrome-background-reload.js"],
    "persistent": true
  }
}
```

## CLI

```
$ web-ext-reload --help

	Usage
	  $ web-ext-reload path/to/watch

	Options
	  --ignoredPaths, -i File/Glob of paths to ignore (Default: node_modules)
	  --port,         -p Port number to start the reload server on (Default: 3030)

	Examples
    $ web-ext-reload ./
	  $ web-ext-reload ./dist -p 9000 -i ./dist/config
```

## Usage

```js
const webExtReload = require('web-ext-reload');

webExtReload.startServer({ paths: './dist' });
```

## API

### startServer(options)

Returns instance of the Server

#### options

Type: `Object`

##### ignoredPaths

Type: `string|array`<br>
Default: `'node_modules/**'`

Filepath or glob of files to ignore

##### paths

Type: `string|Array`<br>
Default: `'./'`

Filepath or glob of files to watch

##### port

Type: `number`<br>
Default: `3030`

Port number to start the reload server on

##### watch

Type: `boolean`<br>
Default: `true`

Whether to start watching files on server start

### Server

#### .start()

#### .startWatcher(paths, ignored)

#### .stopWatcher()

#### .stopServer()

#### .stop()

#### .sendReloadEvent()

## License

MIT © [jamsinclair](https://github.com/jamsinclair)