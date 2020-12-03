import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

import logo from '../../UniPix-logo.png';

const navbar = ({ isUserAuth, logoutUser }) => {
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

      <Nav className="mr-auto">
        {isUserAuth ? (
          <>
            <Nav.Link href="/pix">Minhas chaves</Nav.Link>
            <Nav.Link href="/pix">Outras chaves</Nav.Link>
            <Nav.Link href="/" onClick={logoutUser}>
              Sair
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/signup">Cadastrar</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default navbar;
