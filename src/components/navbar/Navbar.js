import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import logo from '../../UniPix-logo.png';

import apiServices from '../../services/api.service';

const NavigationBar = ({ isUserAuth, logoutUser }) => {
  //   if (isUserAuth) {
  //     const userInfo = async () => {
  //       try {
  //         return await apiServices.getUserInfo();
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //   }
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (isUserAuth) {
      return apiServices
        .getUserInfo()
        .then((res) => setUserInfo(res))
        .catch((error) => console.log(error));
    }
  }, [isUserAuth]);

  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="/">
        <img
          alt="UniPix Logo"
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        UniPix
      </Navbar.Brand>

      <Nav className="w-100">
        {isUserAuth ? (
          <>
            <Nav.Link href="/pix">Minhas chaves</Nav.Link>
            <Nav.Link href="/pix">Outras chaves</Nav.Link>
            {console.log(userInfo)}
            <Nav.Link className="ml-auto" href="/user">
              {userInfo.fullName && userInfo.fullName.split(' ')[0]}{' '}
              <img
                alt="Avatar"
                src={userInfo.imgUrl}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
            </Nav.Link>

            <Nav.Link className="ml-3" href="/" onClick={logoutUser}>
              Sair
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link className="ml-auto" href="/">
              Login
            </Nav.Link>
            <Nav.Link href="/signup">Cadastrar</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default NavigationBar;
