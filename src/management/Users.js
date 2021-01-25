import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';

function Users() {
    const idEmailsDic = {};  

    //const urlAPI = `https://trailslo.herokuapp.com/api/v1/`;
    const urlLocal = `http://localhost:3001/api/v1/`;

    useEffect(() => {
        console.log('useEffect is called: ');
        const getUsers = async () => {
            await axios.get(urlLocal + `users`)
                .then((resp) => {
                    resp.data.map((user) => (
                        idEmailsDic[user.id] = user.email
                    ));
                    localStorage.setItem("idEmailsDicData", JSON.stringify(idEmailsDic));
                })
                .catch(err => {
                    console.error('error ' + err);
                });
        };
        getUsers();
    }, []);                                 

    return (
        <div>
        </div>
    )

}

export default Users;