import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', {
      sendMessage: (message) => ipcRenderer.send('newMessage', message),
      newMessage: (callback) => ipcRenderer.on('newMessage', callback),
      appStatus: (callback) => ipcRenderer.on('appStatus', callback),
      registryUpdate: (callback) => ipcRenderer.on('registryUpdate', callback),
      requestRegistry: () => ipcRenderer.invoke('requestRegistry'),
      getSource: () => ipcRenderer.invoke('getSource')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
