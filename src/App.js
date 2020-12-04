import React, { useState } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Navbar from './components/navbar/Navbar';
import PixList from './components/pix/PixList';
// import PixDetails from './components/pix/PixDetails';
import EditPix from './components/pix/EditPix';

import localStorageUtils from './utils/localStorage.utils';

function App() {

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(() => {
    const token = localStorageUtils.get();
    return !!token;
  });

  const changeUserAuthStatus = (status) => {
    setIsUserAuthenticated(status);
  };

  const logoutUser = () => {
    localStorageUtils.delete();

    changeUserAuthStatus(false);
  };

  return (
    <div className="App">
      <Navbar isUserAuth={isUserAuthenticated} logoutUser={logoutUser} />

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
          <Route exact path="/pix" component={PixList} />
        ) : (
          <Redirect to="/" />
        )}
        {isUserAuthenticated ? (
          <Route exact path="/pix/:id" component={EditPix} />
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    </div>
  );
}

export default App;
