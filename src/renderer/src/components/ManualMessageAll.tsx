import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { MenuItem, TextField, Select, Box, Chip, Dialog, DialogContent, SelectChangeEvent } from "@mui/material";
import Button from '@mui/material/Button'
import { sendMessage } from '../ipc'
import { useState } from 'react'
import { useNetworkStore } from '../store'
import { fktIDs, MostMessage } from "../MostMessages";
import Stream from './Stream'
import { PartialSendMessage } from "../../../resources/GlobalTypes";

const opTypes = {
  0x00: 'Set',
  0x01: 'Get',
  0x02: 'SetGet',
  0x03: 'Increment',
  0x04: 'Decrement',
  0x05: 'GetInterface',
  0x06: 'StartResultAck',
  0x09: 'ErrorAck',
  0x0c: 'Status',
  0x0e: 'Interface',
  0x0f: 'Error'
}
interface Props {
}

interface Bytes {
  [key: number]: number | string
}

const ManualMessageAll: React.FC<Props> = () => {
  const [bytes, setBytes] = useState<Bytes>({
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
  const [fktID, setFktID] = useState('0x00')
  const [opType, setOpType] = useState('0x00')
  const [fBlockID, setFblockID] = useState('0x00')
  const [targetAddressHigh, setTargetAddressHigh] = useState('0x00')
  const [targetAddressLow, setTargetAddressLow] = useState('0x00')
  const [instanceID, setInstanceID] = useState('0x00')
  const [functions] = useNetworkStore((state) => [
    state.functions
  ])
  const [stream, setStream] = useState(false)
  const renderOpTypes = (): React.ReactElement[] => {
    return Object.keys(opTypes).map((key, index) => {
      return <MenuItem key={index} value={key}>{opTypes[key]}</MenuItem>
    })
  }

  const setByteValue = (byte, value): void => {
    setBytes({ ...bytes, [byte]: value })
  }

  const sendControlMessage = (data: MostMessage | null = null): void => {
    console.log('sending control message')
      let message = {
        targetAddressHigh: parseInt(targetAddressHigh),
        targetAddressLow: parseInt(targetAddressLow),
        fBlockID: parseInt(fBlockID),
        instanceID: parseInt(instanceID),
        fktID: parseInt(fktID),
        opType: parseInt(opType),
        data: []
      }
      console.log(bytes)
      for (const value of Object.values(bytes)) {
        if (value > -1) {
          message.data.push(parseInt(value))
        }
      }
    sendMessage(message)
  }

  const renderBytes = (): React.ReactElement[] => {
    return Object.keys(bytes).map((key, index) => {
      return (
        <Grid key={index} xs={1}>
          <TextField
            id={'byte' + key}
            label={'Byte ' + key}
            value={bytes[key]}
            onChange={(event): void => {
              setByteValue(key, event.target.value)
            }}
            helperText={'Enter in Hex'}
          ></TextField>
        </Grid>
      )
    })
  }

  const addBytes = (): void => {
    const currentBytes = Object.keys(bytes).length
    const tempBytes = {...bytes}
    for (let i = currentBytes; i < currentBytes + 11; i++) {
      tempBytes[i] = -1
    }
    setBytes(tempBytes)
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={12}>
          <Button variant={'outlined'} onClick={(): void => sendControlMessage(fktIDs)}>
            Get Functions
          </Button>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'target-address-high'}
            label={'Target Address High'}
            value={targetAddressHigh.toString(16)}
            onChange={(event): void => {
              setTargetAddressHigh(event.target.value)
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'target-address-low'}
            label={'Target Address Low'}
            value={targetAddressLow}
            onChange={(event): void => {
              setTargetAddressLow(event.target.value)
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField id={'fblock-id'} label={'Fblock ID'} value={fBlockID} onChange={(event): void => {
            setFblockID(event.target.value)
          }}></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField id={'instance-id'} label={'Instance ID'} value={instanceID} onChange={(event): void => {
            setInstanceID(event.target.value)
          }}></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'function-id'}
            label={'Function ID'}
            value={fktID}
            onChange={(event): void => {
              setFktID(event.target.value)
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <Select
            onChange={(event: SelectChangeEvent<number>): void => {
              setOpType(event.target.value as string)
            }}
          >
            {renderOpTypes()}
          </Select>
        </Grid>
        {renderBytes()}
        <Grid>
          <Box>
            <Button variant={'outlined'} color={'secondary'} onClick={(): void => sendControlMessage(null)}>
              Send Message
            </Button>
            <Button variant={'outlined'} color={'secondary'} onClick={(): void => setStream(true)}>
              Stream
            </Button>
            <Button variant={'outlined'} color={'secondary'} onClick={(): void => addBytes()}>
              Add More Bytes
            </Button>
          </Box>
        </Grid>
        {functions.length > 0 ? (
          <Grid xs={12}>
            {functions.map((f) => {
              return (
                <Chip
                  label={'0x' + f.toString(16)}
                  onClick={(): void => setFktID('0x' + f.toString(16))}
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
        onClose={(): void => {
          setStream(false)
        }}
        maxWidth={'lg'}
        fullWidth={true}
        sx={{ minHeight: '50%' }}
      >
        <DialogContent>
          <Stream fBlock={fBlockID} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ManualMessageAll
