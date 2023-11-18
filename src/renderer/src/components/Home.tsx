import React, { useEffect, useState } from 'react'
import {
  useLogStore,
  useMessageStore,
  useNetworkStore,
  useStatusStore,
  LogStore,
  MessageStore,
  NetworkStore
} from '../store'
import { Alert, Box, TextField, Dialog, DialogContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Messages from './Messages'
import Button from '@mui/material/Button'
import { requestRegistry, getSource, allocate } from '../ipc'
import ManualMessage from './ManualMessage'
import RetrieveAudio from './RetrieveAudio'
import ManualMessageAll from "./ManualMessageAll";

const Home: React.FC = () => {
  let errorTimer: NodeJS.Timer | undefined = undefined
  const [error, setError] = useState(null)
  const [log, clearLog, loggingEnabled, setLoggingEnabled] = useLogStore((state: LogStore) => [
    state.log,
    state.clearLog,
    state.loggingEnabled,
    state.setLoggingEnabled
  ])
  const [filter, setFilter, messages] = useMessageStore((state: MessageStore) => [
    state.filter,
    state.setFilter,
    state.messages
  ])
  const [fBlock, clearFBlock, retrieveAudioModal, setRetrieveAudioModal, setManualAll, manualOpen] = useStatusStore(
    (state) => [
      state.fBlock,
      state.clearFBlock,
      state.retrieveAudioModal,
      state.setRetrieveAudioModal,
      state.setManualAll,
      state.manualOpen
    ]
  )
  const [clearFunctions] = useNetworkStore((state: NetworkStore) => [state.clearFunctions])
  const [logName, setlogName] = useState('')
  //console.log(functions)
  useEffect(() => {
    window['most'].error((_event, value: string): void => {
      setErrorData(value)
    })
    return () => {
      clearTimeout(errorTimer)
    }
  }, [])

  function setErrorData(value): void {
    if (errorTimer) {
      clearTimeout(errorTimer)
    }
    setError(value)
    errorTimer = setTimeout(() => {
      setError(null)
    }, 10000)
  }

  function setLogging(): void {
    if (loggingEnabled) {
      const blob = new Blob([log], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = logName === '' ? 'MostDump.log' : logName + '.log'
      link.href = url
      link.click()
      setLoggingEnabled(false)
      clearLog()
    } else {
      setLoggingEnabled(true)
    }
  }

  const filterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const logNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setlogName(event.target.value)
  }

  return (
    <Box sx={{ flexGrow: 0, height: '100%' }}>
      <Button variant={'outlined'} onClick={(): void => requestRegistry()}>
        Request Registry
      </Button>
      <Button variant={'outlined'} onClick={(): void => allocate()}>
        Allocate
      </Button>
      <Button variant={'outlined'} onClick={(): void => getSource()}>
        get source
      </Button>
      <Button variant={'outlined'} onClick={(): void => setLogging()}>
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
        open={fBlock !== undefined}
        onClose={(): void => {
          clearFBlock()
          clearFunctions()
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <ManualMessage fBlock={fBlock!} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={retrieveAudioModal}
        onClose={(): void => {
          setRetrieveAudioModal(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <RetrieveAudio />
        </DialogContent>
      </Dialog>
      <Dialog
        open={manualOpen}
        onClose={(): void => {
          setManualAll(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <ManualMessageAll />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Home
