import React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Typography } from '@mui/material'
import { MacTerminal } from 'react-window-ui'
import { SocketMostMessageRx } from 'socketmost/dist/modules/Messages'

interface Props {
  messages: SocketMostMessageRx[]
}

const Messages: React.FC<Props> = ({ messages }) => {
  const renderFunctions = (): React.ReactElement[] => {
    const m = messages.map((f, index) => (
      <Grid key={index} container spacing={1} columns={40}>
        <Grid xs={5}>
          <Typography style={{ color: '#2596be', display: 'inline' }}>FBlockID: </Typography>
          <Typography style={{ color: '#2596be', display: 'inline' }}>{d2h(f.fBlockID)}</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography style={{ color: '#2596be', display: 'inline' }}>InstanceID: </Typography>
          <Typography style={{ color: '#2596be', display: 'inline' }}>
            {d2h(f.instanceID)}
          </Typography>
        </Grid>
        <Grid xs={5}>
          <Typography style={{ color: '#2596be', display: 'inline' }}>FktID: </Typography>
          <Typography style={{ color: '#2596be', display: 'inline' }}>{d2h(f.fktID)}</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography style={{ color: '#2596be', display: 'inline' }}>OpType: </Typography>
          <Typography style={{ color: '#2596be', display: 'inline' }}>{d2h(f.opType)}</Typography>
        </Grid>
        <Grid xs={7}>
          <Typography style={{ color: '#2596be', display: 'inline' }}>SourceAddress: </Typography>
          <Typography style={{ color: '#2596be', display: 'inline' }}>
            {d2h(f.sourceAddrHigh)}
            {d2h(f.sourceAddrLow)}
          </Typography>
        </Grid>
        <Grid xs={13}>
          <Typography style={{ color: '#2596be', display: 'inline' }}>Data: </Typography>
          <Typography style={{ color: '#2596be', display: 'inline' }}>
            {f.data.slice(0).map((d) => d2h(d))}
          </Typography>
        </Grid>
      </Grid>
    ))
    return m.length > 100 ? m.slice(0, 100) : m
  }

  const d2h = (d): number => {
    const h = d.toString(16)
    return h.length % 2 ? '0' + h : h
  }

  return (
    <Grid xs={12}>
      <MacTerminal style={{ flexGrow: 1 }}>{renderFunctions()}</MacTerminal>
    </Grid>
  )
}

export default Messages
