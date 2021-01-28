import { Paper, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import storeAPI from '../../utils/storeAPI';
import ClearIcon from '@material-ui/icons/Clear'

const useStyle = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2, 2, 2, 2),
        margin: theme.spacing(1), 
        overflow: 'auto'
    },
    clearBtn: {
        float: 'right'
    }
}));

export default function Card({ card, index }) {
    const classes = useStyle();
    const { deleteCard } = useContext(storeAPI);

    const handleCardDeleting = (card) => {
        deleteCard(card);
     }

    return (
        <div></div>
        // <Draggable draggableId={String(card.id)} index={index}>
        //     {(provided) => (
        //         <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
        //             <Paper className={classes.card}>{card.name}
        //                 <ClearIcon className={classes.clearBtn} onClick={handleCardDeleting} />
        //             </Paper>
        //         </div>

        //     )}
        // </Draggable>
    )
}