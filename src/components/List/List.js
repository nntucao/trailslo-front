import React, { useContext, useState } from 'react'
import { Paper, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
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

export default function List({ list }) {
    const classes = useStyle();
    const { deleteCard } = useContext(storeAPI);

    const handleCardDeleting = (listId, cardId) => {
        deleteCard(list.id, cardId);
    }

    return (
        <div>
            <Paper className={classes.root}>
                <CssBaseline />
                <Title title={list.name} listId={String(list.id)} />
                {/* <Droppable droppableId={String(list.id)}> */}
                {/* {(provided) => ( */}
                {/* <div { ...provided.droppableProps} ref={provided.innerRef} className={classes.cardContainer}> */}
                {list.task_cards.map((card, index) => (
                    // <Card key={card.id} card={card} index={index} >
                        <Paper className={classes.card}>{card.name}
                            <ClearIcon className={classes.clearBtn} onClick={() => handleCardDeleting(list.id, card.id)} />
                        </Paper>
                    // </Card>
                ))}
                {/* {provided.placeholder} */}
                {/* </div> */}
                {/* )} */}
                {/* </Droppable> */}
                <InputContainer listId={list.id} type='card' />
            </Paper>
        </div>
    )
}
