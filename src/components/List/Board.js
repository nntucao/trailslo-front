import React, { useContext, useState } from 'react'
import { Paper, CssBaseline, InputBase, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios';
import { Button } from '@material-ui/core'
import Title from './Title'
import Card from './Card'
import InputContainer from '../input/InputContainer'
import { Droppable } from 'react-beautiful-dnd'
import storeAPI from '../../utils/storeAPI';
import ClearIcon from '@material-ui/icons/Clear'

const useStyle = makeStyles((theme) => ({
    root: {
        minWidth: '300px',
        background: '#EBECF0',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    cardContainer: {
        marginTop: theme.spacing(4)
    },
    card: {
        padding: theme.spacing(2, 2, 2, 2),
        margin: theme.spacing(1),
        overflow: 'auto'
    },
    clearBtn: {
        float: 'right',
        '&:hover': {
            display: 'inline'
        }
    }
}));

export default function Board({ uid }) {
    const classes = useStyle();
    const [open, setOpen] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');

    const handleOnChange = (e) => {
        setBoardTitle(e.target.value);
    };

    const handleOnBlur = () => {
        //updateBoardTitle(newBoardTitle, boardId);
        setOpen(false);
        axios({
            method: 'post',
            responseType: 'json',
            data: {
              'board': {
                name: boardTitle
              }
            },
            url: `http://localhost:3001/api/v1/users/${uid}/boards`,
            validateStatus: (status) => {
              return true;
            },
          })
            .then(function (response) {
              console.log('response post board request ', response);
            })
            .catch(function (error) {
              console.log('error post board request ', error);
            });
    }

    return (
        <div>
            <Paper className={classes.root}>
                <CssBaseline />
                <Paper>
                    Create Your Board
                </Paper>
                {open ?
                    (<div>
                        <InputBase
                            placeholder="Enter a title"
                            onChange={handleOnChange}
                            value={boardTitle}
                            inputProps={{
                                className: classes.input
                            }}
                            fullWidth
                            onBlur={handleOnBlur} />
                    </div>)
                    :
                    (<div className={classes.editableTitleContainer}>
                        <Typography onClick={setOpen(!open)} className={classes.editableTitle}>
                            {boardTitle}
                        </Typography>
                        
                    </div>)
                }
                
            </Paper>
        </div>
    )
}
