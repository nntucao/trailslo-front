import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar } from '@material-ui/core';

import SideMenu from './SideMenu';

const useStyles = makeStyles((theme) => ({
    AppBar: {
        background: 'green'
    },
    title: {
        flexGrow: 1
    },
    userBtn: {
        color: '#fff',
        background: '#000'
    }
}));

export default function TopBar({ setOpenSideMenu }) {
    const classes = useStyles();
    return (
        <div>
            <AppBar position='static' className={classes.AppBar} elevation={0}>
                <Toolbar>
                    <h1 className={classes.title}>Trailslo</h1>
                    {/* <Button className={classes.userBtn} onClick={()=>setOpenSideMenu(true)}>User</Button> */}
                    <SideMenu />
                </Toolbar>
            </AppBar>
        </div>
    )
}
