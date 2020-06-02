import React, { Component } from 'react';
import { AsyncStorage, Alert, Platform } from 'react-native';
import AlmacenistaTabNavigator from '../../navigation/AlmacenistaTabNavigator';
import Colors from '../../constants/Colors';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import URLBase from '../../constants/URLBase';

export default class LoadingDataAlmScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            accessInfo: props.navigation.state.params.userInfo,
            userLogOut: this.logout.bind(this)
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
        if (token == null) {
            this.registerForPushNotificationsAsync();
        } else {
            this.notificationSubscription = Notifications.addListener(this.handleNotification);
            this.setState({
                isLoading: false,
                token: token
            });
           // Alert.alert('Token: ', token);
        }
    }
    changeState(proyectos) {
        this.setState({
            proyectos: proyectos
        });
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
                        this.setState({
                            isLoading: false
                        });
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
            Notifications.setBadgeNumberAsync(0);
        }
    }
    enviarNotificacionLocal = (notification) => {
        showMessage({
            message: notification.data.title,
            description: notification.data.message,
            type: "success",
            icon: { icon: "auto", position: "left" },
            animationDuration: 1000,
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
                    }else {
                        Alert.alert('Error al cerrar sesión', responseJson.message);
                        this.removeSesion();
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
   
    render() {
            return (
                <AlmacenistaTabNavigator screenProps={this.state} />
            );
    }
}
