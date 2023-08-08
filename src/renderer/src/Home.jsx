import React, {useEffect, useState} from "react";
import {socket} from "./socket";
import {useLogStore, useMessageStore, useNetworkStore} from "./Store";
import {Alert, Box, TextField} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Messages from "./Messages";
import Button from "@mui/material/Button";
import {requestRegistry, getSource} from './ipc'


export default function Home() {
    let errorTimer = null
    const [isConnected, setIsConnected] = useState(socket.connected);
    const messages = useMessageStore(state => state.messages)
    const functions = useNetworkStore(state => state.functions)
    const [selectedFunction, setSelectedFunction] = useNetworkStore(state => [state.selectedFunction, state.setSelectedFunction])
    const [chosenType, setChosenType] = useNetworkStore(state => [state.chosenType, state.setChosenType])
    const [error, setError] = useState(null)
    const [loggingEnabled, setLoggingEnabled] = useLogStore(state => [state.loggingEnabled, state.setLoggingEnabled])
    const [log, setLog] = useLogStore(state => [state.log, state.setLog])
    const [filter, setFilter] = useMessageStore(state => [state.filter, state.setFilter])
    const [logName, setlogName] = useState('')
    //console.log(functions)
    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }



        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        // socket.on('newControlMessage', updateMessages);
        //socket.on('functionBlocks', updateRegistry);
        socket.on('error', setErrorData)
        console.log('getting interface')
        socket.emit('getInterfaces')
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            // socket.off('newControlMessage', updateMessages);
            //socket.off('functionBlocks', updateRegistry)
            socket.off('error', setErrorData)
            clearTimeout(errorTimer)
        };
    }, []);

    function setErrorData(value) {
        if(errorTimer) {
            clearTimeout(errorTimer)
        }
        setError(value)
        errorTimer = setTimeout(() => {
            setError(null)
        }, 10000)
    }

    function setLogging() {
        if(loggingEnabled) {
            const blob = new Blob([log], {type: 'text/plain'})
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.download = logName === '' ? 'MostDump.log' : logName + '.log'
            link.href = url;
            link.click()
            setLoggingEnabled(false)
            setLog('')
        } else {
            setLoggingEnabled(true)
        }
    }

    function setAuto(event) {
        socket.emit("setAuto", {type: selectedFunction, instance: chosenType})
    }

    function setDefault(event) {
        socket.emit("setDefault", {type: selectedFunction, instance: chosenType})
    }

    const filterChange= (event) => {
        console.log(event.target.value)
        setFilter(event.target.value)
    }

    const logNameChange = (event) => {
        setlogName(event.target.value)
    }


    return (
        <Box sx={{ flexGrow: 0,  height: '100%'}}>
            <Button onClick={() => requestRegistry()} >Request Registry</Button>
            <Button onClick={() => socket.emit('saveConfig')} >Save Default Registry</Button>
            <Button onClick={() => socket.emit('allocate')} >Allocate</Button>
            <Button onClick={() => getSource()} >get source</Button>
            <Button onClick={() => setLogging()} >{loggingEnabled ? 'Stop Logging' : 'Begin Logging'}</Button>
            <TextField label={'Log File Name'} value={logName} onChange={logNameChange} />
            {error ? <Alert severity="error">{error}</Alert> : <div></div>}
            <Box sx={{ flexGrow: 0, flexDirection: 'row', display: 'flex'}}>
                <Grid xs={12} container spacing={2} sx={{flexGrow: 1}}>
                    <TextField label={'FBlock ID'} value={filter} onChange={filterChange} />
                    <Messages messages={messages} />
                </Grid>
            </Box>
        </Box>
    )


}
