import React, { useContext, useState } from 'react'
import { Paper, CssBaseline, InputBase, Typography, IconButton } from '@material-ui/core'
import { makeStyles, fade } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
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
    },
    btnDashboard: {
        margin: theme.spacing(2),
        background: '#f56f54',
        color: '#fff',
        '&:hover': {
            background: fade('#f75737', 0.75)
        }
    }
}));

export default function Board({ uid }) {
    const classes = useStyle();
    const [open, setOpen] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    const [creatingBoard, setCreatingBoard] = useState('');

    const urlAPI = `https://trailslo.herokuapp.com/api/v1/`; 

    const handleOnChange = (e) => {
        setBoardTitle(e.target.value);
    };

    const handleOnClick = () => {
        //updateBoardTitle(newBoardTitle, boardId);
        //setOpen(false);
        console.log('start creating board: ')
        axios({
            method: 'post',
            responseType: 'json',
            data: {
                'board': {
                    name: boardTitle
                }
            },
            url: urlAPI + `users/${uid}/boards`,
            validateStatus: (status) => {
                return true;
            },
        })
            .then(function (response) {
                console.log('response post board request ', response);
                setCreatingBoard(response.data);
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
                            onBlur={() => setOpen(false)} />
                    </div>)
                    :
                    (<div className={classes.editableTitleContainer}>
                        <Typography onClick={setOpen(!open)} className={classes.editableTitle}>
                            {boardTitle}
                        </Typography>

                    </div>)
                }
            </Paper>
            <Button
                className={classes.btnDashboard}
                onClick={handleOnClick}>
                Send
            </Button>
            {
                creatingBoard ?
                    (<IconButton className={classes.btnDashboard}
                        component={Link}
                        // onClick={handleBtnConfirm}
                        to={{
                            pathname: '/dashboard',
                            state: {
                                board_id: creatingBoard.id
                            }
                        }}>
                        <ArrowForwardIcon /></IconButton>)
                    :
                    null
            }
        </div>
    )
}
