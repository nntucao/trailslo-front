import { Collapse, Paper, Typography } from '@material-ui/core'
import { makeStyles, fade } from '@material-ui/core/styles'
import React, { useState } from 'react'
import InputCard from './InputCard'

const useStyle = makeStyles((theme) => ({
    root: {
        width: '300px',
        marginTop: theme.spacing(2)
    },
    addCard: {
        padding: theme.spacing(2, 2, 2, 3),
        margin: theme.spacing(0, 2, 2, 1),
        background: '#EBECF0',
        '&:hover': {
            backgroundColor: fade('#000', 0.25)
        }
    }
}));

export default function InputContainer({ listId, type }) {
    const classes = useStyle()
    const [open, setOpen] = useState(false)
    return (
        <div className={classes.root}>
            <Collapse in={open}>
                <InputCard setOpen={setOpen} listId={listId} type={type} />
            </Collapse>
            <Collapse in={!open}>
                <Paper className={classes.addCard} elevation={0} onClick={() => setOpen(!open)}>
                    <Typography>{type === 'card' ? '+ Add a Card' : '+ Add a List'} </Typography>
                </Paper>
            </Collapse>
        </div>
    )
}
