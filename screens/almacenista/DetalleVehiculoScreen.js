import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Image, Alert, ScrollView} from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import { AvenirBook, AvenirHeavy } from '../../components/StyledText';
import DatePicker from 'react-native-datepicker'
import AwesomeAlert from 'react-native-awesome-alerts';
import URLBase from '../../constants/URLBase';
import URLImage from '../../constants/URLImage';
import { HeaderGrayBack } from '../../components/Headers';
import Layout from '../../constants/Layout';
import { Dropdown } from 'react-native-material-dropdown';

export default class DetalleVehiculoScreen extends Component {
    constructor(props) {
        super(props);
        console.log('*********************** ID PROYECTO Agregar HITOS ******************');
        console.log(props.navigation.state.params.idProyecto);
        let dataCantidades = [];
        const { cantidad } = props.navigation.state.params;
        let cantidadEntero = parseInt(cantidad);
        for (let i = 0; i < cantidadEntero; i++) {
            dataCantidades.push({ value: (i + 1).toString() });
        }
        this.state = {
            isLoading:true,
            vehiculo: [],
            cantidad: '1',
            showAlert: false,
            showAlertEntrega: false,
            dataCantidades,
            cantidadVe: cantidad
        };
    }
    static navigationOptions = {
        header: null
    };
    componentDidMount(){
        this.getInfoVehiculo();
    }
    componentWillUnmount() {
        this.props.navigation.state.params.getAlmacenes();
    }
    getInfoVehiculo = async () => {
        const { accessInfo } = this.props.screenProps;
        var formData = new FormData();
        const { idVehiculo } = this.props.navigation.state.params
        formData.append('id', idVehiculo);
        fetch(URLBase + '/alm/getInfoVehiculo', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        isLoading:false,
                        vehiculo: responseJson.vehiculo
                    })
                } else {
                    Alert.alert('Error al consultar la informacion')
                }
            })
            .catch((error) => {
                Alert.alert('Error', error);
                console.error(error);
            });
    }
    entregarVehiculo = async () => {
        const { accessInfo } = this.props.screenProps;
        var formData = new FormData();
        const { idVehiculo, idProyecto } = this.props.navigation.state.params
        formData.append('id', idVehiculo);
        formData.append('proyecto_id', idProyecto);
        formData.append('cantidad', this.state.cantidad);
        fetch(URLBase + '/alm/entregaVehiculo', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlertEntrega: false,
                        showAlert: true,
                        title: 'Entrega Exitosa',
                        message: 'La herramienta ha sido entregada de manera exitosa',
                        cantidadVe: parseInt(this.state.cantidadVe) - parseInt(this.state.cantidad)
                    });
                } else {
                    Alert.alert('Error al entregar el vehículo')
                }
            })
            .catch((error) => {
                Alert.alert('Error', error);
                console.error(error);
            });
    }
    validaForm() {
        const { nombre, fecha_inicio, fecha_fin } = this.state;
        if (nombre == '' || fecha_inicio == '' || fecha_fin == '') {
            this.setState({
                showAlert: true,
                title: 'Campos vacíos',
                message: 'Ingrese los campos Nombre, Fecha Inicio, Fecha Fin.',
            });
        } else {
            this.createHito();
        }
    }
    render() {
        const { vehiculo, cantidadVe }=this.state;
            return (
                <View style={SharedStyles.container}>
                    <HeaderGrayBack
                        title={this.props.navigation.state.params.title}
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    { this.state.isLoading == true ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View> : <ScrollView style={styles.container}>
                            {vehiculo.foto == '' || vehiculo.foto == null || vehiculo.foto == 'default.jpg' ? <Image
                                source={require('../../assets/images/defaultImage.png')}
                                style={styles.imageStyle} /> : <Image
                                    source={{
                                        uri: URLImage + vehiculo.foto,
                                    }}
                                    style={styles.imageStyle} />}
                            <View style={{ marginTop: 20 }}>
                                <View style={styles.descripcionContainer}>
                                    <AvenirHeavy style={styles.text}>
                                        Nombre
                                    </AvenirHeavy>
                                    <AvenirBook style={styles.text}>
                                        {vehiculo.name}
                                    </AvenirBook>
                                </View>
                                <View style={styles.filaStyle}>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Placas
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.placas}
                                        </AvenirBook>
                                    </View>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Serie
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.serie}
                                        </AvenirBook>
                                    </View>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Fecha de Compra
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.fecha}
                                        </AvenirBook>
                                    </View>
                                </View>
                                <View style={styles.filaStyle}>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Linea
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.linea}
                                        </AvenirBook>
                                    </View>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Marca
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.marca}
                                        </AvenirBook>
                                    </View>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Cantidad
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            { cantidadVe }
                                        </AvenirBook>
                                    </View>
                                </View>
                                <View style={styles.filaStyle}>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Último Servicio
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.ultimo_servicio==null ? '-------' : vehiculo.ultimo_servicio}
                                        </AvenirBook>
                                    </View>
                                    <View style={styles.descripcionContainer}>
                                        <AvenirHeavy style={styles.text}>
                                            Próximo Servicio
                                        </AvenirHeavy>
                                        <AvenirBook style={styles.text}>
                                            {vehiculo.proximo_servicio ==null ? '-------' : vehiculo.proximo_servicio}
                                        </AvenirBook>
                                    </View>
                                </View>
                                <AvenirHeavy style={styles.text}>
                                    Información de Garantía  >
                                </AvenirHeavy>
                            </View>
                            <CustomButton
                                style={{ marginVertical: 30 }}
                                title='Entregar Vehículo'
                                fontSize={14}
                                onPress={() => this.setState({ showAlertEntrega: true })} />
                        </ScrollView>
                    }
                    <AwesomeAlert
                        titleStyle={[SharedStyles.titleStyle, { textAlign: 'center' }]}
                        title={'Seleccione la cantidad de vehículos a devolver'}
                        confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                        show={this.state.showAlertEntrega}
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
                                showAlertEntrega: false
                            });
                        }}
                        onConfirmPressed={() => {
                            this.entregarVehiculo();
                        }}
                        onDismiss={() => {
                        }}
                        customView={<View style={{ width: 100 }}>
                            <Dropdown
                                overlayStyle={{ margin: 0, padding: 0 }}
                                fontSize={14}
                                value={this.state.cantidad}
                                itemTextStyle={{ fontFamily: 'avenir-medium' }}
                                label='Cantidad'
                                baseColor={Colors.title}
                                textColor={Colors.title}
                                data={this.state.dataCantidades}
                                onChangeText={(value, index) => {
                                    this.setState({
                                        cantidad: value,
                                    });
                                }}

                            />
                        </View>}
                    />
                    <AwesomeAlert
                        titleStyle={SharedStyles.titleStyle}
                        messageStyle={SharedStyles.messageStyle}
                        confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                        show={this.state.showAlert}
                        title={this.state.title}
                        message={this.state.message}
                        closeOnTouchOutside={true}
                        showConfirmButton={true}
                        confirmText='Aceptar'
                        closeOnHardwareBackPress={false}
                        confirmButtonColor={Colors.primary}
                        onConfirmPressed={() => {
                            this.setState({
                                showAlert: false
                            });
                        }}
                    />
                </View>
            );
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    imageStyle: {
        borderRadius: 10,
        width: Layout.window.width-40,
        height: 200,
    },
    filaStyle: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    descripcionContainer: {
        marginBottom: 20
    },
    text: {
        fontSize: 14
    },
    hitoDescriptionContainer: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        width: '100%',
        padding: 20,
        marginTop: 20,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    },
});