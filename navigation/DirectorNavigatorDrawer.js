import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import HomeDirectorScreen from '../screens/director/HomeDirectorScreen';
import CrearProyectoScreen from '../screens/director/CrearProyectoScreen';
import CrearReporteScreen from '../screens/director/CrearReporteScreen';
import CrearPlaneacionScreen from '../screens/director/CraerPlaneacionScreen';
import HitosScreen from '../screens/director/HitosScreen';
import AgregarHitoScreen from '../screens/director/AgregarHitoScreen';
import AgregarTareaScreen from '../screens/director/AgregarTareaScreen'; 
import GastosDirectorScreen from '../screens/director/GastosDirectorScreen';
import AgregarGastoScreen from '../screens/director/AgregarGastoScreen';
import PlanearGastosScreen from '../screens/director/PlanearGastosScreen';
import DesgloseGastoScreen from '../screens/director/DesgloseGastoScreen';
import DesgloseGastoAddScreen from '../screens/director/DesgloseGastoAddScreen';
//import DesgloseAvanceScreen from '../screens/director/DesgloseAvanceScreen';
import DesgloseAvanceScreen from '../screens/residente/DesgloseAvanceScreen';
import HitoScreen from '../screens/residente/HitoScreen';

import DesgloseCobrosScreen from '../screens/director/DesgloseCobrosScreen';
import SidebarDirector from '../components/SidebarDirector';
import DetalleProyectoScreen from '../screens/director/DetalleProyectoScreen';
import Layout from '../constants/Layout';
import ProrrateoScreen from '../screens/director/ProrrateoScreen';
import EditHitoScreen from '../screens/director/EditHitoScreen';
import GenerarReporteScreen from '../screens/director/GenerarReporteScreen';
import RegistrarGastoScreen from '../screens/director/RegistrarGastoScreen';
import EditarDesgloseGastoScreen from '../screens/director/EditarDesgloseGastoScreen';
import EditarGastoScreen from '../screens/director/EditarGastoScreen';
import AgregarCobroScreen from '../screens/director/AgregarCobroScreen';
import AddUserScreen from '../screens/director/AddUserScreen';
  
const HomeStack= createStackNavigator({
        HomeDirector: HomeDirectorScreen,
        DetalleProyecto: DetalleProyectoScreen,
        RegistrarGasto: RegistrarGastoScreen,
        AgregarTarea: AgregarTareaScreen,
        CrearPlaneacion: CrearPlaneacionScreen,
        Hitos: HitosScreen,
        Hito: HitoScreen,
        AgregarHito: AgregarHitoScreen,
        GastosDirector: GastosDirectorScreen,
        AgregarGasto: AgregarGastoScreen,
        AgregarCobro: AgregarCobroScreen,
        PlanearGastos: PlanearGastosScreen,
        DesgloseGasto: DesgloseGastoScreen,
        DesgloseAvance: DesgloseAvanceScreen,
        DesgloseCobros: DesgloseCobrosScreen,
        DesgloseGastoAdd: DesgloseGastoAddScreen,
        EditarDesgloseGasto: EditarDesgloseGastoScreen,
        EditarGasto: EditarGastoScreen,
        EditHito: EditHitoScreen
    },
    {
        initialRouteName: 'HomeDirector',
        headerMode: 'none'
    });

const CrearProyectoStack = createStackNavigator({
        CrearProyectoHome: CrearProyectoScreen,
        AddUser: AddUserScreen
    },
    {
        initialRouteName: 'CrearProyectoHome',
        headerMode: 'none'
    });
const CrearReporteStack= createStackNavigator({
        CrearReporteHome: CrearReporteScreen,
        GenerarReporte: GenerarReporteScreen
    },
    {
        initialRouteName: 'CrearReporteHome',
        headerMode: 'none'
    })
const DirectorNavigatorDrawer = createDrawerNavigator({
    HomeStack: {
        screen: HomeStack,
    },
    CrearProyecto:{
        screen: CrearProyectoStack
    },
    CrearReporte: {
        screen: CrearReporteStack
    },
    Prorrateo: {
        screen: ProrrateoScreen
    } 
}, {
        initialRouteName: 'HomeStack',
        drawerWidth: Layout.window.width,
        drawerBackgroundColor: 'rgba(17, 17, 17, .1);',
        contentComponent: props => <SidebarDirector {...props} />,
    });

const Drawer = createAppContainer(DirectorNavigatorDrawer);


export default createAppContainer(Drawer);