import React from "react";
import ReactDOM from "react-dom";
import { Button, Col, Card, CardTitle, Row } from "reactstrap";

/* Estilos */
import "../css/asientosAutobus.css";

const AsientosAutobus = (props) => {
    return (
        <div>
            <div className="text-center"> 
                <Row>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <Button outline color="danger"><i className="fa fa-check" /></Button>{' '}
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <Button color="danger" size="lg" className="asientoDisponible asiento">{'  '}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <h6>Selecionado</h6>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <h6>Ocupado</h6>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4">
                        <h6>Libre</h6>
                    </Col>
                </Row>
            </div>
            <br/>
            <Row>
                <Col md="12" xs="12" sm="12" lg="12">
                    <div>
                        <Card body outline color="secondary"  className="text-center">
                            <CardTitle>Seleccione el lugar</CardTitle>
                            <Row>
                                <Col xs="12" sm="12" md={{ size:9, offset:3 }} lg={{ size:9, offset:3 }}>
                                    {/* Elementos CHOFER y ESCALERAS */}
                                    <Row>
                                        <Col xs="2" sm="1" className="elementosAutobus">
                                            <i className="fa fa-user-tie" />
                                        </Col>
                                        <Col xs="2" sm="1">
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                        </Col>
                                        <Col xs="2" sm="1" className="elementosAutobus">
                                            <i className="fa fa-sort-amount-down" />
                                        </Col>
                                    </Row>
                                    {/* TERMINA Elementos CHOFER y ESCALERAS */}
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">01</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">02</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">03</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">04</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">05</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">06</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">07</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">08</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">09</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">10</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">                                    
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">11</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">12</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">                                    
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">13</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">14</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">15</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                    
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">16</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">17</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">18</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">19</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                   
                                            <Button color="secondary" disabled><i className="fa fa-user" /></Button>
                                            <p className="smallDevice text-center">20</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">21</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">22</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">23</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                   
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">24</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">25</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">26</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">27</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                   
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">28</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">29</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">30</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">31</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                   
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">32</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">33</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">34</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">35</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                   
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">36</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">37</p>
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">38</p>
                                        </Col>
                                        <Col xs="3">
                                        </Col>
                                        <Col xs="2" sm="1">
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">39</p>
                                        </Col>
                                        <Col xs="2" sm="1">                                   
                                            <Button color="danger" size="lg" className="asientoDisponible">{'  '}</Button>
                                            <p className="smallDevice text-center">40</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
  };
  
  export default AsientosAutobus;