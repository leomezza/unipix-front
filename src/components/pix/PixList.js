import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { QrCodePix } from 'qrcode-pix';

// import AddPix from './AddPix';

import apiServices from '../../services/api.service';
import { Image, Modal, Button } from 'react-bootstrap';
// import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// import Confirm from 'react-confirm-bootstrap';
// import { Button, Confirm } from 'semantic-ui-react';

// import EditPix from './EditPix';

class PixList extends Component {
  state = {
    listOfPix: [],
    pix: {},
    qrModalShow: false,
    qrPNG: '',
  };

  deletePix = async (chavePix) => {
    try {
      // const { params } = this.props.match;
      if (chavePix) {
        console.log(chavePix);
        await apiServices.deletePixById(chavePix);

        //this.props.history.push('/pix');    
        this.getAllPix();
      }
    } catch (error) {
      console.log(error);
    }
  };

  submit = (chavePix) => {
    confirmAlert({
      title: 'Exclusão',
      message: 'Confirma a exclusão da chave selecionada?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => this.deletePix(chavePix)
        },
        {
          label: 'Não',
          onClick: () => this.deletePix('')
        }
      ]
    });
  };

  generateQR = async (pix) => {
    const qrCodePix = QrCodePix({
      version: '01',
      key: pix.key,
      name: 'Leonardo Mezzanotti',
      city: 'São Paulo',
      // value: 1.55,
      // guid: '1234567890',
      // message: 'Olha só funcionaaaaa',
      // cep: '04002021',
    });

    console.log(qrCodePix.payload());
    const qrPNG = await qrCodePix.base64();
    this.setState({ qrPNG });
    this.setState({ qrModalShow: true });
  };

  getAllPix = async () => {
    // try {
    //   const pix = await apiServices.getMyPix();
    //   //console.log(pix);

    //   this.setState({ listOfPix: pix });
    // } catch (error) {
    //   console.log(error);
    // }
    const { params } = this.props.match;
    
    this.props.getListPix(params.id);
  };

  componentDidMount() {
    this.getAllPix();
  }

  render() {
    return (
      <div>
        {this.props.listPix.map((pix, index) => {
          this.state.copied = {[index]: false };
  
          let pixCopy = JSON.parse(JSON.stringify(this.state.pix))

          return (
            <div className='pix-container' key={pix._id}>
              <OverlayTrigger key='banco' placement='bottom' overlay={<Tooltip id={`tooltip-banco`}>{pix.bank.name}</Tooltip>}>
                {/* <Image variant="secondary" className="bottons-nav" src="https://www.freeiconspng.com/uploads/copy-icon-17.jpg" thumbnail /> */}
                <img className='img-bank' src={pix.bank.imgBank} rel='banco' />
              </OverlayTrigger>

              {/* <Link to={`/pix/${pix._id}`}> */}
              <h3>Chave: {pix.key}</h3>
              {/* </Link> */}
              {/* <h2>Banco: {pix.bank.name}</h2> */}
              <h2>Agência: {pix.agency}</h2>
              <h2>Conta: {pix.account}</h2>
              <h2>Observação: {pix.note}</h2>

              <CopyToClipboard text={pix.key}
                onCopy={() => {
                  pixCopy = {};

                  pixCopy[index] = true
                  this.setState({ pix: pixCopy })
                }}>
                <span>
                  <OverlayTrigger key='copiar' placement='top' overlay={<Tooltip id={`tooltip-copiar`}>Copiar</Tooltip>}>
                    <Image variant="secondary" className="bottons-nav" src="https://www.freeiconspng.com/uploads/copy-icon-17.jpg" thumbnail />
                  </OverlayTrigger>
                </span>
              </CopyToClipboard>
              <Link to={`/pix/${pix._id}`}>
                <OverlayTrigger key='editar' placement='top' overlay={<Tooltip id={`tooltip-editar`}>Editar</Tooltip>}>
                  <Image className="bottons-nav" src="https://www.freeiconspng.com/uploads/edit-notes-icons-21.png" thumbnail />
                </OverlayTrigger>
              </Link>

              <OverlayTrigger key='excluir' placement='top' overlay={<Tooltip id={`tooltip-excluir`}>Excluir</Tooltip>}>
                <Image className="bottons-nav" onClick={() => this.submit(pix._id)} src="https://www.freeiconspng.com/uploads/trash-can-icon-29.png" thumbnail />
              </OverlayTrigger>
              <OverlayTrigger key='qrcode' placement='top' overlay={<Tooltip id={`tooltip-qrcode`}>Gerar QR Code</Tooltip>}>
                <Image className="bottons-nav" onClick={() => this.generateQR(pix)} src="https://icon-library.com/images/qr-icon/qr-icon-19.jpg" thumbnail />
              </OverlayTrigger>

              {this.state.pix.[index] ? <span style={{ color: 'green' }}>Chave Copiada!</span> : null}

              <Modal
                show={this.state.qrModalShow}
                onHide={() => this.setState({ qrModalShow: false })}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">QR Code do Pix</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Image className="mx-auto d-block" src={this.state.qrPNG} alt="QR Code do Pix" thumbnail />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => this.setState({ qrModalShow: false })}>Fechar</Button>
                </Modal.Footer>
              </Modal>

            </div>
          );
        })}
      </div>
    );
  }
}

export default PixList;
