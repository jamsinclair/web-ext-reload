const Server = require('./server')

module.exports = {
  startServer(options) {
    const instance = new Server(options)
    instance.start()
    return instance
  },
  Server: Server
}
