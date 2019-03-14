'use strict'
const chokidar = require('chokidar')
const debounce = require('lodash/debounce')

const EVENTS = {
  RELOAD: 'reload'
}
// eslint-disable-next-line no-useless-escape
const DEFAULT_IGNORED_PATHS = [/(^|[\/\\])\../, 'node_modules/**']
const DEBOUNCE_WATCH_WAIT = 200

const WebSocket = require('ws')

class ReloadServer {
  constructor({
    paths = './',
    ignoredPaths = DEFAULT_IGNORED_PATHS,
    port = 3030,
    watch = true
  } = {}) {
    this.server = null
    this.watcher = null
    this.paths = paths
    this.ignoredPaths = ignoredPaths
    this.port = port
    this.debounceWait = DEBOUNCE_WATCH_WAIT
    this.watch = watch
    this.sendReloadEvent = this.sendReloadEvent.bind(this)
  }

  _broadcast(data) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  async start() {
    console.log(`Starting web-ext-reload server on ${this.port}`)
    this.server = new WebSocket.Server({port: this.port})

    if (this.watch) {
      console.log(`Starting watcher for ${this.paths}`)
      this.startWatcher(this.paths, this.ignoredPaths)
    }
  }

  sendReloadEvent() {
    console.log('Reloading Extension')
    this._broadcast(EVENTS.RELOAD)
  }

  startWatcher(paths, ignored) {
    this.watcher = chokidar.watch(paths, {ignored, ignoreInitial: true})
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
