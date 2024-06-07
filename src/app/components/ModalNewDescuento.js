import React from "react";
import ReactDOM from "react-dom";
import {Button, Col, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Row} from "reactstrap";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.css";

//Componenetes Externos

//Variables Select

var optDescuento = [];

class ModalNewDescuento extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false
      };
  
      this.toggle = this.toggle.bind(this);
      this.handleSetOptionsDescuentos = this.handleSetOptionsDescuentos.bind(this);
      this.handleOnChangeDescuento = this.handleOnChangeDescuento.bind(this);
    }

    componentDidMount(){
      console.log("El componente modalNewCliente fue montado con exito");
      this.handleSetOptionsDescuentos();
    }

    handleSetOptionsDescuentos(){
      optDescuento = [
        { value: 'Ninguno', label: 'Ninguno', desc: '0' },
        { value: 'Niño', label: 'Niño', desc: '10' },
        { value: 'Estudiante', label: 'Estudiante', desc: '25' },
        { value: 'INSEN', label: 'INSEN', desc: '20' }
      ];
    } 

    handleOnChangeDescuento(e){
      this.props.onChangeDescuento(e.value, e.desc);
    } 

    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }
  
    render() {
      return (
        <div>
            <FormGroup>
                <Button className="mt-n2" color="link"  onClick={this.toggle}><i className="fa fa-plus-circle"/></Button><Label for="selectDescuento">Descuento:</Label> 
                <Select
                  id="selectDescuento"
                  isSearchable={false}
                  defaultValue={{ value: 'Ninguno', label: 'Ninguno', desc: '0' }}
                  onChange={this.handleOnChangeDescuento}
                  options={optDescuento}
                  placeholder = "Selecciona..."
                />
            </FormGroup>

            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop="static" size="lg">
                <ModalHeader toggle={this.toggle}>Nuevo Descuento</ModalHeader>
                <ModalBody>
                    <Row form>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Label for="inputNewDescuento">Nombre:</Label>
                            <Input type="text" name="inputNewDescuento" id="inputNewDescuento" placeholder="Tipo de descuento" />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Label for="inputNewDescuentoPorc">Porcentaje %:</Label>
                            <Input type="text" name="inputNewDescuentoPorc" id="inputNewDescuentoPorc" placeholder="%" />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Guardar</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
      );
    }
  }
  
  export default ModalNewDescuento;