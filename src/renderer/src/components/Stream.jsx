import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { MenuItem, TextField, Select, Box, Typography, Chip } from '@mui/material'
import Button from '@mui/material/Button'
import { stream } from '../ipc'
import { useState } from 'react'

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

export default function Stream({ fBlock }) {
  const [sinkNr, setSinkNr] = useState(1)

  const requestStream = () => {
    stream({sourceAddrHigh: fBlock?.targetAddressHigh, sourceAddrLow: fBlock.targetAddressLow, fBlockID: fBlock.fBlockId, instanceID: fBlock.instId, sinkNr})
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={2}>
          <TextField
            id={'sinkNr'}
            label={'Sink Number'}
            value={sinkNr}
            onChange={(event) => {
              setSinkNr(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid>
          <Box xs={12}>
            <Button variant={'outlined'} color={'secondary'} onClick={() => requestStream()}>
              stream
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
