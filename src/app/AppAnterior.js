import React                      from 'react';
import Camiones                   from './components/Camiones';
import Clientes                   from './components/Clientes';
import ConfiguracionBoletos       from './components/ConfiguracionBoletos';
import ConfiguracionDePublicidad  from './components/ConfiguracionDePublicidad';
import ConfigurarViajes           from './components/ConfigurarViajes';
import ConfigurarPrecios          from './components/ConfigurarPrecios';
import Corte                      from './components/Corte';
import Index                      from './components/Index';
import ListaAbordaje              from './components/ListaAbordaje';
import ListaNegra                 from './components/ListaNegra';
import Login                      from './components/Login';
import ModificarReservacion       from './components/ModificarReservacion';
import ModificarVenta             from './components/ModificarVenta';
import NavBar                     from './components/NavBar/NavBar';
import NavBarVentas               from './components/NavBar/NavBarVentas';
import NavBarViajes               from './components/NavBar/NavBarViajes';
import NavBarMatriz               from './components/NavBar/NavBarMatriz';
import NuevaReservacion           from './components/NuevaReservacion';
import NuevaVenta                 from './components/NuevaVenta';
import Origenes                   from './components/Origenes';
import PapeleraDeReciclaje        from './components/PapeleraDeReciclaje';
import Publicidad                 from './components/Publicidad';
import Precios                    from './components/Precios';
import Reservaciones              from './components/Reservaciones';
import ReservacionesCanceladas    from './components/ReservacionesCanceladas';
import ReservacionesConcluidas    from './components/ReservacionesConcluidas';
import Rutas                      from './components/Rutas';
import Tripulantes                from './components/Tripulantes';
import Usuarios                   from './components/Usuarios';
import VentasCanceladas           from './components/VentasCanceladas';
import VentasConcluidas           from './components/VentasConcluidas';
import Viajes                     from './components/Viajes';
import Sucursales                 from './components/Sucursales';
import ConfigurarSucursales       from './components/ConfigurarSucursales';
import Descuentos                 from './components/Descuentos';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
class App extends React.Component {
  render() {
    return (
     // <Router>
      <React.Fragment>
        <Route exact path="/"                     component={Login}/>
        {/*Navegacion de SuperUsuario */} 
        <Route path="/Camiones/:id_Usuario?"                   component={NavBar}/>
        <Route path="/Camiones/:id_Usuario?"                   component={Camiones}/>
        <Route path="/Clientes/:id_Usuario?"                   component={NavBar}/>
        <Route path="/Clientes/:id_Usuario?"                   component={Clientes}/>
        <Route path="/ConfiguracionBoletos/:id_Usuario?"       component={NavBar}/>
        <Route path="/ConfiguracionBoletos/:id_Usuario?"       component={ConfiguracionBoletos}/>
        <Route path="/ConfiguracionDePublicidad/:id_Usuario?"  component={NavBar}/>
        <Route path="/ConfiguracionDePublicidad/:id_Usuario?"  component={ConfiguracionDePublicidad}/>
        <Route path="/ConfigurarViajes/:id_Usuario?"           component={NavBar}/>
        <Route path="/ConfigurarViajes/:id_Usuario?"           component={ConfigurarViajes}/>
        <Route path="/Corte/:id_Usuario?"                      component={NavBar}/>
        <Route path="/Corte/:id_Usuario?"                      component={Corte}/>
        <Route path="/Index/:id_Usuario?"                      component={NavBar}/>
        <Route path="/Index/:id_Usuario?"                      component={Index}/>
        <Route path="/ListaAbordaje/:id_Usuario?"              component={NavBar}/>
        <Route path="/ListaAbordaje/:id_Usuario?"              component={ListaAbordaje}/>
        <Route path="/ListaNegra/:id_Usuario?"                 component={NavBar}/>
        <Route path="/ListaNegra/:id_Usuario?"                 component={ListaNegra}/>
        <Route path="/ModificarReservacion/:id_Usuario?"       component={NavBar}/>
        <Route path="/ModificarReservacion/:id_Usuario?"       component={ModificarReservacion}/>
        <Route path="/ModificarVenta/:id_Usuario?"             component={NavBar}/>
        <Route path="/ModificarVenta/:id_Usuario?"             component={ModificarVenta}/>
        <Route path="/NuevaReservacion/:id_Usuario?"           component={NavBar}/>
        <Route path="/NuevaReservacion/:id_Usuario?"           component={NuevaReservacion}/>
        <Route path="/NuevaVenta/:id_Usuario?"                 component={NavBar}/>
        <Route path="/NuevaVenta/:id_Usuario?"                 component={NuevaVenta}/>
        <Route path="/OrigenesyDestinos/:id_Usuario?"          component={NavBar}/>
        <Route path="/OrigenesyDestinos/:id_Usuario?"          component={Origenes}/>
        <Route path="/PapeleraDeReciclaje/:id_Usuario?"        component={NavBar}/>
        <Route path="/PapeleraDeReciclaje/:id_Usuario?"        component={PapeleraDeReciclaje}/>
        <Route path="/Publicidad/:id_Usuario?"                 component={NavBar}/>
        <Route path="/Publicidad/:id_Usuario?"                 component={Publicidad}/>
        <Route path="/Reservaciones/:id_Usuario?"              component={NavBar}/>
        <Route path="/Reservaciones/:id_Usuario?"              component={Reservaciones}/>
        <Route path="/ReservacionesCanceladas/:id_Usuario?"    component={NavBar}/>
        <Route path="/ReservacionesCanceladas/:id_Usuario?"    component={ReservacionesCanceladas}/>
        <Route path="/ReservacionesConcluidas/:id_Usuario?"    component={NavBar}/>
        <Route path="/ReservacionesConcluidas/:id_Usuario?"    component={ReservacionesConcluidas}/>
        <Route path="/Rutas/:id_Usuario?"                      component={NavBar}/>
        <Route path="/Rutas/:id_Usuario?"                      component={Rutas}/>
        <Route path="/Tripulantes/:id_Usuario?"                component={NavBar}/>
        <Route path="/Tripulantes/:id_Usuario?"                component={Tripulantes}/>
        <Route path="/Usuarios/:id_Usuario?"                   component={NavBar}/>
        <Route path="/Usuarios/:id_Usuario?"                   component={Usuarios}/>
        <Route path="/VentasCanceladas/:id_Usuario?"           component={NavBar}/>
        <Route path="/VentasCanceladas/:id_Usuario?"           component={VentasCanceladas}/>
        <Route path="/Ventasconcluidas/:id_Usuario?"           component={NavBar}/>
        <Route path="/VentasConcluidas/:id_Usuario?"           component={VentasConcluidas}/>
        <Route path="/Viajes/:id_Usuario?"                     component={NavBar}/>
        <Route path="/Viajes/:id_Usuario?"                     component={Viajes}/>
        <Route path="/Sucursales/:id_Usuario?"                 component={NavBar}/>
        <Route path="/Sucursales/:id_Usuario?"                 component={Sucursales}/>
        <Route path="/ConfigurarSucursales/:id_Usuario?"       component={NavBar}/>
        <Route path="/ConfigurarSucursales/:id_Usuario?"       component={ConfigurarSucursales}/>
        <Route path="/Descuentos/:id_Usuario?"                 component={NavBar}/>
        <Route path="/Descuentos/:id_Usuario?"                 component={Descuentos}/>
        <Route path="/Precios/:id_Usuario?"                    component={NavBar}/>
        <Route path="/Precios/:id_Usuario?"                    component={Precios}/>
        <Route path="/ConfigurarPrecios/:id_Usuario?"          component={NavBar}/>
        <Route path="/ConfigurarPrecios/:id_Usuario?"          component={ConfigurarPrecios}/>
        {/*Navegacion de Agente de ventas */}
        <Route path="/Ventas_Corte/:id_Usuario?"             component={NavBarVentas}/>
        <Route path="/Ventas_Corte/:id_Usuario?"             component={Corte}/>
        <Route path="/Ventas_Clientes/:id_Usuario?"          component={NavBarVentas}/>
        <Route path="/Ventas_Clientes/:id_Usuario?"          component={Clientes}/>
        <Route path="/Ventas_Index/:id_Usuario?"             component={NavBarVentas}/>
        <Route path="/Ventas_Index/:id_Usuario?"             component={Index}/>
        <Route path="/Ventas_Publicidad/:id_Usuario?"        component={NavBarVentas}/>
        <Route path="/Ventas_Publicidad/:id_Usuario?"        component={Publicidad}/>
        <Route path="/Ventas_Viajes/:id_Usuario?"            component={NavBarVentas}/>
        <Route path="/Ventas_Viajes/:id_Usuario?"            component={Viajes}/>
        <Route path="/Ventas_VentasConcluidas/:id_Usuario?"  component={NavBarVentas}/>
        <Route path="/Ventas_VentasConcluidas/:id_Usuario?"  component={VentasConcluidas}/>
        <Route path="/Ventas_VentasCanceladas/:id_Usuario?"  component={NavBarVentas}/>
        <Route path="/Ventas_VentasCanceladas/:id_Usuario?"  component={VentasCanceladas}/>
        {/*Navegacion de Agente de Viajes */}
        <Route path="/Viajes_Camiones/:id_Usuario?"                   component={NavBarViajes}/>
        <Route path="/Viajes_Camiones/:id_Usuario?"                   component={Camiones}/>
        <Route path="/Viajes_Clientes/:id_Usuario?"                   component={NavBarViajes}/>
        <Route path="/Viajes_Clientes/:id_Usuario?"                   component={Clientes}/>
        <Route path="/Viajes_ConfigurarViajes/:id_Usuario?"           component={NavBarViajes}/>
        <Route path="/Viajes_ConfigurarViajes/:id_Usuario?"           component={ConfigurarViajes}/>
        <Route path="/Viajes_Corte/:id_Usuario?"                      component={NavBarViajes}/>
        <Route path="/Viajes_Corte/:id_Usuario?"                      component={Corte}/>
        <Route path="/Viajes_Index/:id_Usuario?"                      component={NavBarViajes}/>
        <Route path="/Viajes_Index/:id_Usuario?"                      component={Index}/>
        <Route path="/Viajes_NuevaVenta/:id_Usuario?"                 component={NavBarViajes}/>
        <Route path="/Viajes_NuevaVenta/:id_Usuario?"                 component={NuevaVenta}/>
        <Route path="/Viajes_OrigenesyDestinos/:id_Usuario?"          component={NavBarViajes}/>
        <Route path="/Viajes_OrigenesyDestinos/:id_Usuario?"          component={Origenes}/>
        <Route path="/Viajes_Publicidad/:id_Usuario?"                 component={NavBarViajes}/>
        <Route path="/Viajes_Publicidad/:id_Usuario?"                 component={Publicidad}/>
        <Route path="/Viajes_Tripulantes/:id_Usuario?"                component={NavBarViajes}/>
        <Route path="/Viajes_Tripulantes/:id_Usuario?"                component={Tripulantes}/>
        <Route path="/Viajes_VentasCanceladas/:id_Usuario?"           component={NavBarViajes}/>
        <Route path="/Viajes_VentasCanceladas/:id_Usuario?"           component={VentasCanceladas}/>
        <Route path="/Viajes_Ventasconcluidas/:id_Usuario?"           component={NavBarViajes}/>
        <Route path="/Viajes_VentasConcluidas/:id_Usuario?"           component={VentasConcluidas}/>
        <Route path="/Viajes_Viajes/:id_Usuario?"                     component={NavBarViajes}/>
        <Route path="/Viajes_Viajes/:id_Usuario?"                     component={Viajes}/>
        <Route path="/Viajes_Descuentos/:id_Usuario?"                 component={NavBar}/>
        <Route path="/Viajes_Descuentos/:id_Usuario?"                 component={Descuentos}/>
        {/*Navegacion Matriz */}
        <Route path="/Matriz_Clientes/:id_Usuario?"                   component={NavBarMatriz}/>
        <Route path="/Matriz_Clientes/:id_Usuario?"                   component={Clientes}/>
        <Route path="/Matriz_Corte/:id_Usuario?"                      component={NavBarMatriz}/>
        <Route path="/Matriz_Corte/:id_Usuario?"                      component={Corte}/>
        <Route path="/Matriz_Index/:id_Usuario?"                      component={NavBarMatriz}/>
        <Route path="/Matriz_Index/:id_Usuario?"                      component={Index}/>
        <Route path="/Matriz_ListaAbordaje/:id_Usuario?"              component={NavBarMatriz}/>
        <Route path="/Matriz_ListaAbordaje/:id_Usuario?"              component={ListaAbordaje}/>
        <Route path="/Matriz_NuevaReservacion/:id_Usuario?"           component={NavBarMatriz}/>
        <Route path="/Matriz_NuevaReservacion/:id_Usuario?"           component={NuevaReservacion}/>
        <Route path="/Matriz_NuevaVenta/:id_Usuario?"                 component={NavBarMatriz}/>
        <Route path="/Matriz_NuevaVenta/:id_Usuario?"                 component={NuevaVenta}/>
        <Route path="/Matriz_OrigenesyDestinos/:id_Usuario?"          component={NavBarMatriz}/>
        <Route path="/Matriz_OrigenesyDestinos/:id_Usuario?"          component={Origenes}/>
        <Route path="/Matriz_Publicidad/:id_Usuario?"                 component={NavBarMatriz}/>
        <Route path="/Matriz_Publicidad/:id_Usuario?"                 component={Publicidad}/>
        <Route path="/Matriz_Reservaciones/:id_Usuario?"              component={NavBarMatriz}/>
        <Route path="/Matriz_Reservaciones/:id_Usuario?"              component={Reservaciones}/>
        <Route path="/Matriz_ReservacionesCanceladas/:id_Usuario?"    component={NavBarMatriz}/>
        <Route path="/Matriz_ReservacionesCanceladas/:id_Usuario?"    component={ReservacionesCanceladas}/>
        <Route path="/Matriz_ReservacionesConcluidas/:id_Usuario?"    component={NavBarMatriz}/>
        <Route path="/Matriz_ReservacionesConcluidas/:id_Usuario?"    component={ReservacionesConcluidas}/>
        <Route path="/Matriz_Tripulantes/:id_Usuario?"                component={NavBarMatriz}/>
        <Route path="/Matriz_Tripulantes/:id_Usuario?"                component={Tripulantes}/>
        <Route path="/Matriz_VentasCanceladas/:id_Usuario?"           component={NavBarMatriz}/>
        <Route path="/Matriz_VentasCanceladas/:id_Usuario?"           component={VentasCanceladas}/>
        <Route path="/Matriz_Ventasconcluidas/:id_Usuario?"           component={NavBarMatriz}/>
        <Route path="/Matriz_VentasConcluidas/:id_Usuario?"           component={VentasConcluidas}/>
        <Route path="/Matriz_Viajes/:id_Usuario?"                     component={NavBarMatriz}/>
        <Route path="/Matriz_Viajes/:id_Usuario?"                     component={Viajes}/>
      </React.Fragment>  
    )
  }
}
export default App;