import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

const useStyle = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2, 2, 2, 2),
        margin: theme.spacing(1)
    },
}));

export default function Card({ card, index }) {
    const classes = useStyle();
    return (
        <Draggable draggableId={String(card.id)} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} { ...provided.dragHandleProps} { ...provided.draggableProps}>
                    <Paper className={classes.card}>{card.name}</Paper>
                </div>
            )}
        </Draggable>
    );
}