import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import {Col, Row, Button} from 'react-bootstrap';
import Container from 'react-bootstrap/Container'

import apiServices from '../../services/api.service';

class EditPix extends Component {
  constructor(props) {
    super(props)
    this.state = {bank:[], pix:{}, SelectedBank: 0};
    this.handleSelectedBank = this.handleSelectedBank.bind(this);
  }

  handleSelectedBank(e) {
  	this.setState({SelectedBank: e.target.value});
  };

  componentDidMount() {
    this.getSinglePix();
    this.getListBank();
  }

  getListBank = async () => {
    try {
      // const { params } = this.props.match;

      const bank = await apiServices.getAllBanks();

      this.setState({bank});
    } catch (error) {
      console.log(error);
    }
  };


  getSinglePix = async () => {
    try {
      const { params } = this.props.match;

      const pix = await apiServices.getOnePixById(params.id);

      this.setState({pix: pix});
      this.setState({SelectedBank: pix.bank._id});
      console.log(this.props);
    } catch (error) {
      console.log(error);
    }
  };
  
  handleFormSubmit = async (event) => {
    try {
      event.preventDefault();

      const { key, agency, account, note, _id, ownertype, name3P } = this.state.pix ;
      const { SelectedBank } = this.state ;

      await apiServices.editPixById(_id, { key, agency, account, note, bank: SelectedBank, name3P });

      this.props.history.push(`/pix/${ownertype}`);
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ pix: { ...this.state.pix, [name]: value }});
  };

  render() {
    //console.log(this.state.bank);
    return (
      <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
        
          <Form>
            {this.state.pix.ownertype ==='1' && (
              <h1 className="d-flex justify-content-center">Editar Chave</h1>
            )}
            {this.state.pix.ownertype ==='2' && (
              <h1 className="d-flex justify-content-center">Editar Chave de Terceiros</h1>
            )}
            <Form.Group controlId="formPlaintextEmail">
              <Form.Label >
                Chave
              </Form.Label>
              <Form.Control plaintext readOnly defaultValue={this.state.pix.key} />
            </Form.Group>
            {this.state.pix.ownertype ==='2' && (
              <Form.Group controlId="formPlaintextPassword">
                <Form.Label >
                Nome
                </Form.Label>
                  <Form.Control type="text" name="name3P" value={this.state.pix.name3P} onChange={(e) => this.handleChange(e)}/>
              </Form.Group>
            )}

            <Form.Group  controlId="exampleForm.ControlSelect1">
              <Form.Label >Banco</Form.Label>
              <Form.Control as="select" name="bank" value={this.state.SelectedBank} onChange={this.handleSelectedBank}>
                {this.state.bank.map((item, index) => (
   	              <option key={index} value={item._id}>{item.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group  controlId="formPlaintextPassword">
              <Form.Label >
                Agência
              </Form.Label>
                <Form.Control type="text" name="agency" value={this.state.pix.agency} onChange={(e) => this.handleChange(e)}/>
            </Form.Group>
            
            <Form.Group controlId="formPlaintextPassword">
              <Form.Label c>
              Conta
              </Form.Label>
                <Form.Control type="text" name="account" value={this.state.pix.account} onChange={(e) => this.handleChange(e)}/>
            </Form.Group>

            <Form.Group controlId="formPlaintextPassword">
              <Form.Label >
              Observação
              </Form.Label>
                <Form.Control type="text" name="note" value={this.state.pix.note} onChange={(e) => this.handleChange(e)}/>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={this.handleFormSubmit}>
              Gravar
            </Button>
          </Form>      
        
        </Col>
      </Row>
    </Container>
    );
  }
}

export default EditPix;
