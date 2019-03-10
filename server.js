'use strict'
const getPort = require('get-port')
const chokidar = require('chokidar')
const debounce = require('lodash/debounce')

const EVENTS = {
  RELOAD: 'reload'
}
// eslint-disable-next-line no-useless-escape
const DEFAULT_IGNORED_PATHS = [/(^|[\/\\])\../, 'node_modules/**']

const WebSocket = require('ws')

class ReloadServer {
  constructor({
    paths = './',
    ignoredPaths = DEFAULT_IGNORED_PATHS,
    port = 3030,
    debounceWait = 200
  } = {}) {
    this.server = null
    this.watcher = null
    this.paths = paths
    this.ignoredPaths = ignoredPaths
    this.port = port
    this.debounceWait = debounceWait
    this.sendReloadEvent = this.sendReloadEvent.bind(this)
  }

  async start(port, watch = true) {
    const currentPort = await getPort({port: port || this.port})

    if (port && currentPort !== port) {
      console.log(`${port} in use, using ${currentPort}`)
    }

    this.server = new WebSocket.Server({port: currentPort})
    console.log(`Starting web-ext-reload server on ${currentPort}`)

    if (watch) {
      this.watch(this.paths, this.ignoredPaths)
      console.log(`Starting watcher for ${this.paths}`)
    }
  }

  broadcast(data) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  sendReloadEvent() {
    console.log('Reloading Extension')
    this.broadcast(EVENTS.RELOAD)
  }

  watch(paths, ignored) {
    this.watcher = chokidar.watch(paths, ignored)
    this.watcher.on('all', debounce(this.sendReloadEvent, this.debounceWait))
  }

  stopServer() {
    if (this.server) {
      this.server.close()
      this.server = null
    }
  }

  stopWatcher() {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
  }

  stop() {
    this.stopServer()
    this.stopWatcher()
  }
}

module.exports = ReloadServer
