import React, { Component } from 'react';

import apiServices from '../../services/api.service';

class EditPix extends Component {
  constructor(props) {
    super(props)
    this.state = {bank:[], pix:{}, selectItem: 0};
    this.handleSelectItem = this.handleSelectItem.bind(this);
  }

  handleSelectItem(e) {
  	this.setState({selectItem: e.target.value});
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
    } catch (error) {
      console.log(error);
    }
  };
  
  handleFormSubmit = async (event) => {
    try {
      event.preventDefault();

      const { key, agency, id } = this.state;

      await apiServices.editPixById(id, { key, agency });

      this.props.history.push('/pix');
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    console.log(this.state.bank);
    return (
      <div  className='pix-container'>
        <hr />
        <h3>Edição de Chave</h3>
        <form onSubmit={this.handleFormSubmit}>
          <label>Chave:</label>
          <input
            type="text"
            name="key"
            value={this.state.pix.key}
            onChange={(e) => this.handleChange(e)} disabled="disabled"
          />
          <br />
          <label>Banco:</label>
          <select value={this.state.selectItem} onChange={this.handleSelectItem}>
          {this.state.bank.map((item, index) => (
          	<option key={index} value={item.id}>{item.name}</option>
          ))}
          </select>          
          <textarea
            name="bank"
            value={this.state.pix.bank}
            onChange={(e) => this.handleChange(e)}
          />     
          <br />     
          <label>Agencia:</label>
          <textarea
            name="agency"
            value={this.state.pix.agency}
            onChange={(e) => this.handleChange(e)}
          />
          <br />
          <label>Conta:</label>
          <textarea
            name="account"
            value={this.state.pix.account}
            onChange={(e) => this.handleChange(e)}
          />
          <br />
          <label>Observação:</label>
          <textarea
            name="note"
            value={this.state.pix.note}
            onChange={(e) => this.handleChange(e)}
          />
          <input type="submit" value="Salvar" />
        </form>
      </div>
    );
  }
}

export default EditPix;
