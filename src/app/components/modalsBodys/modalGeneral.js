import React, { Component } from 'react';
import {Container, Col, Row, Table} from 'reactstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
var newRow = {};

var optCliente = [];

var idChofer1 = null;

var idChofer2 = null;

var idSobrecargo = null;

var idRuta = null;

var idAux = null;

var idEco = null;

var idCliente = null;

var idOrigen = null;

var idDestino = null;

export default class MyCustomBody extends React.Component {
    constructor(props){
        super(props);
        //console.log('columns',this.props.columns);
        try {
            if(this.props.columns[1].type == "selectAsync"){
                optCliente = this.props.columns[1].options;
            }
        } catch (error) {
            console.log(error);
        }
        //optCliente = this.props.columns
        this.handleOnChangeCliente = this.handleOnChangeCliente.bind(this);
        this.handleChangeSelectOrigen = this.handleChangeSelectOrigen.bind(this);
        this.handleChangeSelectDestino = this.handleChangeSelectDestino.bind(this);
        this.getTransbordos = this.getTransbordos.bind(this);
        this.handleChangeSelectChofer1 = this.handleChangeSelectChofer1.bind(this);
        this.handleChangeSelectChofer2 = this.handleChangeSelectChofer2.bind(this);
        this.handleChangeSelectSobrecargo= this.handleChangeSelectSobrecargo.bind(this);
        this.handleChangeSelectAux = this.handleChangeSelectAux.bind(this);
        this.handleChangeSelectEco = this.handleChangeSelectEco.bind(this);
        this.handleChangeSelectRuta = this.handleChangeSelectRuta.bind(this);
    }

    getFieldValue () {
        const newRow = {};
        //this.getTransbordos();

        let tt = this.getTransbordos();

        //console.log('transbordos', tt);

        this.props.columns.forEach((column, i) => {
            //console.log('column.type',column.type);
            
            if((column.field != "_id") && (column.type == "input" || column.type == "select" || column.type == "date" || column.type == "time")){
                //console.log('diferente de select and id')
                newRow[column.field] = document.getElementById(column.field).value;
            }else if(column.type == "selectAsync"){
                //console.log('diferente de selectAsync')
                newRow[column.field] = idCliente;
            }else if(column.type == "react-select-origen"){
                //console.log('diferente de react-select-origen')
                newRow[column.field] = idOrigen;
            }else if(column.type == "react-select-destino"){
                //console.log('diferente de react-select-destino')
                newRow[column.field] = idDestino;
            }else if(column.type == "react-select-transbordos"){
                ///console.log('diferente de react-select-transbordos')
                newRow[column.field] = tt
            }else if(column.type == "select-chofer_1"){
                newRow[column.field] = idChofer1
            }else if(column.type == "select-chofer_2"){
                newRow[column.field] = idChofer2
            }else if(column.type == "select-sobrecargo"){
                newRow[column.field] = idSobrecargo
            }else if(column.type == "select-aux"){
                newRow[column.field] = idAux
            }else if(column.type == "select-eco"){
                newRow[column.field] = idEco
            }else if(column.type == "select-ruta"){
                newRow[column.field] = idRuta
            }else{
                //console.log('id',0)
                newRow[column.field] = 0;
            }
        }, this);
        //console.log(newRow);
        return newRow;
    }

    handleChangeSelectRuta(e){
        idRuta = e.value;
    }

    handleChangeSelectEco(e){
        idEco = e.value;
    }

    handleChangeSelectAux(e){
        idAux = e.value;
    }

    handleChangeSelectSobrecargo(e){
        idSobrecargo = e.value;
    }

    handleChangeSelectChofer2(e){
        idChofer2 = e.value;
    }

    handleChangeSelectChofer1(e){
        idChofer1 = e.value;
    }

    handleOnChangeCliente(e){
        //console.log(e);
        idCliente = e.value;
    }

    handleChangeSelectOrigen(e){
        //console.log('handleChangeSelectOrigen',e.value);
        idOrigen = e.value;
    }

    handleChangeSelectDestino(e){
        //console.log('handleChangeSelectDestino',e.value);
        idDestino = e.value;
    }

    getTransbordos(){
        let transbordos = [];
        try {
            let values = this.refs.transbordos.select.props.value;
            console.log('values',values);
            for (let i = 0; i < values.length; i++) {
                transbordos.push(`${values[i].value}`);             
            }
            return(transbordos);
        } catch (error) {
            return null;   
        }        
    }

    render() {
        const filterClientes = (inputValue) => {
            return optCliente.filter(i =>
                i.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        };
        
        const promiseOptions = inputValue =>
            new Promise(resolve => {
            setTimeout(() => {
                resolve(filterClientes(inputValue));
            }, 1000);
        });

        const columns = this.props;
        return (
            <div className='modal-body'>
                <div>
                    {
                        this.props.columns.map((column, i) => {
                            const {
                                type,
                                options,
                                field,
                                name,
                                hiddenOnInsert
                            } = column;

                            if (hiddenOnInsert) {
                                return null;
                            }else{                                
                                if(type == 'input'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <input ref={ field } type="text" class="form-control" id={ field } placeholder=""/>
                                        </div>
                                    )
                                }else if(type == 'select'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <select class="form-control" id={ field }>
                                                {options.map((option, i) => {
                                                    let key = '';
                                                    if(type=='select' && (field=='origen' || field=='destino')){
                                                        key = field+''+option;
                                                    }else{
                                                        key = option;
                                                    }
                                                    return(
                                                        <option key={key} value={option}>{option}</option>
                                                    )                                                    
                                                })}
                                            </select>
                                        </div>
                                    )
                                }else if(type == 'date'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <input ref={ field } type="date" class="form-control" id={ field } placeholder=""/>
                                        </div>
                                    )
                                }
                                else if(type == 'time'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <input ref={ field } type="time" class="form-control" id={ field } placeholder=""/>
                                        </div>
                                    )
                                }
                                else if(type == 'selectAsync'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <AsyncSelect 
                                            id={field}
                                            ref={field}
                                            placeholder = "Selecciona..."
                                            cacheOptions 
                                            onChange = {this.handleOnChangeCliente}
                                            options={options} 
                                            loadOptions={promiseOptions}/>                                            
                                        </div>
                                        
                                    )
                                    {/*  */}
                                }else if(type == 'react-select-origen'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectOrigen}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'react-select-destino'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectDestino}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'react-select-transbordos'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            isMulti
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    );
                                }else if(type == 'select-chofer_1'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectChofer1}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'select-chofer_2'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectChofer2}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'select-sobrecargo'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectSobrecargo}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'select-aux'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectAux}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'select-eco'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectEco}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }else if(type == 'select-ruta'){
                                    return(
                                        <div class="form-group" key={ field }>
                                            <label>{ name }</label>
                                            <Select
                                            id={field}
                                            ref={field}
                                            onChange={this.handleChangeSelectRuta}
                                            options={options}
                                            placeholder = "Selecciona..."
                                            />
                                        </div>
                                    )
                                }
                            }
                        })
                    }
                </div>
            </div>
        );
    }
}