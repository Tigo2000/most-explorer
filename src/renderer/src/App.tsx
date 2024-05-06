import React, { useEffect } from 'react'
import ResponsiveAppBar from './components/AppBar'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from '@mui/material'
import Home from './components/Home'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNetworkStore, useStatusStore } from './store'
import CssBaseline from '@mui/material/CssBaseline'
import Starting from './components/Starting'
import PersistentDrawerLeft from './components/Drawer'
import { Registry } from '../../resources/GlobalTypes'
import { getAppState } from './ipc'

const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function App(): JSX.Element {
  const [mode, setMode] = React.useState('dark')
  const appStatus = useStatusStore((state) => state['appStatus'])
  const registry: Registry = useNetworkStore((state) => state['registry'])
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: (): void => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  useEffect(() => {
    getAppState()
  }, [])

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#37474f'
          },
          secondary: {
            main: '#3f7e9d'
          }
        },
        components: {
          MuiButton: {
            styleOverrides: {
              outlined: {
                color: '#3f7e9d'
              }
            }
          }
          // MuiCssBaseline: {
          //     styleOverrides: (themeParam) => `
          //         body {
          //             overflow: hidden;
          //         }
          //     `
          // }
        }
      }),
    [mode]
  )

  const {
    mixins: { toolbar }
  } = useTheme()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100%', maxHeight: '100%' }}>
          <ResponsiveAppBar colorMode={colorMode} />
          <PersistentDrawerLeft />
          <Box
            sx={{
              height: `calc(100vh - (${toolbar?.minHeight}px + ${8}px))`,
              maxHeight: `calc(100vh - (${toolbar?.minHeight}px + ${8}px))`,
              padding: 1
            }}
          >
            {appStatus < 3 ? (
              <Starting appStatus={appStatus} />
            ) : (
              <Routes>
                <Route path={'/'} element={<Home />} />
              </Routes>
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
