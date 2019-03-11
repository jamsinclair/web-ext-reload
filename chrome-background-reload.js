/* global chrome WebSocket */
'use strict'
const EVENTS = {RELOAD: 'reload'}
const options = chrome.runtime.getManifest()['web-ext-reload'] || {}

const listenForReload = (port = 3030) => {
  const ws = new WebSocket(`ws://localhost:${port}`)

  ws.addEventListener('message', e => {
    console.info('[web-ext-reload] Got message:', e.data)
    if (e.data === EVENTS.RELOAD) {
      console.info('[web-ext-reload] Reloading background.js')
      chrome.runtime.reload()
    }
  })

  ws.addEventListener('close', e => {
    console.info('[web-ext-reload] Socket closed:', e.code)
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
