import React, { Component } from "react";
import { Link } from "react-router-dom";
import { QrCodePix } from "qrcode-pix";

// import AddPix from './AddPix';

import apiServices from "../../services/api.service";
import {
  Image,
  Modal,
  Button,
  CardDeck,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
// import Overlay from 'react-bootstrap/Overlay';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
// import Confirm from 'react-confirm-bootstrap';
// import { Button, Confirm } from 'semantic-ui-react';
import btnCopy from "../../img/copy-icon.png";
import btnEdit from "../../img/edit.png";
import btnRemove from "../../img/trash.png";
import btnQRCode from "../../img/qr-icon.jpg";
import addIcon from "../../img/addIcon.png";

// import EditPix from './EditPix';

class PixList extends Component {
  state = {
    listOfPix: [],
    pix: {},
    qrModalShow: false,
    qrPNG: "",
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
      title: "Exclusão",
      message: "Confirma a exclusão da chave selecionada?",
      buttons: [
        {
          label: "Sim",
          onClick: () => this.deletePix(chavePix),
        },
        {
          label: "Não",
          onClick: () => this.deletePix(""),
        },
      ],
    });
  };

  generateQR = async (pix) => {
    const qrCodePix = QrCodePix({
      version: "01",
      key: pix.key,
      name: "Leonardo Mezzanotti",
      city: "São Paulo",
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
      <>
        <h1 className="text-center">
          {this.props.match.params.id === "1"
            ? "Minhas Chaves"
            : "Chaves de Terceiros"}
        </h1>
          {this.props.listPix.length < 1 ? (
            <div className="d-flex justify-content-center mt-5" style={{height: "100%"}}>
              <Button className="d-inline-block align-middle mx-auto" onClick={() => this.props.setAddPixModalShow(true)}>
                <Image className="d-inline-block align-middle mx-auto"
                  src={addIcon}
                  width="120"
                  height="120"
                  rounded
                  //className="d-inline-block align-middle"
                />
                <h4>Cadastrar</h4>
              </Button>
            </div>
          ) : (
        <CardDeck>
            {this.props.listPix.map((pix, index) => {
              this.state.copied = { [index]: false };

              let pixCopy = JSON.parse(JSON.stringify(this.state.pix));

              return (
                <Col md="4" className="my-2" key={pix._id}>
                  <Card>
                    <Card.Body>
                      <div className="d-flex">
                        <Card.Title className="d-inline-block">
                          Chave: {pix.key}
                        </Card.Title>
                        <OverlayTrigger
                          key="banco"
                          placement="bottom"
                          overlay={
                            <Tooltip id={`tooltip-banco`}>
                              {pix.bank.name}
                            </Tooltip>
                          }
                        >
                          {/* <Image variant="secondary" className="bottons-nav" src="https://www.freeiconspng.com/uploads/copy-icon-17.jpg" thumbnail /> */}
                          <Image
                            className="d-inline-block align-right ml-auto"
                            height="60"
                            src={pix.bank.imgBank}
                            rel="banco"
                            alt="img"
                          />
                        </OverlayTrigger>
                      </div>
                      {/*<Card.Text>
                  This is a wider card with supporting text below as a natural lead-in to
                  additional content. This content is a little bit longer.
                </Card.Text> */}
                      <Container>
                        <Row>
                          <Col className="font-weight-bold">Tipo</Col>
                          <Col>
                            {pix.pixType === "CPF"
                              ? "CPF"
                              : pix.pixType === "CNPJ"
                              ? "CNPJ"
                              : pix.pixType === "EMail"
                              ? "E-Mail"
                              : pix.pixType === "Cell"
                              ? "Celular"
                              : "Aleatório"}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="font-weight-bold">
                            {this.props.match.params.id === "2" ? "Nome:" : ""}
                          </Col>
                          <Col>
                            {this.props.match.params.id === "2"
                              ? `${pix.name3P}`
                              : ""}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="font-weight-bold">Agência:</Col>
                          <Col>{pix.agency}</Col>
                        </Row>
                        <Row>
                          <Col className="font-weight-bold">Conta:</Col>
                          <Col>{pix.account}</Col>
                        </Row>
                        <Row>
                          <Col className="font-weight-bold">Observação:</Col>
                          <Col>{pix.note}</Col>
                        </Row>
                      </Container>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                      {/* <small className="text-muted">Last updated 3 mins ago</small> */}
                      <CopyToClipboard
                        text={pix.key}
                        onCopy={() => {
                          pixCopy = {};

                          pixCopy[index] = true;
                          this.setState({ pix: pixCopy });
                        }}
                      >
                        <span>
                          <OverlayTrigger
                            key="copiar"
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-copiar`}>Copiar</Tooltip>
                            }
                          >
                            <Image
                              variant="secondary"
                              className="bottons-nav"
                              src={btnCopy}
                              thumbnail
                              alt="btn-copy"
                            />
                          </OverlayTrigger>
                        </span>
                      </CopyToClipboard>
                      <Link to={`/editpix/${pix._id}`}>
                        <OverlayTrigger
                          key="editar"
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-editar`}>Editar</Tooltip>
                          }
                        >
                          <Image
                            className="bottons-nav"
                            src={btnEdit}
                            thumbnail
                            alt="btn-edit"
                          />
                        </OverlayTrigger>
                      </Link>

                      <OverlayTrigger
                        key="excluir"
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-excluir`}>Excluir</Tooltip>
                        }
                      >
                        <Image
                          className="bottons-nav"
                          onClick={() => this.submit(pix._id)}
                          src={btnRemove}
                          thumbnail
                          alt="btn-remove"
                        />
                      </OverlayTrigger>

                      <OverlayTrigger
                        key="qrcode"
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-qrcode`}>Gerar QR Code</Tooltip>
                        }
                      >
                        <Image
                          className="bottons-nav"
                          onClick={() => this.generateQR(pix)}
                          src={btnQRCode}
                          thumbnail
                          alt="btn-qrcode"
                        />
                      </OverlayTrigger>

                      {this.state.pix[index] ? (
                        <span style={{ color: "green" }}>Chave Copiada!</span>
                      ) : null}

                      <Modal
                        show={this.state.qrModalShow}
                        onHide={() => this.setState({ qrModalShow: false })}
                        size="sm"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">
                            QR Code do Pix
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Image
                            className="mx-auto d-block"
                            src={this.state.qrPNG}
                            alt="QR Code do Pix"
                            thumbnail
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            onClick={() =>
                              this.setState({ qrModalShow: false })
                            }
                          >
                            Fechar
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
        </CardDeck>
          )}
      </>
    );
  }
}

export default PixList;
