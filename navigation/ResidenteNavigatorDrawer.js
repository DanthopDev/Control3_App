import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeResidenteScreen from '../screens/residente/HomeResidenteScreen';
import SidebarResidente from '../components/SidebarResidente';
import Layout from '../constants/Layout';
import AsistenciaScreen from '../screens/residente/AsistenciaScreen';
import AddAsistenciaScreen from '../screens/residente/AddAsistenciaScreen';
import HitoScreen from '../screens/residente/HitoScreen';

import DetalleProyectoResidenteScreen from '../screens/residente/DetalleProyectoResidenteScreen';
import DesgloseAvanceScreen from '../screens/residente/DesgloseAvanceScreen';
import GastosResidenteScreen from '../screens/residente/GastosResidenteScreen';
import SolicitudScreen from '../screens/residente/SolicitudScreen';
import RegistrarGastoScreen from '../screens/residente/RegistrarGastoScreen';
import ReportesScreen from '../screens/residente/ReportesScreen';
import GenerarReporteScreen from '../screens/residente/GenerarReporteScreen';
import DesgloseGastoScreen from '../screens/residente/DesgloseGastoScreen';
import DestajoScreen from '../screens/residente/DestajoScreen';
import MenuDestajoScreen from '../screens/residente/MenuDestajoScreen';
import AddDestajoScreen from '../screens/residente/AddDestajoScreen';
import MenuAsistenciaScreen from '../screens/residente/MenuAsistenciaScreen';
import MenuSolicitudScreen from '../screens/residente/MenuSolicitudScreen';
import GenerarSolicitudScreen from '../screens/residente/GenerarSolicitudScreen';
import EditObreroScreen from '../screens/residente/EditObreroScreen';
import MenuAddDestajoScreen from '../screens/residente/MenuAddDestajoScreen'
///Screens de Almacenista
import DetalleAlmacenScreen from '../screens/almacenista/DetalleAlmacenScreen';
import MenuProyectosScreen from '../screens/almacenista/MenuProyectosScreen';
import DetalleVehiculoScreen from '../screens/almacenista/DetalleVehiculoScreen';
import DetalleHerramientaScreen from '../screens/almacenista/DetalleHerramientaScreen';
import AddMaterialScreen from '../screens/almacenista/AddMaterialScreen';

const AlmacenStack = createStackNavigator({
    MenuProyectos: MenuProyectosScreen,
    Detalle: DetalleAlmacenScreen,
    DetalleVehiculo: DetalleVehiculoScreen,
    DetalleHerramienta: DetalleHerramientaScreen,
    AddMaterial: AddMaterialScreen
},{
    initialRouteName: 'MenuProyectos',
    headerMode: 'none'
}); 

const HomeStack = createStackNavigator({
    HomeResidente: HomeResidenteScreen,
    Hito: HitoScreen,
    DetalleProyecto: DetalleProyectoResidenteScreen,
    DesgloseAvance: DesgloseAvanceScreen,
    GastosResidente: GastosResidenteScreen,
    Solicitud: SolicitudScreen,
    Asistencia: AsistenciaScreen,
    AddAsistencia: AddAsistenciaScreen,
    EditObrero: EditObreroScreen,
    RegistrarGasto: RegistrarGastoScreen,
    Reportes: ReportesScreen,
    GenerarReporte: GenerarReporteScreen,
    DesgloseGasto: DesgloseGastoScreen
},{
    initialRouteName: 'HomeResidente',
    headerMode: 'none'
});

const AsistenciaStack = createStackNavigator({
    MenuAsistencia: MenuAsistenciaScreen,
    TomarAsistencia: AsistenciaScreen,
    AddAsistencia: AddAsistenciaScreen,
    EditarObrero: EditObreroScreen,
},{
    initialRouteName: 'MenuAsistencia',
    headerMode: 'none'
});

const DestajoStack = createStackNavigator({
    MenuDestajo: MenuDestajoScreen,
    DesgloseDestajo: DestajoScreen,
    AddDestajo: AddDestajoScreen,
    MenuAddDestajo: MenuAddDestajoScreen,
    EditarObrero: EditObreroScreen,
},{
    initialRouteName: 'MenuDestajo',
    headerMode: 'none'
});

const SolicitudStack = createStackNavigator({
    MenuSolicitud: MenuSolicitudScreen,
    GenerarSolicitud: GenerarSolicitudScreen
},{
    initialRouteName: 'MenuSolicitud',
    headerMode: 'none'
});

const ResidenteNavigatorDrawer = createDrawerNavigator({
    HomeStack: {
        screen: HomeStack,
    },
    AsistenciaStack: {
        screen: AsistenciaStack
    },
    SolicitudStack: {
        screen: SolicitudStack
    },
    Destajo: {
        screen: DestajoStack
    },
    Almacen: {
        screen: AlmacenStack
    }
},{
    initialRouteName: 'HomeStack',
    drawerWidth: Layout.window.width,
    drawerBackgroundColor: 'rgba(17, 17, 17, .1);',
    contentComponent: props => <SidebarResidente {...props}/>
});

const Drawer = createAppContainer(ResidenteNavigatorDrawer);
export default createAppContainer(Drawer);