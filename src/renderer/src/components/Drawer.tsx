import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Drawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { StatusStore, useNetworkStore, useStatusStore } from '../store'
import { ListSubheader } from '@mui/material'
import { Registry } from '../../../resources/GlobalTypes'

const drawerWidth = 240

type OpenProp = {
  open: boolean
}

// @ts-ignore not sure why forwarding prop not forwarding to type
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<OpenProp>(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
)

// @ts-ignore not sure why forwarding prop not forwarding to type
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<OpenProp>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

const PersistentDrawerLeft: React.FC = () => {
  const theme = useTheme()
  const [open, setOpen, setFBlock] = useStatusStore((state: StatusStore) => [
    state.open,
    state.setOpen,
    state.setFBlock
  ])
  const registry: Registry = useNetworkStore((state) => state.registry)

  const handleDrawerClose = (): void => {
    setOpen(false)
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />

      {Object.keys(registry).map((text, index) => (
        <List
          key={index}
          subheader={
            <ListSubheader component={'div'} id={text}>
              {text}
            </ListSubheader>
          }
        >
          {registry[text].map((text2) => (
            <ListItem key={text + '_' + text2.address + '_' + text2.instanceID} disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={`Addr: 0x${text2.address.toString(16)} inst: 0x${text2.instanceID.toString(
                    16
                  )}`}
                  onClick={(): void => {
                    setFBlock({
                      targetAddress: text2.address,
                      fBlock: text,
                      instanceID: text2.instanceID,
                      fBlockID: text2.fBlockID
                    })
                    setOpen(false)
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ))}
    </Drawer>
  )
}

export default PersistentDrawerLeft
