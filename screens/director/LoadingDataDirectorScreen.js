import React, { Component } from 'react';
import { AsyncStorage, Alert, Platform} from 'react-native';
import DirectorNavigatorDrawer from '../../navigation/DirectorNavigatorDrawer';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import URLBase from '../../constants/URLBase';
import Colors from '../../constants/Colors';

export default class LoadingDataDirectorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            progressAvancesGeneral: 0,
            progressCobrosGeneral: 0,
            progressGastosGeneral: 0,
            proyectos: [],
            userLogOut: this.logout.bind(this),
            getInfoDirector: this.getInfoDirector.bind(this),
            updateProyectos: this.updateProyectos.bind(this)
        };
    }

    async componentWillMount() {
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('Control3 messages', {
                name: 'Control3 messages',
                sound: true,
            });
        }
        if (Platform.OS === 'ios') {
            Notifications.setBadgeNumberAsync(0);
        }
        const token = await this.getToken();
        console.log('Recuperar token:', token);
       // Alert.alert('Token: ', token);
        console.log('Propiedades::::::::::::::::::::::::::::::::::::::::::::', this.props.navigation.state.params.userInfo.user.email);
        if (this.props.navigation.state.params.userInfo.user.email=='appios@control3.mx'){
            this.getInfoDirector();
        } else {
            if (token == null) {
                this.registerForPushNotificationsAsync();
            } else {
                this.notificationSubscription = Notifications.addListener(this.handleNotification);
                this.setState({
                    token: token
                });
                // Alert.alert('Token: ', token);
                this.getInfoDirector();
            }   
        }
    }

    async getToken() {
        return await AsyncStorage.getItem('token');
    }

    setToken(token) {
        return AsyncStorage.setItem('token', token);
    }
    
    async registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // pregunta sobre el estado del actual del permiso
        // En iOS es necesario volver a preguntar.
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        // se detiene porque el usuario no permitio las notificaciones
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        console.log('TOKEN::::**************************************');
        console.log(token);
        this.setState({
            token: token
        });
        this.sendToken(token);
        /*console.log('******************** LOADING DATA Residente*****************');
        console.log(this.props); */
    }

    sendToken(token) {
        const { userInfo } = this.props.navigation.state.params;
        var formData = new FormData();
        formData.append('token', token);
        if (Platform.OS === 'android') {
            formData.append('os', 'android');
        } else {
            formData.append('os', 'ios');
        }
        formData.append('dispositivo', Constants.deviceName);
        fetch(URLBase + '/auth/token', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + userInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON MANDAR TOKEN *********************');
                console.log(responseJson);
                if (responseJson.message) {
                    if (responseJson.message = 'Successfully created token') {
                        this.setToken(token);
                        this.notificationSubscription = Notifications.addListener(this.handleNotification);
                        this.getInfoDirector();
                    } else {
                        Alert.alert('Error', 'No fue posible generar el token de notificación');
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleNotification = (notification) => {
        console.log(notification);
        console.log(notification.data);
        if (Platform.OS === 'ios') {
            this.enviarNotificacionLocal(notification);
        }
    }

    enviarNotificacionLocal = (notification) => {
        showMessage({
            message: notification.data.title,
            description: notification.data.message,
            type: "success",
            icon: { icon: "auto", position: "left" },
            animationDuration: 3000,
            backgroundColor: Colors.primary,
            color: Colors.title,
        });
    }

    async removeSesion() {
        try {
            await AsyncStorage.clear();
            this.props.navigation.navigate('Auth');
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }
    
    async logout() {
        const { userInfo } = this.props.navigation.state.params;
        var formData = new FormData();
        formData.append('token', this.state.token);
        console.log('token: ', this.state.token);
        fetch(URLBase + '/auth/logout', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + userInfo.access_token,
                Accept: 'application/json',
            },
            body: formData,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON UPDATE CERRAR SESION *********************');
                console.log(responseJson);
                if (responseJson.message) {
                    if (responseJson.message == 'Successfully logged out') {
                        this.removeSesion();
                    } else if (responseJson.message == "Unauthenticated.") {
                        this.removeSesion();
                    } else {
                        Alert.alert('Error al cerrar sesión', responseJson.message);
                        this.removeSesion();
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    
    getInfoDirector = async () => {
        const { userInfo } = this.props.navigation.state.params;
        this.setState({
            isLoading: true,
            refreshing: true
        });
        fetch(URLBase + '/dir/getProyectos', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + userInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('**************GET PROYECTOS******************');
                console.log(responseJson);
                if (responseJson.message) {
                    if (responseJson.message == "Unauthenticated."){
                        Alert.alert('Error de acceso', 'Cerrando sesión...');
                        this.removeSesion();
                    }else {
                        Alert.alert('Error de acceso', responseJson.message);
                    }
                } else {
                    arrayProyectos = responseJson.avancesPorProyecto;
                    orderProyectos = arrayProyectos.sort((a, b) => a.nombre.toLowerCase() > b.nombre.toLowerCase());
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        accessInfo: userInfo,
                        progressAvancesGeneral: parseFloat(responseJson.promedioAvanceGeneral),
                        progressCobrosGeneral: parseFloat(responseJson.promedioCobrosGeneral),
                        progressGastosGeneral: parseFloat(responseJson.promedioGastosGeneral),
                        proyectos: orderProyectos,
                        unidades: responseJson.unidades,
                        categorias: responseJson.categorias
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }

    updateProyectos = async () => {
        const { userInfo } = this.props.navigation.state.params;
        fetch(URLBase + '/dir/getProyectos', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + userInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('**************UPDATE PROYECTOS******************');
                //console.log(responseJson);
                if (responseJson.message) {
                    if (responseJson.message == "Unauthenticated.") {
                        Alert.alert('Error de acceso', 'Cerrando sesión...');
                        this.removeSesion();
                    } else {
                        Alert.alert('Error de acceso', responseJson.message);
                    }
                } else {
                    arrayProyectos = responseJson.avancesPorProyecto;
                    orderProyectos = arrayProyectos.sort((a, b) => a.nombre.toLowerCase() > b.nombre.toLowerCase());
                    this.setState({
                        progressAvancesGeneral: parseFloat(responseJson.promedioAvanceGeneral),
                        progressCobrosGeneral: parseFloat(responseJson.promedioCobrosGeneral),
                        progressGastosGeneral: parseFloat(responseJson.promedioGastosGeneral),
                        proyectos: orderProyectos,
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }
  render() {
    return (
        <DirectorNavigatorDrawer screenProps={this.state} />
        );
  }
}
