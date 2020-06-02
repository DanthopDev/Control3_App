import React, { Component } from 'react';
import { View, Alert, FlatList, StyleSheet, Platform, TouchableOpacity, StatusBar, RefreshControl} from 'react-native';
import { AvenirMedium } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import URLBase from '../../constants/URLBase';
import { HeaderBlack, HeaderBlackMenu } from '../../components/Headers';
import ProyectoName from '../../components/ProyectoName';
import  ObteniendoInformacion  from '../../components/ObteniendoInformacion';
import { ScrollView } from 'react-native-gesture-handler';

export default class MenuProyectosScreen extends Component {
    constructor(props) {
        super(props);
            this.state = {
                isLoading: true,
                refreshing: false,
                proyectos: []
            }
    }
    componentDidMount(){
            this.getInfoAlmacenista();
    }
    getInfoAlmacenista = async () => {
        const { accessInfo } = this.props.screenProps;
        fetch(URLBase + '/alm/getProyectos', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('**************GET ALMACEN******************');
                console.log(responseJson);
                if (responseJson.message) {
                    if (responseJson.message == "Unauthenticated.") {
                        Alert.alert('Error de acceso', 'Cerrando sesión...');
                        this.props.screenProps.userLogOut()
                    } else {
                        Alert.alert('Error de acceso', responseJson.message);
                    }
                } else {
                    arrayProyectos = responseJson.proyectos;
                    orderProyectos = arrayProyectos.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase());
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        proyectos: orderProyectos
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }
    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({ item }) => (
        <ProyectoName
            title={item.name ? item.name : item.nombre }
            onPress={() => {
                this.props.navigation.navigate('Detalle', { idProyecto: item.id, title: item.name });
            }}
        />
    );
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getInfoAlmacenista();
    }
    render() {
        return (
            <View style={SharedStyles.container}>
                { this.props.screenProps.residente && this.props.screenProps.residente==true ? <HeaderBlackMenu
                    title='Almacenes'
                    action={() => this.props.navigation.openDrawer()}
                /> : <HeaderBlack
                        title='Almacenes'
                    /> }
                <ScrollView 
                style={SharedStyles.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    { this.state.proyectos.length == 0 && (this.state.isLoading == false && this.props.screenProps.isLoading == false) ? <AvenirMedium style={styles.message}>
                        Sin proyectos asignados
                    </AvenirMedium> : null }
                        { this.state.isLoading==true || this.props.screenProps.isLoading==true  ? 
                            <ObteniendoInformacion /> :  <FlatList
                                data={this.state.proyectos}
                                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                                ListFooterComponent={() => <View style={{ height: 20 }} />}
                                ListHeaderComponent={() => <View style={{ height: 20 }} />}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            />
                        }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        marginTop: 60,
        color: Colors.subtitle,
        fontSize: 16,
        textAlign:'center'
    }
});