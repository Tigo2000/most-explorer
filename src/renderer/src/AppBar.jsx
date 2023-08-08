import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import {Link, useNavigate} from "react-router-dom";
import { useTheme, ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ReplyIcon from '@mui/icons-material/Reply'
import {Apps} from "@mui/icons-material";
import {useStatusStore} from "./Store";

const pages = [{name: 'Most Explorer', url:'MostExplorer'}];
function ResponsiveAppBar({colorMode}) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [open, setOpen] = useStatusStore((state) => [state.open, state.setOpen])
    const nav = useNavigate()
    const theme = useTheme();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

    return (
        <AppBar position="sticky" sx={{height: '56px'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>

                    </Box>
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
                        <Apps fontSize={'large'} onClick={() => nav('/Launcher')} />
                    </Box>
                    <Box >
                        {theme.palette.mode} mode
                        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Box>
                    <Box >
                        <IconButton sx={{ ml: 1 }} onClick={() => setOpen(!open)} color="inherit">
                            <ReplyIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
