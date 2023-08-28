export const requestRegistry = () => {
    window.electronAPI.requestRegistry()
}

export const getSource = () => {
    window.electronAPI.getSource()
}

export const sendMessage = (data) => {
  window.electronAPI.sendMessage(data)
}

export const allocate = () => {
  window.electronAPI.allocate()
}

export const stream = (data) => {
  window.electronAPI.stream(data)
}
