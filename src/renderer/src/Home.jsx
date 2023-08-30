import React, { useEffect, useState } from 'react'
import { socket } from './socket'
import { useLogStore, useMessageStore, useNetworkStore, useStatusStore } from './Store'
import { Alert, Box, TextField, Dialog, DialogContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Messages from './Messages'
import Button from '@mui/material/Button'
import { requestRegistry, getSource, allocate } from './ipc'
import ManualMessage from './ManualMessage'

export default function Home() {
  let errorTimer = null
  const [isConnected, setIsConnected] = useState(socket.connected)
  const messages = useMessageStore((state) => state.messages)
  const functions = useNetworkStore((state) => state.functions)
  const [selectedFunction, setSelectedFunction] = useNetworkStore((state) => [
    state.selectedFunction,
    state.setSelectedFunction
  ])
  const [chosenType, setChosenType, clearFunctions] = useNetworkStore((state) => [
    state.chosenType,
    state.setChosenType,
    state.clearFunctions
  ])
  const [error, setError] = useState(null)
  const [loggingEnabled, setLoggingEnabled] = useLogStore((state) => [
    state.loggingEnabled,
    state.setLoggingEnabled
  ])
  const [log, setLog] = useLogStore((state) => [state.log, state.setLog])
  const [filter, setFilter] = useMessageStore((state) => [state.filter, state.setFilter])
  const [fBlock, setFblock, clearFblock] = useStatusStore((state) => [
    state.fblock,
    state.setFblock,
    state.clearFblock,
  ])
  const [logName, setlogName] = useState('')
  //console.log(functions)
  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    window.electronAPI.error((_event, value) => {
      setErrorData(value)
    })
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      // socket.off('newControlMessage', updateMessages);
      //socket.off('functionBlocks', updateRegistry)
      socket.off('error', setErrorData)
      clearTimeout(errorTimer)
    }
  }, [])

  function setErrorData(value) {
    if (errorTimer) {
      clearTimeout(errorTimer)
    }
    setError(value)
    errorTimer = setTimeout(() => {
      setError(null)
    }, 10000)
  }

  function setLogging() {
    if (loggingEnabled) {
      const blob = new Blob([log], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = logName === '' ? 'MostDump.log' : logName + '.log'
      link.href = url
      link.click()
      setLoggingEnabled(false)
      setLog('')
    } else {
      setLoggingEnabled(true)
    }
  }

  function setAuto(event) {
    socket.emit('setAuto', { type: selectedFunction, instance: chosenType })
  }

  function setDefault(event) {
    socket.emit('setDefault', { type: selectedFunction, instance: chosenType })
  }

  const filterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const logNameChange = (event) => {
    setlogName(event.target.value)
  }

  return (
    <Box sx={{ flexGrow: 0, height: '100%' }}>
      <Button variant={'outlined'} onClick={() => requestRegistry()}>Request Registry</Button>
      <Button variant={'outlined'} onClick={() => socket.emit('saveConfig')}>Save Default Registry</Button>
      <Button variant={'outlined'} onClick={() => allocate()}>Allocate</Button>
      <Button variant={'outlined'} onClick={() => getSource()}>get source</Button>
      <Button variant={'outlined'} onClick={() => setLogging()}>
        {loggingEnabled ? 'Stop Logging' : 'Begin Logging'}
      </Button>
      <TextField label={'Log File Name'} value={logName} onChange={logNameChange} />
      {error ? <Alert severity="error">{error}</Alert> : <div></div>}
      <Box sx={{ flexGrow: 0, flexDirection: 'row', display: 'flex' }}>
        <Grid xs={12} container spacing={2} sx={{ flexGrow: 1 }}>
          <TextField label={'FBlock ID'} value={filter} onChange={filterChange} />
          <Messages messages={messages} />
        </Grid>
      </Box>
      <Dialog
        open={fBlock !== null ? true : false}
        onClose={() => {
          clearFblock()
          clearFunctions()
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <ManualMessage fBlock={fBlock} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
