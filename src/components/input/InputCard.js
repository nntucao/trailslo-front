import { Button, InputBase, Paper, IconButton } from '@material-ui/core'
import { makeStyles, fade } from '@material-ui/core/styles'
import React, { useContext, useState } from 'react'
import storeAPI from '../../utils/storeAPI';
import ClearIcon from '@material-ui/icons/Clear'

const useStyle = makeStyles((theme) => ({
    card: {
        width: '280px',
        margin: theme.spacing(0, 1, 1, 1),
        paddingBottom: theme.spacing(4)
    },
    input: {
        margin: theme.spacing(2)
    },
    btnConfirm: {
        background: 'green',
        color: '#fff',
        '&:hover': {
            background: fade('#5AAC44', 0.75)
        }
    },
    confirmDiv: {
        margin: theme.spacing(1, 2, 2, 2)
    }
}));

export default function InputCard({ setOpen, listId, type }) {
    const classes = useStyle();
    const { addMoreCard, addMoreList } = useContext(storeAPI);
    const [title, setTitle] = useState('');

    const handleOnChange = (e) => {
        (
            setTitle(e.target.value)
        )
    }

    const handleBtnConfirm = () => {
        if (type === 'card') {
            addMoreCard(title, listId);
            setTitle('');
            setOpen(false);
        } else {
            addMoreList(title);
            setTitle('');
            setOpen(false);
        }
    }

    return (
        <div>
            <div>
                <Paper className={classes.card}>
                    <InputBase
                        multiline fullWidth
                        onChange={handleOnChange}
                        inputProps={{ className: classes.input }}
                        placeholder={type === 'card' ? 'Enter a title of this card' : 'Enter a title'}
                        onBlur={()=>setOpen(false)}
                        value={title} />
                    
                </Paper>
            </div>
            <div className={classes.confirmDiv}>
                <Button className={classes.btnConfirm}
                    onClick={handleBtnConfirm}>
                    {type === 'card' ? 'Add a card' : 'Add a list'}</Button>
                <ClearIcon onClick={() => setOpen(false)}>  </ClearIcon>
            </div>
        </div>
    )
}
