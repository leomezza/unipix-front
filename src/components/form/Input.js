import React from 'react';
import InputMask from 'react-input-mask';
import { Form, Col, Button } from 'react-bootstrap';

const Input = ({
  controlId,
  labelText,
  type,
  name,
  value,
  handleChange,
  handleBlur,
  touched,
  errors,
  mask,
}) => {

  return (
    <Form.Group as={Col} md="6" controlId={controlId}>
      <Form.Label>
        {labelText}
      </Form.Label>
      {!mask ? (
        <>
          <Form.Control
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched && !errors}
            isInvalid={touched && errors}
          />
          <Form.Control.Feedback>Okay!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            {errors}
          </Form.Control.Feedback>
        </>
      ) : (
          <>
            <InputMask
              autoComplete="off"
              className={""}
              type={type}
              name={name}
              mask={mask}
              maskChar={null}
              // maxLength={maxLength}
              // minLength={minLength}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Form.Control.Feedback>Okay!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors}
            </Form.Control.Feedback>
          </>
        )}
    </Form.Group>
  )
};

export default Input;
