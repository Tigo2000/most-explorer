import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { TextField, Box } from '@mui/material'
import Button from '@mui/material/Button'
import { stream } from '../ipc'
import { useState } from 'react'
import { PartialSendMessage } from "../../../resources/GlobalTypes";

interface Props {
  fBlock: PartialSendMessage
}

const Stream: React.FC<Props> = ({ fBlock }) => {
  const [sinkNr, setSinkNr] = useState(1)

  const requestStream = (): void => {
    stream({sourceAddrHigh: fBlock?.targetAddressHigh, sourceAddrLow: fBlock.targetAddressLow, fBlockID: fBlock.fBlockID, instanceID: fBlock.instanceID, sinkNr})
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={2}>
          <TextField
            id={'sinkNr'}
            label={'Sink Number'}
            value={sinkNr}
            onChange={(event): void => {
              setSinkNr(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid>
          <Box >
            <Button variant={'outlined'} color={'secondary'} onClick={(): void => requestStream()}>
              stream
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Stream
