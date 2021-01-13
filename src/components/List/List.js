import React from 'react'
import { Paper, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Title from './Title'
import Card from './Card'
import InputContainer from '../input/InputContainer'
import { Droppable } from 'react-beautiful-dnd'

const useStyle = makeStyles((theme) => ({
    root: {
        minWidth: '300px',
        background: '#EBECF0',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    cardContainer: {
        marginTop: theme.spacing(4)
    }
}));

export default function List({ list }) {
    const classes = useStyle();

    return (
        <div>
            <Paper className={classes.root}>
                <CssBaseline />
                <Title title={list.name} listId={String(list.id)} />
                <Droppable droppableId={String(list.id)}>
                    {(provided) => (
                        <div { ...provided.droppableProps} ref={provided.innerRef} className={classes.cardContainer}>
                            {list.task_cards.map((card, index) => (
                                <Card key={card.id} card={card} index={index} ></Card>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <InputContainer listId={list.id} type='card' />
            </Paper>
        </div>
    )
}
