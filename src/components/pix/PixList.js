import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import AddPix from './AddPix';

import apiServices from '../../services/api.service';
import Image from 'react-bootstrap/Image';
// import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {CopyToClipboard} from 'react-copy-to-clipboard';


class PixList extends Component {
  state = {
    listOfPix: [],
    pix: {},
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
        {this.state.listOfPix.map((pix, index) => {
          this.state.copied = {[index]: false };
  
          let pixCopy = JSON.parse(JSON.stringify(this.state.pix))

          return (
            <div className='pix-container' key={pix._id}>
              <img className='img-bank' src={pix.bank.imgBank} rel='logo' />
              <Link to={`/pix/${pix._id}`}>
                <h3>Chave: {pix.key}</h3>
              </Link>
              <h2>Banco: {pix.bank.name}</h2>
              <h2>Agência: {pix.agency}</h2>
              <h2>Conta: {pix.account}</h2>
              <h2>Observação: {pix.note}</h2>

              <CopyToClipboard text={pix.key}
                onCopy={() => {
                  pixCopy = {};

                  pixCopy[index] = true
                  this.setState({pix: pixCopy})
                }}>
                <span>
                  <OverlayTrigger key='copiar' placement='top' overlay={<Tooltip id={`tooltip-copiar`}>Copiar</Tooltip>}>
                    <Image variant="secondary" className="bottons-nav" src="https://www.freeiconspng.com/uploads/copy-icon-17.jpg" thumbnail />
                  </OverlayTrigger>         
                </span>
              </CopyToClipboard>

              <OverlayTrigger key='editar' placement='top' overlay={<Tooltip id={`tooltip-editar`}>Editar</Tooltip>}>
                <Image className="bottons-nav" src="https://www.freeiconspng.com/uploads/edit-notes-icons-21.png" thumbnail />
              </OverlayTrigger>
              <OverlayTrigger key='excluir' placement='top' overlay={<Tooltip id={`tooltip-excluir`}>Excluir</Tooltip>}>
                <Image className="bottons-nav" src="https://www.freeiconspng.com/uploads/trash-can-icon-29.png" thumbnail />
              </OverlayTrigger>
              <OverlayTrigger key='qrcode' placement='top' overlay={<Tooltip id={`tooltip-qrcode`}>Gerar QR Code</Tooltip>}>
                <Image className="bottons-nav" src="https://icon-library.com/images/qr-icon/qr-icon-19.jpg" thumbnail />
              </OverlayTrigger>

              {this.state.pix.[index] ? <span style={{color: 'green'}}>Chave Copiada!</span> : null}

            </div>
          );
        })}
      </div>
    );
  }
}

export default PixList;
