import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import './App.css';
import InputContainer from './components/input/InputContainer';
import List from './components/List/List';
import store from './utils/store';
import storeAPI from './utils/storeAPI';
import { DragDropContext } from 'react-beautiful-dnd';
import Navigation from './navigations/Navigation';
const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: 'green',
    width: '100%',
    overflowY: 'auto'
  }
}))
function App() {
  const classes = useStyle();
  const [data, setData] = useState(store);
  const [dataAxios, setDataAxios] = useState([]);
  //const urlAPI = 'https://trailslo.herokuapp.com/api/v1/task_lists';
  useEffect(() => {
    const getTaskLists = async () => {
      await axios.get('https://trailslo.herokuapp.com/api/v1/task_lists')
        .then((resp) => {
          const lists = resp.data.map((list) => (
            {
              id: list.id,
              is_archived: list.is_archived,
              name: list.name,
              position_in_board: list.position_in_board,
              task_cards: list.task_cards
            }
          ));
          console.log('lists after fetching: ', lists);
          setDataAxios(lists);
        })
        .catch(err => {
          console.error('error ' + err);
        });
    };
    getTaskLists();
  }, []);
  const addMoreCard = (title, listId) => {
    const newCardId = uuid();
    const newCard = {
      id: newCardId,
      name: title,
      due_date: null,
      is_archived: false,
      position_in_tasklist: ''
    };
    const listAxios = dataAxios[listId - 1]; //numerotation of list id begins with 1 otherwise the table begins with 0
    listAxios.task_cards = [...listAxios.task_cards, newCard];

    axios({
      method: 'post',
      responseType: 'json',
      data: {
        'task_card': {
          name: title,
          due_date: null,
          is_archived: false,
          position_in_tasklist: ''
        }
      },
      url: `https://trailslo.herokuapp.com/api/v1/task_lists/${listId}/task_cards`,
      validateStatus: (status) => {
        return true;
      },
    })
      .then(function (response) {
        console.log('response post card request ', response);
      })
      .catch(function (error) {
        console.log('error post card request ', error);
      });

    const newState = [...dataAxios]
    setDataAxios(newState)
  };
  const addMoreList = (title) => {
    const newListId = uuid();
    const newList = {
      id: newListId,
      is_archived: false,
      name: title,
      position_in_board: '',
      task_cards: []
    };
    axios({
      method: 'post',
      responseType: 'json',
      data: {
        'task_list': {
          board_id: 1,
          is_archived: false,
          name: title,
          position_in_board: '',
          task_cards: []
        }
      },
      url: `https://trailslo.herokuapp.com/api/v1/task_lists`,
      validateStatus: (status) => {
        return true;
      },
    })
      .then(function (response) {
        console.log('response post list request ', response);
      })
      .catch(function (error) {
        console.log('error post list request ', error);
      });

    const newState = [...dataAxios, newList]
    console.log('newState of list: ', newState)
    setDataAxios(newState);
  }
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log('destination ', destination, 'source ', source, 'draggableId ', draggableId);
    if (!destination) {
      return;
    }
    const sourceList = dataAxios[source.droppableId-1];
    console.log('sourceList', sourceList);
    const destinationList = dataAxios[destination.droppableId-1];
    console.log('destinationList', destinationList);
    console.log('sourceList.task_cards ', sourceList.task_cards);
    console.log('(sourceList.task_cards[0].id', sourceList.task_cards[0].id);
    const draggingCard = sourceList.task_cards.filter((card) => (card.id) == draggableId); 
    console.log('draggingCard', draggingCard);
    if (source.droppableId === destination.droppableId) {
      sourceList.task_cards.splice(source.index, 1);
      destinationList.task_cards.splice(destination.index, 0, draggingCard);
    }
  }
  const updateListTitle = (title, listId) => {
    const list = dataAxios[listId-1]; 
    console.log('list to update ', list);
    list.name = title;
    const newState = [...dataAxios, list]; 
    setDataAxios(newState);
    axios({
      method: 'put',
      responseType: 'json',
      data: {
        'task_list': {
          name: title
        }
      },
      url: `https://trailslo.herokuapp.com/api/v1/task_lists/${listId}`,
      validateStatus: (status) => {
        return true;
      },
    })
      .then(function (response) {
        console.log('response put request ', response);
      })
      .catch(function (error) {
        console.log('error put request ', error);
      });
  }
  return (
    
    <storeAPI.Provider value={{ addMoreCard, addMoreList, updateListTitle }}>
      <Navigation />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={classes.root}>
          {console.log('data after btn clicked: ', dataAxios)}
          {dataAxios.map(task_list => { return <List list={task_list} key={task_list.id} /> })}
          <div>
          </div>
          <InputContainer type='list' />
        </div>
      </DragDropContext>
    </storeAPI.Provider>
  );
}
export default App;