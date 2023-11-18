import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { TextField, Box } from '@mui/material'
import Button from '@mui/material/Button'
import { retrieveAudio } from '../ipc'
import { useState } from 'react'

const RetrieveAudio: React.FC = () => {
  const [byte1, setByte1] = useState(-1)
  const [byte2, setByte2] = useState(-1)
  const [byte3, setByte3] = useState(-1)
  const [byte4, setByte4] = useState(-1)

  const retrieveAudioClick = (): void => {
    console.log("retrieve audio button clicked")
    const bytes = [byte1, byte2]
    byte3 > -1 ? bytes.push(byte3) : null
    byte4 > -1 ? bytes.push(byte4) : null
    retrieveAudio(bytes)
  }

  return (
    <Box sx={{ minHeight: '50%' }}>
      <Grid container spacing={2} sx={{ minHeight: '100%' }}>
        <Grid xs={2}>
          <TextField
            id={'sinkNr1'}
            label={'Sink Byte 1'}
            value={byte1}
            onChange={(event): void => {
              setByte1(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'sinkNr2'}
            label={'Sink Byte 2'}
            value={byte2}
            onChange={(event): void => {
              setByte2(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'sinkNr3'}
            label={'Sink Byte 3'}
            value={byte3}
            onChange={(event): void => {
              setByte3(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid xs={2}>
          <TextField
            id={'sinkNr4'}
            label={'Sink Byte 4'}
            value={byte4}
            onChange={(event): void => {
              setByte4(parseInt(event.target.value))
            }}
          ></TextField>
        </Grid>
        <Grid>
          <Box>
            <Button variant={'outlined'} color={'secondary'} onClick={(): void => retrieveAudioClick()}>
              stream
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RetrieveAudio
