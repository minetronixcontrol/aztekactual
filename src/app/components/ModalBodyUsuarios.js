import React, { Component } from 'react';
import {Container, Col, Row} from 'reactstrap';

var newRow = {};

export default class MyCustomBody extends React.Component {
    constructor(props){
        super(props);
    }
    
    getFieldValue () {
      const newUser = {};
      //Primero procederemos a guardar el campo y despues mandamos la nueva columna, ya con el id nuevo
      //const response = await this.saveUsuario(this.asignNewUser());
      this.props.columns.forEach((column, i) => {
        if(column.field != "_id"){
          newUser[column.field] = document.getElementById(column.field).value;
        }else{
          newUser[column.field] = 0;
        }
      }, this);
      
      return newUser;

    }

    render() {
      const columns = this.props;
      return (
        <div className='modal-body'>
          <div>
            {
              this.props.columns.map((column, i) => {
                const {
                    type,
                    options,
                    defaultValue,
                    field,
                    name,
                    hiddenOnInsert
                } = column;
  
                if (hiddenOnInsert) {
                  // when you want same auto generate value
                  // and not allow edit, for example ID field
                  return null;
                }else{
                    if(type == 'input'){
                        return(
                            <div class="form-group" key={ field }>
                                <label>{ name }</label>
                                <input ref={ field } type="text" class="form-control" id={ field } placeholder=""/>
                            </div>
                        )
                    }else if(type == 'select' && field == 'sucursal'){
                        return(
                            <div class="form-group" key={ field }>
                                <label>{ name }</label>
                                <select class="form-control" id={ field }>
                                    {
                                        this.props.sucursales.map((sucursal, i) => <option key={sucursal._id} value={sucursal._id}>{sucursal.nombre}</option>)
                                    }
                                </select>
                            </div>
                        )
                    }else if(type == 'select' && field == 'seguridad'){
                        return(
                            <div class="form-group" key={ field }>
                                <label>{ name }</label>
                                <select class="form-control" id={ field }>
                                    <option value="Ventas">Ventas</option>
                                    <option value="Viajes">Viajes</option>
                                    <option value="Matriz">Matriz</option>
                                    <option value="Reservaciones">Reservaciones</option>
                                    <option value="Admin">Administrador</option>
                                </select>
                            </div>
                        )
                    }else if(type == 'select' && field == 'tipoDescuento'){
                        return(
                            <div class="form-group" key={ field }>
                                <label>{ name }</label>
                                <select class="form-control" id={ field }>
                                    <option value="Público">Público</option>
                                    <option value="Privado">Privado</option>
                                    <option value="Ninguno">Ninguno</option>
                                </select>
                            </div>
                        )
                    }
                }
                /*const error = validateState[field] ?
                  (<span className='help-block bg-danger'>{ validateState[field] }</span>) :
                  null;
                return (
                  <div className='form-group' key={ field }>
                    <label>{ name }</label>
                    <input ref={ field } type='text' defaultValue={ '' } />
                    { error }
                  </div>
                );*/
              })
            }
          </div>
        </div>
      );
    }
  }


  