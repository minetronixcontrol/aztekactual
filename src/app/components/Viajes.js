import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var viajes = [];

var tripulantesNames = [];

var tripulantesIds = [];

export default class Viajes extends Component {
    constructor(props){
        super(props);
        this.state = {
            viajes: null
        };
        this.fetchTripulantes = this.fetchTripulantes.bind(this);
        this.fetchViajes = this.fetchViajes.bind(this);

        this.getNameTripulante = this.getNameTripulante.bind(this);
    }

    componentDidMount(){
        this.fetchTripulantes();
    }

    fetchTripulantes(){
      fetch(`/api/Tripulantes/true/activo`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if(data.length > 0){
            for (let i = 0; i < data.length; i++) {
              tripulantesNames[i] = `${data[i].nombre} ${data[i].apellidoPaterno} ${data[i].apellidoMaterno}`;
              tripulantesIds[i] = data[i]._id;
            }
          }
          console.log(tripulantesNames);
          //console.log(tripulantesIds);
        }).then(()=>{
          this.fetchViajes();
        });
    }

    fetchViajes(){
        fetch(`/api/AsignarViajes/true/activo`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.length > 0){
              console.log(data);
              for (let i = 0; i < data.length; i++) {
                viajes[i] = {
                  _id: data[i]._id,
                  fecha: data[i].fecha,
                  chofer_1: this.getNameTripulante(data[i].chofer_1),
                  chofer_2: this.getNameTripulante(data[i].chofer_2),
                  sobrecargo: this.getNameTripulante(data[i].sobrecargo),
                  numeroEconomico: data[i].numeroEconomico
                }
              }
            }
        }).then(() => {
            this.setState({
                viajes: viajes
            });
        });
    }

    getNameTripulante(id){
      let i = tripulantesIds.indexOf(id+'');
      return tripulantesNames[i];
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: "15px" }}>
                    <h3 className="text-center">Viajes</h3>
                    <br/>
                    <Row>
                        <Col lg='12' md='12' sm='12' xs='12'>
                            <BootstrapTable  data={ this.state.viajes } search={ true } pagination>
                                <TableHeaderColumn dataField='_id' isKey hidden>ID</TableHeaderColumn>
                                <TableHeaderColumn dataField='fecha' >Fecha</TableHeaderColumn>
                                <TableHeaderColumn dataField='chofer_1' >Chofer 1</TableHeaderColumn>
                                <TableHeaderColumn dataField='chofer_2' >Chofer 2</TableHeaderColumn>
                                <TableHeaderColumn dataField='sobrecargo' >Sobrecargo</TableHeaderColumn>
                                <TableHeaderColumn dataField='numeroEconomico' >No. Económico</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                    </Row><br/><br/><br/>
                </Container>
            </div>
        )
    }
}