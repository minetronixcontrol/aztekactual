import React from "react";
import ReactDOM from "react-dom";
import {Button, Col, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Row} from "reactstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.css";

//Componenetes Externos


class ModalPassword extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false
      };
  
      this.toggle = this.toggle.bind(this);
    }

    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }
  
    render() {
      return (
        <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop="static" size="lg">
                <ModalHeader toggle={this.toggle}>Confima tu venta</ModalHeader>
                <ModalBody>
                    <Row form>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Label for="inputPass">Contraseña:</Label>
                            <Input type="password" name="inputPass" id="inputPass" />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Label for="inputPassAgain">Repetir Contraseña:</Label>
                            <Input type="password" name="inputPassAgain" id="inputPassAgain" />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Ok</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
      );
    }
  }
  
  export default ModalPassword;