import React, { useContext, useState } from 'react';
import axios from 'axios';
import Dashboard from '../Dashboard'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import { Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';

const clientId =
  '628527638852-jv08cufh46kjretiuvb70n4cmrdptfr1.apps.googleusercontent.com';

const useStyles = makeStyles((theme) => ({
  boardsSpace: {
    margin: theme.spacing(2)
  }
}));

export default function Login() {
  const classes = useStyles();
  const [userBoards, setUserBoards] = useState([]);
  const [userId, setUserId] = useState('');

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n`
    );
    var storedEmailsData = JSON.parse(localStorage["idEmailsDicData"]);
    if (Object.values(storedEmailsData).includes(res.profileObj.email)) {
      const idUser = Object.keys(storedEmailsData).find(key => storedEmailsData[key] === res.profileObj.email);
      setUserId(idUser);
      localStorage.setItem('userId', userId);
      console.log(localStorage);
      //retrieveUser(idUser); 
      retrieveUserBoards(idUser);
    } else {
      createUser(res.profileObj.email);
      
    }

    refreshTokenSetup(res);
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
            uid: board.uid
          }
        ));
        console.log('user boards retrieved: ', boards);
        setUserBoards(boards);
      })
      .catch(err => {
        console.error('error ' + err);
      });
  };

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
        setUserId(response.data.id);
      })
      .catch(function (error) {
        console.log('error post user request ', error);
      });
  }

  const chooseToCreateBoards = () => {
   
  }

  return (
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
            cookiePolicy={'single_host_origin'}
            style={{ marginTop: '100px' }}
            isSignedIn={true}
          />
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
                <Button
                  component={Link}
                  className={classes.boardsSpace}
                  variant="contained" color="primary"
                  to={{
                    pathname: '/dashboard',
                  }}>
                  Create New Board
                </Button>
              )
          }
        </div>
      </div>
    </div>
  );
}

