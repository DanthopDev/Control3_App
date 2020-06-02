import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity ,Alert, StyleSheet, Platform, ActivityIndicator, KeyboardAvoidingView, ScrollView} from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import URLBase from '../../constants/URLBase';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import { Dropdown } from 'react-native-material-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayMenuAddUser } from '../../components/Headers';
var currencyFormatter = require('currency-formatter');
import { Checkbox } from 'react-native-paper';
import { Icon } from 'react-native-elements'

export default class CrearProyectoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:true,
            showAlert: false,
            title: '',
            checked: false,
            checked2: false,
            message: '',
            presupuesto: '',
            nombreProyecto: '',
            errorNombre: false,
            montoProyecto: '',
            errorMonto: false,
            residente: '',
            idResidente: '',
            residenteError: false,
            almacenista: '',
            loading: false,
            idAlmacenista: '',
            almacenistaError: false,
            created: false,
            respuesta:[]
        };
        this.getResAlm();
    }
    getResAlm = async () => {
        const { accessInfo } = this.props.screenProps;
        fetch(URLBase + '/dir/getResAlm', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('GET Alamcenistas');
                console.log(responseJson);
                if (responseJson.message) {
                    Alert.alert('Error de acceso', responseJson.message);
                } else {
                   this.setState({
                       isLoading: false,
                       almacenistas: responseJson.almacenistas,
                       residentes: responseJson.residentes

                   })
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }
    createProyect = async () => {
        const { nombreProyecto, montoProyecto, idResidente, idAlmacenista, presupuesto, checked, checked2} = this.state;
        const { accessInfo }= this.props.screenProps;
        let foto=0;
        if(checked==true){
            foto=1;
        }
        let filtradoAdmin = 0;
        if (checked2 == true) {
            filtradoAdmin= 1;
        }
        let montoProyectoFormat=parseFloat(montoProyecto).toFixed(2)
        var formData = new FormData();
        formData.append('name', nombreProyecto);
        formData.append('residente',idResidente);
        formData.append('foto',foto);
        formData.append('filtradoAdmin', filtradoAdmin);
        if(idAlmacenista==''){
            formData.append('almacenista', idResidente);
        } else {
            formData.append('almacenista', idAlmacenista);
        }
        formData.append('costo', montoProyectoFormat);
        formData.append('presupuesto', presupuesto);

        fetch(URLBase + '/dir/createProyect', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('******************** Respuesta Nuevo Proyecto **************************');
                console.log(responseJson);
                if(responseJson.success){
                    if(responseJson.success=='200'){
                        this.setState({
                            showAlert: true,
                            title: 'Registro Exitoso',
                            message: 'Se ha creado su proyecto de manera correcta',
                            created: true,
                            loading: false,
                            respuesta: responseJson.proyecto
                        });
                    }
                }else {
                    this.setState({
                        showAlert: true,
                        loading: false,
                        title: 'Lo sentimos',
                        message: 'No ha sido posible crear un nuevo proyecto'
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    validaCampos() {
        const { nombreProyecto } =this.state;
        this.setState({
            loading: true
        });
        if(nombreProyecto==''){
            this.setState({
                showAlert: true,
                created: false,
                title: 'Campos incompletos',
                message: 'Ingrese el Nombre del proyecto es obligatorio',
                loading: false
            });
        }else{
            this.createProyect();
        }
    }
    render() {
        const { checked, checked2 } = this.state;
        const offset = (Platform.OS === 'android') ? -500 : 0;
        return (
            <KeyboardAvoidingView  
                style={SharedStyles.container} 
                behavior={Platform.OS === "ios" ? "padding" : null} enabled
            >
            <View style={SharedStyles.container}>
                <HeaderGrayMenuAddUser
                    title='Nuevo Proyecto'
                    action={() => this.props.navigation.openDrawer()}
                    onAddUser={() => this.props.navigation.navigate('AddUser', { getResAlm: this.getResAlm.bind(this) })}
                />
                {
                    this.state.isLoading == true ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View> : <ScrollView style={styles.container}>
                            <View style={{marginHorizontal: 20, marginTop: 20}}>
                                <CustomInput
                                    error={this.state.errorNombre}
                                    label='Nombre del proyecto'
                                    value={this.state.nombreProyecto}
                                    returnKeyType={'done'}
                                    onChangeText={nombreProyecto => this.setState({ nombreProyecto })}
                                    underlineColor='transparent'
                                />
                            </View>
                            <View style={{ height: 20 }} />
                            <View style={{marginHorizontal: 20}}>
                                <CustomInput
                                    error={this.state.errorMonto}
                                    label='Monto del contrato'
                                    value={this.state.montoProyecto}
                                    keyboardType={'numeric'}
                                    returnKeyType={'done'}
                                    onChangeText={montoProyecto => {
                                        this.setState({ montoProyecto });

                                    }}
                                    underlineColor='transparent'
                                />
                                <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.montoProyecto), { code: 'USD' })}</AvenirBook>
                            </View>
                            <View style={{ height: 20 }} />
                            <Dropdown
                                overlayStyle={{ margin: 0, padding: 0 }}
                                containerStyle={styles.dropdownContainer}
                                fontSize={14}
                                value={this.state.idResidente}
                                itemTextStyle={{ fontFamily: 'avenir-medium' }}
                                label='Residente'
                                baseColor={Colors.title}
                                textColor={Colors.title}
                                data={this.state.residentes}
                                onChangeText={(value, index ) => {
                                    console.log('Value: ',value);
                                    console.log('index: ', index);
                                    console.log('id Residente: ', this.state.residentes[index].id);
                                    this.setState({
                                        idResidente: this.state.residentes[index].id
                                    });
                                }}

                            />
                            <View style={{ height: 20 }} />
                            <Dropdown
                                overlayStyle={{ margin: 0, padding: 0 }}
                                containerStyle={styles.dropdownContainer}
                                fontSize={14}
                                itemTextStyle={{ fontFamily: 'avenir-medium' }}
                                label='Almacenista'
                                value={this.state.idAlmacenista}
                                baseColor={Colors.title}
                                textColor={Colors.title}
                                data={this.state.almacenistas}
                                onChangeText={(value, index) => {
                                    console.log('Value: ', value);
                                    console.log('index: ', index);
                                    console.log('id Almacenista: ', this.state.almacenistas[index].id);
                                    this.setState({
                                        idAlmacenista: this.state.almacenistas[index].id
                                    });
                                }}
                            />
                            <View style={[SharedStyles.categoriaContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 20}]}>
                                <View style={{width: '80%'}}>
                                    <AvenirMedium>
                                            Obligatorio tomar fotografía en asistencia
                                    </AvenirMedium>
                                </View>
                                {
                                        Platform.OS == 'ios' ? <TouchableOpacity onPress={() => { this.setState({ checked: !checked }); }}>
                                            {checked ? <Icon
                                                name='check-square'
                                                type='feather'
                                                color={Colors.primary}
                                            /> : <Icon
                                                    name='square'
                                                    type='feather'
                                                    color={Colors.subtitle}
                                                />
                                            }
                                        </TouchableOpacity> : <Checkbox
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ checked: !checked }); }}
                                                color={Colors.primary}
                                            />
                                }
                            </View>
                                <View style={[SharedStyles.categoriaContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginHorizontal: 20 }]}>
                                    <View style={{ width: '80%' }}>
                                        <AvenirMedium>
                                            El administratar recibirá las notificaciones solo cuando el director las autorice
                                    </AvenirMedium>
                                    </View>
                                    {
                                        Platform.OS == 'ios' ? <TouchableOpacity onPress={() => { this.setState({ checked2: !checked2 }); }}>
                                            {checked ? <Icon
                                                name='check-square'
                                                type='feather'
                                                color={Colors.primary}
                                            /> : <Icon
                                                    name='square'
                                                    type='feather'
                                                    color={Colors.subtitle}
                                                />
                                            }
                                        </TouchableOpacity> : <Checkbox
                                                status={checked2 ? 'checked' : 'unchecked'}
                                                onPress={() => { this.setState({ checked2: !checked2 }); }}
                                                color={Colors.primary}
                                            />
                                    }
                                </View>
                            <CustomButton
                                style={{ marginTop: 20, marginHorizontal: 20 }}
                                loading={this.state.loading}
                                title='Crear Proyecto'
                                fontSize={14}
                                onPress={() => {
                                    if (this.state.loading == false) {
                                        this.validaCampos();
                                    }
                                    }} />
                            <View style={{ height: 40 }} />
                        </ScrollView>
                }
            </View>
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
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onDismiss={() => {
                        console.log('created: ', this.state.created);
                        if(this.state.created==true){
                            this.props.screenProps.getInfoDirector();
                            this.props.navigation.navigate('DetalleProyecto', {
                              title: this.state.respuesta.name,
                              id: this.state.respuesta.id,
                              avance: 0,
                              accessInfo: this.props.screenProps.accessInfo});
                        }
                        if(this.state.title=='Lo sentimos'){

                        }else {
                            this.setState({
                            presupuesto: '',
                            nombreProyecto: '',
                            errorNombre: false,
                            montoProyecto: '',
                            errorMonto: false,
                            residente: '',
                            idResidente: '',
                            checked: false,
                            cheked2: false,
                            residenteError: false,
                            almacenista: '',
                            idAlmacenista: '',
                            });
                        }
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    },
    dropdownContainer: {
        paddingTop: 0,
        marginTop: 0,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        backgroundColor: '#ffff',
        borderRadius: 6,
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
    }
});
/* <HeaderGrayMenuAddUser
                    title='Nuevo Proyecto'
                    action={() => this.props.navigation.openDrawer()}
                    onAddUser={() => this.props.navigation.navigate('AddUser')}
                /> */