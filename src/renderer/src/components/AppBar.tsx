import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MenuIcon from '@mui/icons-material/Menu'
import SendIcon from '@mui/icons-material/Send'
import { Apps, Mic } from "@mui/icons-material";
import { useStatusStore } from '../store'

const pages = [{ name: 'Most Explorer', url: 'MostExplorer' }]
interface Props {
  colorMode: {
    toggleColorMode: () => void
  }
}
const ResponsiveAppBar: React.FC<Props> = ({ colorMode }) => {
  const [open, setOpen, retrieveAudioModal, setRetrieveAudioModal, setManualAll] = useStatusStore((state) => [state.open, state.setOpen, state.retrieveAudioModal, state.setRetrieveAudioModal, state.setManualAll])
  const nav = useNavigate()
  const theme = useTheme()

  return (
    <AppBar position="sticky" sx={{ height: '56px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}></Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.url}
                component={Link}
                to={`/${page.url}`}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={(): void => setRetrieveAudioModal(!retrieveAudioModal)} color="inherit">
              <Mic />
            </IconButton>
          </Box>
          <Box>
            <Apps fontSize={'large'} onClick={(): void => nav('/Launcher')} />
          </Box>
          <Box>
            {theme.palette.mode} mode
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={(): void => setManualAll(true)} color="inherit">
              <SendIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton sx={{ ml: 1 }} onClick={(): void => setOpen(!open)} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
