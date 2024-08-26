import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { FormControlLabel, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import { MacTerminal } from 'react-window-ui'
import { SocketMostMessageRx } from 'socketmost/dist/modules/Messages'
import Box from '@mui/material/Box'
import { useMostSettings } from '../store'
import Button from '@mui/material/Button'
import { saveSettings } from '../ipc'

interface Props {}

const Settings: React.FC<Props> = () => {
  const [settings] = useMostSettings((state) => [state])
  const [actualSettings, setActualSettings] = useState({
    nodeAddressHigh: 0x00,
    nodeAddressLow: 0x00,
    groupAddress: 0x00,
    usb: false,
    ip: '',
    manualIp: false,
    autoShutdown: false,
    jlrSwitching: false
  })

  useEffect(() => {
    setActualSettings(settings)
  }, [settings])

  const updateSettings = (key, value) => {
    setActualSettings({ ...actualSettings, [key]: value })
  }

  const setUsb = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'true') {
      setActualSettings({ ...actualSettings, usb: true })
    } else {
      setActualSettings({ ...actualSettings, usb: false })
    }
  }

  const setManualIp = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActualSettings({ ...actualSettings, manualIp: event.target.checked })
  }

  console.log('settings in view', actualSettings)
  return (
    <Grid container spacing={2} sx={{ minHeight: '80%' }}>
      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={actualSettings.usb}
          name="radio-buttons-group"
          row
          onChange={setUsb}
        >
          <FormControlLabel value={'true'} control={<Radio />} label={'Usb'} />
          <FormControlLabel value={'false'} control={<Radio />} label="Network" />
        </RadioGroup>
      </Grid>

      {actualSettings.usb ? (
        <>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="nodeAddrHigh"
              label="Node Address High"
              error={parseInt(actualSettings.nodeAddressHigh) ? false : true}
              value={actualSettings.nodeAddressHigh}
              helperText={
                parseInt(actualSettings.nodeAddressHigh) ? '' : 'Enter value as hex or decimal'
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateSettings('nodeAddressHigh', event.target.value)
              }}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="nodeAddrLow"
              label="Node Address Low"
              error={parseInt(actualSettings.nodeAddressLow) ? false : true}
              value={actualSettings.nodeAddressLow}
              helperText={
                parseInt(actualSettings.nodeAddressLow) ? '' : 'Enter value as hex or decimal'
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateSettings('nodeAddressLow', event.target.value)
              }}
            />
          </Grid>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              id="groupAddr"
              label="Group Address"
              error={parseInt(actualSettings.groupAddress) ? false : true}
              value={actualSettings.groupAddress}
              helperText={
                parseInt(actualSettings.groupAddress) ? '' : 'Enter value as hex or decimal'
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateSettings('groupAddress', event.target.value)
              }}
            />
          </Grid>
        </>
      ) : (
        <>
          <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={actualSettings.manualIp}
                  onChange={setManualIp}
                  inputProps={{ 'aria-label': 'Manual Ip' }}
                />
              }
              label="Manual Ip"
            ></FormControlLabel>
          </Grid>
          {actualSettings.manualIp ? (
            <Grid xs={8}>
              <TextField
                id={'ipAddress'}
                label={'Ip Address'}
                value={actualSettings.ip}
                error={actualSettings.ip.split('.').length === 4 ? false : true}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  updateSettings('ip', event.target.value)
                }}
              ></TextField>
            </Grid>
          ) : (
            <Grid xs={8}></Grid>
          )}
        </>
      )}

      <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={(): void => saveSettings(actualSettings)}>
          SAVE
        </Button>
      </Grid>
    </Grid>
  )
}

export default Settings
