import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TextInput, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import { AvenirBook, AvenirHeavy } from '../../components/StyledText';
import DatePicker from 'react-native-datepicker'
import AwesomeAlert from 'react-native-awesome-alerts';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
import moment from "moment";

const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export default class HitosScreen extends Component {
    constructor(props) {
        super(props);
        console.log('*********************** ID PROYECTO Agregar HITOS ******************');
        console.log(props.navigation.state.params.idProyecto);
        this.state = {
            nombre: '',
            loading: false,
            showAlert: false,
            descripcion: '',
            fecha_inicio: '',
            fecha_fin: '',
            errorFechaFin: false,
            placeholder: ' ',
        };
    }
    createHito = async () => {
        const { accessInfo } = this.props.screenProps;
        const { nombre, descripcion, formatFechaInicio, formatFechaFin } = this.state;
        var formData = new FormData();
        const { idProyecto } = this.props.navigation.state.params;
        console.log('Fecha inicio: ', formatFechaInicio);
        console.log('Fecha Fin: ', formatFechaFin);
        formData.append('id', idProyecto);
        formData.append('name', nombre );
        formData.append('descripcion', descripcion);
        formData.append('fecha_inicio', formatFechaInicio);
        formData.append('fecha_fin', formatFechaFin);
        fetch(URLBase + '/dir/createHito', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.success && responseJson.success=='200'){
                    let itemHito={
                        id: responseJson.hito, 
                        name: nombre, 
                        descripcion: descripcion, 
                        fecha_inicio: formatFechaInicio, 
                        fecha_fin: formatFechaFin,
                        fecha_terminada: null,
                        progreso: '0'
                    };
                    this.props.navigation.state.params.addHito(itemHito);
                    this.setState({
                        showAlert: true,
                        title: 'Hito Creado',
                        message: 'Se ha creado el hito de manera exitosa.',
                        nombre: '',
                        descripcion: '',
                        fecha_inicio: '',
                        fecha_fin: '',
                        loading: false
                    });
                }else {
                    this.setState({
                        showAlert: true,
                        title: 'Error',
                        message: 'No ha sido posible crear el Hito',
                        loading: false
                    });
                }
            })
            .catch((error) => {
               // Alert.alert('Error', JSON.parse(error));
                console.error(error);
            }); 
    }
    validaForm(){
        this.setState({
            loading: true
        });
        const { nombre, fecha_inicio, fecha_fin }=this.state;
        if(nombre=='' || fecha_inicio == '' || fecha_fin==''){
            this.setState({
                showAlert: true,
                loading: false,
                title: 'Campos vacíos',
                message: 'Ingrese los campos Nombre, Fecha Inicio, Fecha Fin.',
            });
        } else {
           this.createHito();
        }
    }
    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Agregar Hito'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <KeyboardAvoidingView 
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : null} enabled
                >
                        <ScrollView style={{flex: 1}}>
                        <View style={styles.container}>
                            <View style={styles.hitoDescriptionContainer} >
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Nombre
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder,  fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
                                        onChangeText={(nombre) => this.setState({ nombre })}
                                        value={this.state.nombre}
                                        returnKeyType={'done'}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Descripción
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder, fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
                                        onChangeText={(descripcion) => this.setState({ descripcion })}
                                        value={this.state.descripcion}
                                        returnKeyType={'done'}
                                        multiline={true}
                                        numberOfLines={3}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Fecha Inicio
                                    </AvenirHeavy>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        locale={'es'}
                                        date={this.state.fecha_inicio}
                                        mode="date"
                                        placeholder=" "
                                        format="DD-MMM-YYYY"
                                        minDate="01-ene-1930"
                                        confirmBtnText="Confirmar"
                                        cancelBtnText="Cancelar"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.divisor,
                                                margin: 0,
                                                padding: 0,
                                                alignItems: 'flex-start'
                                            },
                                            dateText: {
                                                fontFamily: 'avenir-book',
                                                color: Colors.subtitle,
                                            }
                                        }}
                                        onDateChange={(fecha_inicio) => { 
                                            this.setState({ fecha_inicio, fecha_fin: '', errorFechaFin: '' }) 
                                            }}
                                    />
                                </View>
                                <View>
                                    <AvenirHeavy>
                                        Fecha Fin
                                    </AvenirHeavy>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        date={this.state.fecha_fin}
                                        locale={'es'}
                                        mode="date"
                                        placeholder={this.state.placeholder}
                                        format="DD-MMM-YYYY"
                                        minDate="1930-01-01"
                                        confirmBtnText="Confirmar"
                                        cancelBtnText="Cancelar"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.divisor,
                                                margin: 0,
                                                padding: 0,
                                                alignItems: 'flex-start'
                                            },
                                            dateText: {
                                                fontFamily: 'avenir-book',
                                                color: Colors.subtitle,
                                            }
                                        }}
                                        onDateChange={(fecha_fin) => {
                                            if (this.state.fecha_inicio == '') {
                                                this.setState({ errorFechaFin: 'vacio' })
                                            } else {
                                                let arrayFechaFin = fecha_fin.split('-');
                                                let arrayFechaInico = this.state.fecha_inicio.split('-');
                                                let formatFechaFin = moment(new Date(arrayFechaFin[2], meses.indexOf(arrayFechaFin[1]), arrayFechaFin[0])).format("YYYY-MM-DD");
                                                let formatFechaInicio = moment(new Date(arrayFechaInico[2], meses.indexOf(arrayFechaInico[1]), arrayFechaInico[0])).format("YYYY-MM-DD");
                                                if (formatFechaFin >= formatFechaInicio) {
                                                    this.setState({
                                                        fecha_fin,
                                                        formatFechaInicio,
                                                        formatFechaFin,
                                                        errorFechaFin: '',
                                                        errorGastoSemanal: false
                                                    })
                                                } else {
                                                    this.setState({ errorFechaFin: 'menor', fecha_fin: '' })
                                                }
                                            }
                                        }}
                                    />
                                    {   this.state.errorFechaFin=='vacio' ? 
                                        <AvenirBook style={styles.error}>Seleccione primero la Fecha de Inicio</AvenirBook>
                                        : this.state.errorFechaFin == 'menor' ? <AvenirBook style={{ color: 'red', fontSize: 12 }}>Seleccione una fecha mayor o igual a la Fecha de Inicio</AvenirBook> : null }
                                </View>
                            </View>
                            <CustomButton
                                style={{ marginTop: 30 }}
                                title='Agregar'
                                fontSize={14}
                                loading={this.state.loading}
                                onPress={() => {
                                    if(this.state.loading==false){
                                        this.validaForm();
                                        }
                                        }} />
                        </View>
                        </ScrollView>
                </KeyboardAvoidingView>
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlert}
                    title={this.state.title}
                    message={this.state.message}
                    closeOnTouchOutside={false}
                    showConfirmButton={true}
                    confirmText='Aceptar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false,
                            loading: false
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
    inputContainer: {
        marginBottom: 20
    },
    error: { 
        color: 'red', 
        fontSize: 12,
        marginTop: 10 
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