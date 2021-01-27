import React, { useState } from 'react';
import { Collapse, Button, InputBase, Paper, Typography, IconButton } from '@material-ui/core'
import axios from 'axios';
import Dashboard from '../Dashboard'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import { makeStyles, fade } from '@material-ui/core/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import storeAPI from '../utils/storeAPI';
import { v4 as uuid } from 'uuid';
import Board from '../components/List/Board';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import InputContainer from '../components/input/InputContainer';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const clientId =
  '628527638852-jv08cufh46kjretiuvb70n4cmrdptfr1.apps.googleusercontent.com';

const useStyles = makeStyles((theme) => ({
  boardsSpace: {
    margin: theme.spacing(2)
  },
  btnDashboard: {
    margin: theme.spacing(2),
    background: '#f56f54',
    color: '#fff',
    '&:hover': {
      background: fade('#f75737', 0.75)
    }
  },
  card: {
    width: '230px',
    margin: theme.spacing(0, 1, 1, 1),
    paddingBottom: theme.spacing(4),
    background: '#e0aba0'
  },
  input: {
    margin: theme.spacing(2)
  },
  addBoard: {
    padding: theme.spacing(2, 2, 2, 3),
    margin: theme.spacing(0, 2, 2, 1),
    background: '#ff795c',
    '&:hover': {
      backgroundColor: fade('#e6725a', 0.25)
    }
  },
  btnConfirm: {
    background: '#f56f54',
    color: '#fff',
    '&:hover': {
      background: fade('#f75737', 0.75)
    }
  },
  confirmDiv: {
    margin: theme.spacing(1, 2, 2, 2)
  }
}));

export default function Login() {
  const classes = useStyles();
  const [userBoards, setUserBoards] = useState([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [boardTitle, setBoardTitle] = useState('');
  const [openInput, setOpenInput] = useState(false);
  const [redirectToDashBoard, setRedirectToDashBoard] = useState(true);

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    // alert(
    //   `Logged in successfully welcome ${res.profileObj.name} 😍. \n`
    // );
    var storedEmailsData = JSON.parse(localStorage["idEmailsDicData"]);
    if (Object.values(storedEmailsData).includes(res.profileObj.email)) {
      const idUser = Object.keys(storedEmailsData).find(key => storedEmailsData[key] === res.profileObj.email);
      setUserId(idUser);
      localStorage.setItem('idUser', idUser);
      //retrieveUser(idUser); 
      setUserName(res.profileObj.name);
      retrieveUserBoards(idUser);
    } else {
      createUser(res.profileObj.email);
    }

    //refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login 😢`
    );
  };

  const retrieveUser = async (idUser) => {
    console.log('start retrieving user: ', idUser);
    await axios.get(`http://localhost:3001/api/v1/users/${idUser}`)
      .then((resp) => {
        const user =
        {
          id: resp.data.id,
          email: resp.data.email,
          googleId: resp.data.googleId
        }
        console.log('user retrieved: ', user);
      })
      .catch(err => {
        console.error('error ' + err);
      });
  };

  const retrieveUserBoards = async (idUser) => {
    console.log('start retrieving user boards:  ', idUser);
    await axios.get(`http://localhost:3001/api/v1/users/${idUser}/boards`)
      .then((resp) => {
        const boards = resp.data.map((board) => (
          {
            id: board.id,
            name: board.name,
            is_archived: board.is_archived,
            user_id: board.user_id
          }
        ));
        console.log('user boards retrieved: ', boards);
        setUserBoards(boards);
      })
      .catch(err => {
        console.error('error ' + err);
      });
  };

  const handleOnChange = (e) => {
    (
      setBoardTitle(e.target.value)
    )
  }

  const createUser = (email) => {
    console.log('start creating user: ');
    axios({
      method: 'post',
      responseType: 'json',
      data: {
        'user': {
          email: email
        }
      },
      url: `http://localhost:3001/api/v1/users`,
      validateStatus: (status) => {
        return true;
      },
    })
      .then(function (response) {
        console.log('response post user request ', response);
        console.log('response.data.id', response.data.id);
        setUserId(response.data.id);
        localStorage.setItem('idUser', response.data.id);
      })
      .catch(function (error) {
        console.log('error post user request ', error);
      });
  };

  const handleBtnConfirm = () => {
    // if (type === 'card') {
    //     addMoreCard(title, listId);
    //     setTitle('');
    //     setOpen(false);
    // } else {
    //     addMoreList(title);
    //     setTitle('');
    //     setOpen(false);
    // }
    addBoard();
    setBoardTitle('');
    setOpenInput(false);
  }

  const addBoard = () => {
    console.log('start creating board: ');
    
  }

  return (
    <storeAPI.Provider value={{ addBoard }}>
      <div>
        <div>
          <Router>
            <Switch>
              {/* <Route exact path='/' component={App} ></Route> */}
              <Route path='/dashboard/:board_id' component={Dashboard}></Route>
            </Switch>
          </Router>
        </div>
        <div>
          {userId ? null :
            <GoogleLogin
              clientId={clientId}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              // cookiePolicy={'single_host_origin'}
              style={{ marginTop: '100px' }}
              isSignedIn={true}
            />
          }
          {
            userName ?
              <div>
                < Typography variant="h5" className={classes.boardsSpace}>Welcome {userName}</Typography>
              </div>
              :
              null
          }
          <div>
            {console.log('boards while entering login: ', userBoards)}
            {
              (userBoards.length > 0) ?
                (userBoards.map((board) => (
                  <nav>
                    <ul>
                      {console.log("board: ", board)}
                      <Button component={Link} className={classes.boardsSpace} variant="contained" color="primary"
                        to={{
                          pathname: '/dashboard',
                          state: {
                            board_id: board.id
                          }
                        }}>{board.name}
                      </Button>
                    </ul>
                  </nav>
                )))
                :
                (
                  // <Button
                  //   component={Link}
                  //   className={classes.boardsSpace}
                  //   variant="contained" color="primary"
                  //   to={{
                  //     pathname: '/dashboard',
                  //   }}>
                  //   Create New Board
                  // </Button>
                  <div>
                    <Board name={boardTitle} uid={userId} /> 
                    
                  </div>
                )
            }
          </div>
        </div >
      </div >
    </storeAPI.Provider>
  );
}

