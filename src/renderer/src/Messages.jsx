import React, {useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {Box} from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {Typography} from "@mui/material";
import { MacTerminal } from "react-window-ui";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Messages({messages}) {

    const renderFunctions= () => {
        console.log(messages)
        let m = messages.map(f => <Grid container spacing={1} columns={40}>
            <Grid xs={5}>
                <Typography style={{color: '#2596be', display: 'inline'}}>FBlockID: </Typography>
                <Typography style={{color: '#2596be', display: 'inline'}}>{d2h(f.fBlockID)}</Typography>
            </Grid>
            <Grid xs={5}>
                <Typography style={{color: '#2596be', display: 'inline'}}>InstanceID: </Typography>
                <Typography style={{color: '#2596be', display: 'inline'}}>{d2h(f.instanceID)}</Typography>
            </Grid>
            <Grid xs={5}>
                <Typography style={{color: '#2596be', display: 'inline'}}>FktID: </Typography>
                <Typography style={{color: '#2596be', display: 'inline'}}>{d2h(f.fktID)}</Typography>
            </Grid>
            <Grid xs={5}>
                <Typography style={{color: '#2596be', display: 'inline'}}>OpType: </Typography>
                <Typography style={{color: '#2596be', display: 'inline'}}>{d2h(f.opType)}</Typography>
            </Grid>
            <Grid xs={7}>
                <Typography style={{color: '#2596be', display: 'inline'}}>SourceAddress: </Typography>
                <Typography style={{color: '#2596be', display: 'inline'}}>{d2h(f.sourceAddrHigh)}{d2h(f.sourceAddrLow)}</Typography>
            </Grid>
            <Grid xs={13}>
                <Typography style={{color: '#2596be', display: 'inline'}}>Data: </Typography>
                <Typography style={{color: '#2596be', display: 'inline'}}>{f.data.slice(0).map(d => d2h(d))}</Typography>
            </Grid>
        </Grid>)
        return m.length > 100 ? m.slice(0, 100) : m
    }

    const d2h = (d) => {
        var h = (d).toString(16);
        return h.length % 2 ? '0' + h : h;
    }

    return(
        <Grid xs={12}>
            <MacTerminal style={{flexGrow: 1}}>
                {renderFunctions()}
            </MacTerminal>
        </Grid>
    )
}
