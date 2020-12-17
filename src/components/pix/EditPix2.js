import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';

import apiServices from '../../services/api.service';
import { Redirect } from 'react-router-dom';

const pixSchema = yup.object({
  pixType: yup
    .mixed()
    .oneOf(['CPF', 'CNPJ', 'EMail', 'Cell', 'Random'])
    .required('Campo Obrigatório'),
  key: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres')
    .required('Campo Obrigatório'),
  note: yup.string().max(254, 'Máximo de 254 caracteres'),
  bank: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  agency: yup.string().max(10, 'Máximo de 10 caracteres'),
  account: yup.string().max(15, 'Máximo de 15 caracteres'),
  ownertype: yup.mixed().oneOf(['1', '2']).required('Campo Obrigatório'),
  name3P: yup.string().max(100, 'Máximo de 100 caracteres'),
});

const EditPix = (props) => {
  const initialState = {
    pixType: pix.pixType,
    key: pix.key,
    note: pix.note,
    bank: pix.bank,
    agency: pix.agency,
    account: pix.account,
    ownertype: pix.ownertype,
    name3P: pix.name3P,
  };

  const [listBank, setListBank] = useState([]);
  const [redirectAdress, setRedirectAdress] = useState('');
  const [pix, setPix] = useState({});
  const [selectedBank, setSelectedBank] = useState('');

  const getListBank = async () => {
    try {
      const bank = await apiServices.getAllBanks();
      setListBank(bank);
    } catch (error) {
      console.log(error);
    }
  };

  const getSinglePix = async () => {
    try {
      const { params } = props.match;

      const pixFromAPI = await apiServices.getOnePixById(params.id);

      setPix(pixFromAPI);
      setSelectedBank(pixFromAPI.bank._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (listBank.length < 1) getListBank();
    getSinglePix();
  }, [])

  let isNewPixSuccessful = false;

  listBank.length > 0 ? console.log(listBank) : console.log('não carregou');

  console.log(props);

  const handleSubmitMethod = async (formValues, helperMethods) => {
    try {
      await apiServices.editPixById(_id, formValues);
      isNewPixSuccessful = true;
      props.onHide();
      setRedirectAdress(`/pix/${formValues.ownertype}`);
      props.getListPix(formValues.ownertype);

    } catch (error) {
      if (error.response.data && error.response.data.type === 'Auth-Signup') {
        helperMethods.setFieldError('email', error.response.data.message);
      }
    }
  };

  return redirectAdress ? <Redirect to={redirectAdress} /> : (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {isNewPixSuccessful && <h2>Chave editada com sucesso.</h2>}
          Editar Chave
        </Modal.Title>
      </Modal.Header>
      {listBank.length > 0 && (
        <Formik
          initialValues={initialState}
          onSubmit={handleSubmitMethod}
          validationSchema={pixSchema}
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
                <Form.Group as={Col} md="8" controlId="validationFormik01">
                  <Form.Label className="mr-2"></Form.Label>
                  <Form.Check
                    checked={values.ownertype === '1'}
                    inline
                    type="radio"
                    id="1"
                    name="ownertype"
                    value="1"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Minha chave"
                  />
                  <Form.Check
                    checked={values.ownertype === '2'}
                    inline
                    type="radio"
                    id="2"
                    name="ownertype"
                    value="2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Chave de outra pessoa"
                  />
                </Form.Group>

                {values.ownertype === '2' && (
                  <Form.Group as={Col} md="6" controlId="validationFormik08">
                    <Form.Label>Nome da outra pessoa</Form.Label>
                    <Form.Control
                      type="text"
                      name="name3P"
                      value={values.name3P}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.name3P && !errors.name3P}
                      isInvalid={touched.name3P && errors.name3P}
                    />
                    <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                      {errors.name3P}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Form.Group as={Col} md="8" controlId="validationFormik02">
                  <Form.Label className="mr-2">Tipo:</Form.Label>
                  <Form.Check
                    checked={values.pixType === 'CPF'}
                    inline
                    type="radio"
                    id="CPF"
                    name="pixType"
                    value="CPF"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="CPF"
                  />
                  <Form.Check
                    checked={values.pixType === 'CNPJ'}
                    inline
                    type="radio"
                    id="CNPJ"
                    name="pixType"
                    value="CNPJ"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="CNPJ"
                  />
                  <Form.Check
                    checked={values.pixType === 'EMail'}
                    inline
                    type="radio"
                    id="EMail"
                    name="pixType"
                    value="EMail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="e-mail"
                  />
                  <Form.Check
                    checked={values.pixType === 'Cell'}
                    inline
                    type="radio"
                    id="Cell"
                    name="pixType"
                    value="Cell"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Celular"
                  />
                  <Form.Check
                    checked={values.pixType === 'Random'}
                    inline
                    type="radio"
                    id="Random"
                    name="pixType"
                    value="Random"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Aleatória"
                  />
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik03">
                  <Form.Label>Chave</Form.Label>
                  <Form.Control
                    type="text"
                    name="key"
                    value={values.key}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.key && !errors.key}
                    isInvalid={touched.key && errors.key}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.key}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik04">
                  <Form.Label>Banco</Form.Label>
                  <Form.Control as="select" custom onChange={handleChange} onBlur={handleBlur} name="bank">
                    {listBank.map((item, index) => (
                      <option key={index} value={item._id}>{item.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik05">
                  <Form.Label>Agência</Form.Label>
                  <Form.Control
                    type="text"
                    name="agency"
                    value={values.agency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.agency && !errors.agency}
                    isInvalid={touched.agency && errors.agency}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.agency}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik06">
                  <Form.Label>Conta</Form.Label>
                  <Form.Control
                    type="text"
                    name="account"
                    value={values.account}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.account && !errors.account}
                    isInvalid={touched.account && errors.account}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.account}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="validationFormik07">
                  <Form.Label>Observação</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    value={values.note}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.note && !errors.note}
                    isInvalid={touched.note && errors.note}
                  />
                  <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.note}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" className="mr-auto" type="submit">
                  Editar chave
                </Button>
                <Button variant="danger" onClick={props.onHide}>
                  Fechar
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default EditPix;
