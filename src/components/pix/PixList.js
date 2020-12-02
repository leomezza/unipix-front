import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import AddPix from './AddPix';

import apiServices from '../../services/api.service';

class PixList extends Component {
  state = {
    listOfPix: [],
  };

  getAllPix = async () => {
    try {
      const pix = await apiServices.getMyPix();
      console.log(pix);

      this.setState({ listOfPix: pix });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getAllPix();
  }

  render() {
    return (
      <div>
        <div style={{ width: '60%', float: 'left' }}>
          {this.state.listOfPix.map((pix) => {
            return (
              <div className='pix-container' key={pix._id}>
                <Link to={`/pix/${pix._id}`}>
                  <h3>Chave: {pix.key}</h3>
                </Link>
                <h2>Banco: {pix.bank.name}</h2>
                <h2>Agência: {pix.agency}</h2>
                <h2>Conta: {pix.account}</h2>
                <h2>Observação: {pix.note}</h2>
                <img className='img-bank' src={pix.bank.imgBank} rel='logo' />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default PixList;
