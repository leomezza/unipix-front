import React, { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';

import { Formik } from 'formik';
import { Form, Col, Button } from 'react-bootstrap';

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
    .max(100, 'Máximo de 100 caracteres')
    .required('Campo Obrigatório'),
  confirmPassword: yup
    .string()
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres')
    .required('Campo Obrigatório')
    .test('Senhas conferem', 'As senhas não conferem', function (value) {
      return this.parent.password === value;
    }),
  email: yup
    .string()
    .email('Formato Inválido')
    .min(5, 'Mínimo de 5 caracteres')
    .max(100, 'Máximo de 100 caracteres')
    .required('Campo Obrigatório'),
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
  cep: yup
    .string()
    .min(8, 'Deve conter 8 números')
    .max(8, 'Deve conter 8 números'),
  city: yup
    .string()
    .max(100, 'Máximo de 100 caracteres'),
});

const Signup = (props) => {
  const [isSignupSuccesfull, setIsSignupSuccesfull] = useState(false);

  const initialState = {
    type: 'A',
    fullName: '',
    password: '',
    confirmPassword: '',
    email: '',
    docNumber: '',
    tel: '',
    cep: '',
    city: '',
  };

  const redirectToLogin = () => {
    setTimeout(() => {
      props.history.push('/');
    }, 2000);
  };

  const handleSubmitMethod = async (formValues, helperMethods) => {
    try {
      delete formValues.confirmPassword;
      formValues.cep && delete formValues.cep;

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/public/signup`,
        formValues
      );

      setIsSignupSuccesfull(true);

      redirectToLogin();
    } catch (error) {
      if (error.response.data && error.response.data.type === 'Auth-Signup') {
        helperMethods.setFieldError('email', error.response.data.message);
      }
    }
  };

  const cepToCity = async (cep, setFieldValue) => {
    try {
      const { data: { localidade } } = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`);

      setFieldValue("city", localidade);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      {isSignupSuccesfull && (
        <h2>Cadastro realizado com sucesso. Redirecionando para o login...</h2>
      )}

      <h1 className="m-4">Crie sua conta no UniPix!</h1>

      <Formik
        initialValues={initialState}
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
          setFieldValue,
        }) => (
            <Form noValidate onSubmit={handleSubmit} className="m-4">
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
                // isValid={touched.type && !errors.type}
                // isInvalid={touched.type && errors.type}
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
                // isValid={touched.type && !errors.type}
                // isInvalid={touched.type && errors.type}
                />
                {/* <Form.Control.Feedback>Okay!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback> */}
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
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                />
                <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
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

              <Form.Group as={Col} md="6" controlId="validationFormik08">
                <Form.Label >CEP</Form.Label>
                <Form.Control
                  type="text"
                  name="cep"
                  value={values.cep}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.cep && !errors.cep}
                  isInvalid={touched.cep && errors.cep}
                />
                <Button variant="secondary" className="mt-1" onClick={() => cepToCity(values.cep, setFieldValue)}>Consultar CEP</Button>
                <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  {errors.cep}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="validationFormik09">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.city && !errors.city}
                  isInvalid={touched.city && errors.city}
                />
                <Form.Control.Feedback>Okay!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit">Criar Conta</Button>
            </Form>
          )}
      </Formik>
    </main>
  );
};

export default Signup;
