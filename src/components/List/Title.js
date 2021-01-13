import React, { useContext, useState } from 'react'
import { InputBase, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import storeAPI from '../../utils/storeAPI';

const useStyle = makeStyles((theme) => ({
    editableTitle: {
        flexGrow: 1,
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    editableTitleContainer: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        margin: theme.spacing(2),
        display: 'flex'
    },
    input: {
        margin: theme.spacing(1),
        '&:focus': {
            background: '#ddd',
        }
    }
}));

export default function Title({ title, listId }) {
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const { updateListTitle } = useContext(storeAPI);
    const classes = useStyle();

    const handleOnChange = (e) => {
        setNewTitle(e.target.value);
    };
    const handleOnBlur = () => {
        updateListTitle(newTitle, listId);
        setOpen(false);
    }
    return (
        <div>
            { open ?
                (<div>
                    <InputBase
                        onChange={handleOnChange}
                        value={newTitle}
                        inputProps={{
                            className: classes.input
                        }}
                        fullWidth
                        onBlur={handleOnBlur} />
                </div>)
                :
                (<div className={classes.editableTitleContainer}>
                    <Typography onClick={setOpen(!open)} className={classes.editableTitle}>
                        {title}
                    </Typography>
                    <MoreHorizIcon />
                </div>)
            }

        </div>

    )
}