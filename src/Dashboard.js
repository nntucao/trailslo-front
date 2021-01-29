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
import TopBar from './navigations/TopBar';
import { useLocation } from "react-router-dom";
import { Droppable } from 'react-beautiful-dnd'

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#ff795c',
    width: '100%',
    overflowY: 'auto'
  }
}))

function Dashboard() {
  const classes = useStyle();
  const [dataAxios, setDataAxios] = useState([]);
  let dataFromLogin = useLocation();
  let board_id = dataFromLogin.state.board_id;
  const userId = localStorage.getItem('idUser');

  //const [userId, setGoogleUser] = localStorage.getItem('userId'); 

  //const urlAPI = `https://trailslo.herokuapp.com/api/v1/users/${userId}/boards/${board_id}/`;
  const urlLocal = `http://localhost:3001/api/v1/users/${userId}/boards/${board_id}/`;

  useEffect(() => {
    console.log('now go to dashboard: ')
    console.log('localStorage in Dashboard: ', localStorage);
    const getTaskLists = async () => {
      await axios.get(urlLocal + `task_lists`)
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
          console.log('link: ', urlLocal + `task_lists`);
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
    console.log('card id in addCard: ', newCard.id)
    console.log('dataAxios in addCard: ', dataAxios)
    console.log('listId in addCard: ', listId);
    const listAxios = dataAxios.filter(e => e.id === listId)[0];
    console.log('listAxios: ', listAxios);
    listAxios.task_cards = [...listAxios.task_cards, newCard];

    axios({
      method: 'post',
      responseType: 'json',
      data: {
        'task_card': {
          task_list_id: listId,
          name: title,
          due_date: null,
          is_archived: false,
          position_in_tasklist: ''
        }
      },
      url: urlLocal + `task_lists/${listId}/task_cards`,
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
          board_id: board_id,
          is_archived: false,
          name: title,
          position_in_board: '',
          task_cards: []
        }
      },
      url: urlLocal + `task_lists`,
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
    const { destination, source, draggableId, type } = result;
    console.log('destination ', destination, 'source ', source, 'draggableId ', draggableId);
    if (!destination) {
      return;
    }
    
    const sourceList = dataAxios.filter(e => (e.id) == source.droppableId)[0];
    const destinationList = dataAxios.filter(e => e.id == destination.droppableId)[0];

    if (type === 'list') {
      const indexSourceList = dataAxios.indexOf(sourceList);
      const indexDestinationList = dataAxios.indexOf(destinationList);
      dataAxios[indexSourceList] = sourceList;
      dataAxios[indexDestinationList] = sourceList;
      const newState = [...dataAxios];
      console.log('new state after switching: ', newState);
      setDataAxios(newState);
      return;
    }

    console.log('sourceList', sourceList);
    console.log('destinationList', destinationList);

    const draggingCard = sourceList.task_cards.filter((card) => (card.id) == draggableId)[0];
    console.log('draggingCard name, id ', draggingCard.name, draggingCard.id);

    if (source.droppableId === destination.droppableId) {
      sourceList.task_cards.splice(source.index, 1);
      console.log('draggingCard while splice name, id ', draggingCard.name, draggingCard.id);
      destinationList.task_cards.splice(destination.index, 0, draggingCard);

      // console.log('index of source list: ', dataAxios.indexOf(sourceList));
      const indexSourceList = dataAxios.indexOf(sourceList);
      dataAxios[indexSourceList] = destinationList;
      const newState = [...dataAxios];
      setDataAxios(newState);
    } else {
      sourceList.task_cards.splice(source.index, 1); 
      destinationList.task_cards.splice(destination.index, 0, draggingCard); 

      const indexSourceList = dataAxios.indexOf(sourceList);
      const indexDestinationList = dataAxios.indexOf(destinationList);
      dataAxios[indexSourceList] = sourceList;
      dataAxios[indexDestinationList] = destinationList;
      const newState = [...dataAxios];
      console.log('new state after switching: ', newState);
      setDataAxios(newState);
    }


  }

  const updateListTitle = (title, listId) => {
    dataAxios[listId - 1].name = title;
    const newState = [...dataAxios];
    setDataAxios(newState);
    axios({
      method: 'put',
      responseType: 'json',
      data: {
        'task_list': {
          name: title
        }
      },
      url: urlLocal + `task_lists/${listId}`,
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
  const deleteCard = (listId, cardId) => {
    const listAxios = dataAxios.filter(e => e.id === listId)[0];
    console.log('listAxios in deleteCard: ', listAxios)
    listAxios.task_cards = listAxios.task_cards.filter((card) => card.id !== cardId);
    const newState = [...dataAxios];
    setDataAxios(newState);

    axios({
      method: 'delete',
      responseType: 'json',
      url: urlLocal + `task_lists/${listId}/task_cards/${cardId}`,
      validateStatus: (status) => {
        return true;
      },
    })
      .then(function (response) {
        console.log('response delete card request ', response);
      })
      .catch(function (error) {
        console.log('error delete card request ', error);
      });
  }

  return (
    <storeAPI.Provider value={{ addMoreCard, addMoreList, updateListTitle, deleteCard }}>
      <TopBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard" type='list' direction='horizontal'>
          {(provided) => (
            <div 
            className={classes.root} 
            ref={provided.innerRef}
            {...provided.droppableProps}>
              {console.log('data after btn clicked: ', dataAxios)}
              {dataAxios.map((task_list, index) => { return <List list={task_list} key={task_list.id} index={index} /> })}
              <div>
              </div>
              <InputContainer type='list' />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </storeAPI.Provider>
  );
}
export default Dashboard;