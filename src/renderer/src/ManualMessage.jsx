import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { MenuItem, TextField, Select, Box, Typography, Chip, Dialog, DialogContent } from "@mui/material";
import Button from '@mui/material/Button'
import { sendMessage } from './ipc'
import { useState } from 'react'
import { useNetworkStore } from './Store'
import { fktIds } from './resources/DefaultMessages'
import Stream from './components/Stream'

const opTypes = {
  0x00: 'Set',
  0x01: 'Get',
  0x02: 'SetGet',
  0x03: 'Increment',
  0x04: 'Decrement',
  0x05: 'GetInterface',
  0x09: 'ErrorAck',
  0x0c: 'Status',
  0x0e: 'Interface',
  0x0f: 'Error'
}

export default function ManualMessage({ fBlock }) {
  const [bytes, setBytes] = useState({
    0: -1,
    1: -1,
    2: -1,
    3: -1,
    4: -1,
    5: -1,
    6: -1,
    7: -1,
    8: -1,
    9: -1,
    10: -1,
    11: -1
  })
  const [fktId, setFktId] = useState(0x00)
  const [opType, setOpType] = useState(null)
  const [functions, clearFunctions] = useNetworkStore((state) => [
    state.functions,
    state.clearFunctions
  ])
  const [stream, setStream] = useState(false)
  console.log(fBlock)
  const renderOpTypes = () => {
    return Object.keys(opTypes).map((key) => {
      return <MenuItem value={key}>{opTypes[key]}</MenuItem>
    })
  }

  const setByteValue = (byte, value) => {
    setBytes({ ...bytes, [byte]: value })
  }

  const sendControlMessage = (data = null) => {
    console.log('sending control message')
    let message
    if (data) {
      message = {
        targetAddressHigh: fBlock.targetAddressHigh,
        targetAddressLow: fBlock.targetAddressLow,
        fBlockID: fBlock.fBlockId,
        instanceID: fBlock.instId,
        fktId: data.fktID,
        opType: data.opType,
        data: []
      }
    } else {
      message = {
        targetAddressHigh: fBlock.targetAddressHigh,
        targetAddressLow: fBlock.targetAddressLow,
        fBlockID: fBlock.fBlockId,
        instanceID: fBlock.instId,
        fktId: parseInt(fktId),
        opType: parseInt(opType),
        data: []
      }
      for (const [key, value] of Object.entries(bytes)) {
        if (value > -1) {
          message.data.push(parseInt(value))
        }
      }
    }
    sendMessage(message)
  }

  const renderBytes = () => {
    return Object.keys(bytes).map((key) => {
      return (
        <Grid xs={1}>
          <TextField
            id={'byte' + key}
            label={'Byte ' + key}
            value={bytes[key]}
            onChange={(event) => {
              setByteValue(key, event.target.value)
            }}
            helperText={'Enter in Hex'}
          ></TextField>
        </Grid>
      )
    })
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={12}>
          <Button variant={'outlined'} onClick={() => sendControlMessage(fktIds)}>
            Get Functions
          </Button>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'target-address-high'}
            label={'Target Address High'}
            value={fBlock?.targetAddressHigh.toString(16)}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'target-address-low'}
            label={'Target Address Low'}
            value={fBlock?.targetAddressLow}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField id={'fblock-id'} label={'Fblock ID'} value={fBlock?.fBlock}></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField id={'instance-id'} label={'Instance ID'} value={fBlock?.instId}></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'function-id'}
            label={'Function ID'}
            value={fktId}
            onChange={(event) => {
              setFktId(event.target.value)
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <Select
            onChange={(event) => {
              setOpType(event.target.value)
            }}
          >
            {renderOpTypes()}
          </Select>
        </Grid>
        {renderBytes()}
        <Grid>
          <Box xs={12}>
            <Button variant={'outlined'} color={'secondary'} onClick={() => sendControlMessage(null)}>
              Send Message
            </Button>
            <Button variant={'outlined'} color={'secondary'} onClick={() => setStream(true)}>
              Stream
            </Button>
          </Box>
        </Grid>
        {functions.length > 0 ? (
          <Grid xs={12}>
            {functions.map((f) => {
              return (
                <Chip
                  label={'0x' + f.toString(16)}
                  onClick={() => setFktId('0x' + f.toString(16))}
                  key={f}
                  variant={'outlined'}
                ></Chip>
              )
            })}
          </Grid>
        ) : (
          <Grid></Grid>
        )}
      </Grid>
      <Dialog
        open={stream}
        onClose={() => {
          setStream(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <Stream fBlock={fBlock} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
