export interface StmSettings {
  nodeAddressHigh: number
  nodeAddressLow: number
  nodeGroupAddress: number
  fwVersion: string
  auxPower: boolean
  auxAutoShutdown: boolean
  auxShutdownDelay: boolean
}

export interface Settings {
  usb: boolean
  manualIp: boolean
  ip: string
  nodeAddressHigh: number
  nodeAddressLow: number
  groupAddress: number
  autoShutdown: boolean
  jlrSwitching: boolean
}
