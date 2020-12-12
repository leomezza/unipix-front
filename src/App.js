import React, { useState } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import NavigationBar from './components/navigationbar/NavigationBar';
import PixList from './components/pix/PixList';
// import PixDetails from './components/pix/PixDetails';
import EditPix from './components/pix/EditPix';

import localStorageUtils from './utils/localStorage.utils';
import apiServices from '../src/services/api.service';

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(() => {
    const token = localStorageUtils.get();
    return !!token;
  });

  const [addPixModalShow, setAddPixModalShow] = useState(false);
  const [listPix, setListPix] = useState([]);

  const getListPix = async (type) => {
    try {
      let pix = [];

      if (type === '1') {
        pix = await apiServices.getMyPix();
      } else if (type === '2') {
        pix = await apiServices.get3PPix();
      };
      //console.log(pix);
      setListPix(pix);
      //console.log(pix);

    } catch (error) {
      console.log(error);
    }
  };
  //console.log(listPix);

  const changeUserAuthStatus = (status) => {
    setIsUserAuthenticated(status);
  };

  const logoutUser = () => {
    localStorageUtils.delete();

    changeUserAuthStatus(false);
  };

  return (
    <div className="App">
      <NavigationBar 
        isUserAuth={isUserAuthenticated}
        logoutUser={logoutUser}
        isAddPixShown={addPixModalShow}
        showAddPix={setAddPixModalShow}
        getListPix={getListPix}
      />

      <Switch>
        {/* Rotas Publicas */}
        <Route
          exact
          path="/"
          render={(props) => (
            <Login {...props} changeUserAuthStatus={changeUserAuthStatus} />
          )}
        />
        <Route exact path="/signup" component={Signup} />

        {/* Rotas Privadas */}
        {isUserAuthenticated ? (
          <Route exact path="/pix/:id" render={(props) => <PixList {...props} getListPix={getListPix} listPix={listPix} />} />
        ) : (
            <Redirect to="/" />
          )}
        {isUserAuthenticated ? (
          <Route exact path="/editpix/:id" component={EditPix} />
        ) : (
            <Redirect to="/" />
          )}
      </Switch>
    </div>
  );
}

export default App;
