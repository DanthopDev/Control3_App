import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import * as Icon from '@expo/vector-icons';
import DetalleAlmacenScreen from '../screens/almacenista/DetalleAlmacenScreen';
import PerfilScreen from '../screens/almacenista/PerfilScreen';
import LogOutScreen from '../screens/almacenista/LogOutScreen';
import Colors from '../constants/Colors';
import MenuProyectosScreen from '../screens/almacenista/MenuProyectosScreen';
import DetalleVehiculoScreen from '../screens/almacenista/DetalleVehiculoScreen';
import DetalleHerramientaScreen from '../screens/almacenista/DetalleHerramientaScreen';
import AddMaterialScreen from '../screens/almacenista/AddMaterialScreen';

const HomeStack = createStackNavigator({
  MenuProyectos: MenuProyectosScreen,
  Detalle: DetalleAlmacenScreen,
  DetalleVehiculo: DetalleVehiculoScreen,
  DetalleHerramienta: DetalleHerramientaScreen,
  AddMaterial: AddMaterialScreen
},{
    initialRouteName: 'MenuProyectos',
    headerMode: 'none'
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Inicio',
  tabBarIcon: ({ tintColor }) => (
    <Icon.AntDesign
      name={'home'}
      size={26}
      style={{ marginBottom: -3 }}
      color={tintColor}
    />
  ),
};

const PerfilStack = createStackNavigator({
  Links: PerfilScreen,
});

PerfilStack.navigationOptions = {
  tabBarLabel: 'Perfil',
  tabBarIcon: ({ tintColor, focused}) => (
    <Icon.FontAwesome
      name={focused ? 'user-circle' : 'user-circle-o'}
      size={26}
      style={{ marginBottom: -3 }}
      color={tintColor}
    />
  ),
};

const LogOutStack = createStackNavigator({
  LogOut: LogOutScreen,
});

LogOutStack.navigationOptions = {
  tabBarLabel: 'Salir',
  tabBarIcon: ({ tintColor }) => (
    <Icon.Feather
      name={'log-out'}
      size={26}
      style={{ marginBottom: -3 }}
      color={tintColor}
    />
  ),
};

export default createAppContainer(createBottomTabNavigator({
  HomeStack,
  PerfilStack,
  LogOutStack,
},
  {
    initialRouteName: 'HomeStack',
    tabBarOptions: {
      activeTintColor: Colors.title,
      keyboardHidesTabBar: true,
      inactiveTintColor: 'gray',
      tabStyle: { backgroundColor: Colors.background }
    },
  }));
