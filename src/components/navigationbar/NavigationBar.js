import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Modal,
  Button,
  Form,
  Col,
  Image,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';

import logo from '../../img/UniPix-logo.png';
import addIcon from '../../img/addIcon.png';

import AddPix from '../pix/AddPix';
import apiServices from '../../services/api.service';

const userSchema = yup.object({
  type: yup.mixed().oneOf(['A', 'B']).required('Campo Obrigatório'),
  fullName: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres')
    .required('Campo Obrigatório'),
  password: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres'),
  confirmPassword: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres')
    .test('Senhas conferem', 'As senhas não conferem', function (value) {
      return this.parent.password === value;
    }),
  docNumber: yup
    .string()
    .min(11, 'Mínimo de 11 caracteres')
    .max(14, 'Máximo de 14 caracteres')
    .required('Campo Obrigatório'),
  tel: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(16, 'Máximo de 16 caracteres')
    .required('Campo Obrigatório'),
});

const NavigationBar = ({
  isUserAuth,
  logoutUser,
  isAddPixShown,
  showAddPix,
  getListPix,
  hideAddPix,
}) => {
  const [userInfo, setUserInfo] = useState({});
  const [userModalShow, setUserModalShow] = React.useState(false);

  const handleClose = () => setUserModalShow(false);
  //console.log(listBank);
  //console.log(loadBankList);

  useEffect(() => {
    if (isUserAuth) {
      return apiServices
        .getUserInfo()
        .then((res) => setUserInfo(res))
        .catch((error) => console.log(error));
    }
  }, [isUserAuth]);

  const handleSubmitMethod = async (formValues, helperMethods) => {
    try {
      if (formValues.password && formValues.password.length < 1)
        delete formValues.password;

      delete formValues.confirmPassword;
      delete formValues.createdAt;
      delete formValues.updatedAt;
      delete formValues.__v;
      delete formValues._id;

      await apiServices.editUserInfo(formValues);
      setUserInfo(await apiServices.getUserInfo());

      setUserModalShow(false);
    } catch (error) {
      if (error.response.data && error.response.data.type === 'Auth-Signup') {
        helperMethods.setFieldError('email', error.response.data.message);
      }
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="md">
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
        {isUserAuth ? (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="w-100">
                <Link
                  to="/pix/1"
                  className="nav-link"
                  // onClick={() => getListPix(1)}
                >
                  Minhas chaves
                </Link>
                <Link
                  to="/pix/2"
                  className="nav-link"
                  // onClick={() => getListPix(2)}
                >
                  Outras chaves
                </Link>

                <OverlayTrigger
                  key="newkey"
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-newkey`}>Nova chave</Tooltip>}
                >
                  <Button
                    className="mr-auto mx-md-auto"
                    onClick={() => showAddPix(true)}
                  >
                    <Image
                      src={addIcon}
                      width="30"
                      height="30"
                      rounded
                      className="d-inline-block align-top"
                    />
                  </Button>
                </OverlayTrigger>

                <AddPix
                  show={isAddPixShown}
                  getListPix={getListPix}
                  onHide={() => showAddPix(false)}
                  hideAddPix={hideAddPix}
                />

                <OverlayTrigger
                  key="edituser"
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-edituser`}>Editar usuário</Tooltip>
                  }
                >
                  <Button
                    className="mr-auto mr-md-0 ml-md-auto"
                    onClick={() => setUserModalShow(true)}
                  >
                    {userInfo.fullName && userInfo.fullName.split(' ')[0]}{' '}
                    <img
                      alt="Avatar"
                      src={userInfo.imgUrl}
                      width="30"
                      height="30"
                      className="d-inline-block align-top"
                    />
                  </Button>
                </OverlayTrigger>

                <Link className="ml-md-3 nav-link" to="/" onClick={logoutUser}>
                  Sair
                </Link>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="w-100">
                <Link className="ml-md-auto nav-link" to="/">
                  Login
                </Link>
                <Link to="/signup" className="nav-link">
                  Cadastrar
                </Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Navbar>

      <Modal
        show={userModalShow}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Editar usuário
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={userInfo}
          onSubmit={handleSubmitMethod}
          validationSchema={userSchema}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit} className="m-4">
              <Modal.Body>
                <Image
                  src={values.imgUrl}
                  thumbnail
                  className="w-25 h-25 mx-auto d-block mb-3"
                />
                <Form.Group as={Col} md="6" controlId="validationFormik01">
                  <Form.Label className="mr-2">Tipo:</Form.Label>
                  <Form.Check
                    checked={values.type === 'A'}
                    inline
                    type="radio"
                    id="A"
                    name="type"
                    value="A"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Pessoa Física"
                  />
                  <Form.Check
                    checked={values.type === 'B'}
                    inline
                    type="radio"
                    id="B"
                    name="type"
                    value="B"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Pessoa Jurídica"
                  />
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik02">
                  <Form.Label>Nome completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.fullName && !errors.fullName}
                    isInvalid={touched.fullName && errors.fullName}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik03">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik06">
                  <Form.Label>
                    Número do {values.type === 'A' ? 'CPF' : 'CNPJ'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="docNumber"
                    value={values.docNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.docNumber && !errors.docNumber}
                    isInvalid={touched.docNumber && errors.docNumber}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.docNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik07">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    name="tel"
                    value={values.tel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.tel && !errors.tel}
                    isInvalid={touched.tel && errors.tel}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.tel}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik04">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.password && !errors.password}
                    isInvalid={touched.password && errors.password}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik05">
                  <Form.Label>Confirmação de Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.confirmPassword && !errors.confirmPassword}
                    isInvalid={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">Atualizar Conta</Button>
                <Button onClick={() => setUserModalShow(false)}>Fechar</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default NavigationBar;
