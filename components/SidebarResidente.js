import React, { Component } from 'react';
import { View, Alert, AsyncStorage, Image, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import Colors from '../constants/Colors';
import AwesomeAlert from 'react-native-awesome-alerts';
import SharedStyles from '../constants/SharedStyles';

export default class SidebarDirector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }
    
    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={{ width: 220 }}>
                    <View style={{
                        backgroundColor: Colors.primary,
                        borderBottomColor: Colors.title,
                        borderBottomWidth: 5,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={require('../assets/images/menu_residente.png')}
                            style={{ width: 120, height: 30 }}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={{ backgroundColor: Colors.background }}>
                        <ListItem
                            key={'1'}
                            bottomDivider
                            titleStyle={{ fontFamily: 'avenir-book', fontSize: 14 }}
                            title={'Inicio'}
                            leftIcon={{
                                name: 'home',
                                type: 'antdesign',
                                color: Colors.title,
                                size: 16
                            }}
                            onPress={() => {
                                navigation.navigate('HomeStack');
                                navigation.closeDrawer();
                            }}
                        />
                        <ListItem
                            key={'2'}
                            bottomDivider
                            titleStyle={{ fontFamily: 'avenir-book', fontSize: 14 }}
                            title={'Asistencia'}
                            leftIcon={{
                                name: "ios-checkmark-circle-outline",
                                type: 'ionicon',
                                color: Colors.title,
                                size: 16
                            }}
                            onPress={() => {
                              navigation.navigate('AsistenciaStack');
                                navigation.closeDrawer();
                            }}
                        />
                        <ListItem
                            key={'3'}
                            bottomDivider
                            titleStyle={{ fontFamily: 'avenir-book', fontSize: 14 }}
                            title={'Realizar Solicitud'}
                            leftIcon={{
                                name: 'form',
                                type: 'antdesign',
                                color: Colors.title,
                                size: 16
                            }}
                            onPress={() => {
                                navigation.navigate('SolicitudStack');
                                navigation.closeDrawer();
                            }}
                        />
                        <ListItem
                            key={'4'}
                            bottomDivider
                            titleStyle={{ fontFamily: 'avenir-book', fontSize: 14 }}
                            title={'Reporte de Pago'}
                            leftIcon={{
                                name: 'dollar-sign',
                                type: 'feather',
                                color: Colors.title,
                                size: 16
                            }}
                            onPress={() => {
                               navigation.navigate('Destajo');
                               navigation.closeDrawer();
                            }}
                        />
                        <ListItem
                            key={'5'}
                            bottomDivider
                            titleStyle={{ fontFamily: 'avenir-book', fontSize: 14 }}
                            title={'Almacén'}
                            leftIcon={{
                                name: 'archive',
                                type: 'entypo',
                                color: Colors.title,
                                size: 16
                            }}
                            onPress={() => {
                                navigation.navigate('Almacen');
                                navigation.closeDrawer();
                            }}
                        />
                        <ListItem
                            key={'6'}
                            bottomDivider
                            titleStyle={{ fontFamily: 'avenir-book', fontSize: 14 }}
                            title={'Salir'}
                            leftIcon={{
                                name: "log-out",
                                type: 'feather',
                                color: Colors.title,
                                size: 16
                            }}
                            onPress={() => this.setState({ showAlert: true })}
                        />
                    </View>
                </View>
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlert}
                    title={'Cerrar sesión'}
                    message={'¿Estás seguro de salir de Control 3?'}
                    closeOnTouchOutside={false}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Confirmar'
                    cancelText='Cancelar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false
                        }, function () {
                                this.props.screenProps.userLogOut();
                        });
                    }}
                    onDismiss={() => {
                    }}
                />
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70
    },
});

