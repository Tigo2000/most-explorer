import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { TextField, Box } from '@mui/material'
import Button from '@mui/material/Button'
import { disconnectSource } from '../ipc'
import { useState } from 'react'
import { PartialSendMessage } from "../../../resources/GlobalTypes";

interface Props {
  fBlock: PartialSendMessage
}

const SourceDisconnect: React.FC<Props> = ({ fBlock }) => {
  const [sourceNr, setSourceNr] = useState(1)

  const requestSourceConnect = (): void => {
    disconnectSource({sourceAddrHigh: fBlock?.targetAddressHigh, sourceAddrLow: fBlock.targetAddressLow, fBlockID: fBlock.fBlockID, instanceID: fBlock.instanceID, sourceNr})
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={2}>
          <TextField
            id={'sinkNr'}
            label={'Sink Number'}
            value={sourceNr}
            onChange={(event): void => {
              setSourceNr(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid>
          <Box >
            <Button variant={'outlined'} color={'secondary'} onClick={(): void => requestSourceConnect()}>
              Connect
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SourceDisconnect
