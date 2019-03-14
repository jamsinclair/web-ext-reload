/* global chrome WebSocket */
'use strict'
const EVENTS = {RELOAD: 'reload'}
const RECONNECT_DELAY = 10000
const options = chrome.runtime.getManifest()['web-ext-reload'] || {}

const listenForReload = (port = 3030) => {
  const ws = new WebSocket(`ws://localhost:${port}`)

  ws.addEventListener('open', () => {
    console.info('[web-ext-reload] Connected to Reload Server')
  })

  ws.addEventListener('message', e => {
    if (e.data === EVENTS.RELOAD) {
      console.info('[web-ext-reload] Reloading background.js')
      chrome.runtime.reload()
    }
  })

  ws.addEventListener('close', e => {
    console.warn('[web-ext-reload] Socket closed:', e.code)
    console.info(`[web-ext-reload] Try reconnect after ${RECONNECT_DELAY}ms`)
    setTimeout(() => {
      console.info(`[web-ext-reload] Attempting reconnect`)
      listenForReload(port)
    }, RECONNECT_DELAY)
  })

  ws.addEventListener('error', e => {
    console.warn('[web-ext-reload] Socket error:', e.type)
  })
}

chrome.management.getSelf(info => {
  if (info.installType === 'development' && !options.disabled) {
    listenForReload(options.port)
  }
})
