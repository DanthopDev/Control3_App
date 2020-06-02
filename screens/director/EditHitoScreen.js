import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TextInput, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import { AvenirBook, AvenirHeavy } from '../../components/StyledText';
import DatePicker from 'react-native-datepicker'
import AwesomeAlert from 'react-native-awesome-alerts';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBackDelete } from '../../components/Headers';
import moment from "moment";

const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export default class HitosScreen extends Component {
    constructor(props) {
        super(props);
        const { hito } = props.navigation.state.params;
        console.log('Hito: ', hito);
        let nuevaFechaInicio = this.formatDate(hito.fecha_inicio);
        let nuevaFechaFin = this.formatDate(hito.fecha_fin);
        this.state = {
            complete:false,
            loading: false,
            nombre: hito.name,
            showAlert: false,
            showAlertConfirm: false,
            descripcion: hito.descripcion,
            fecha_inicio: nuevaFechaInicio,
            fecha_fin: nuevaFechaFin,
            errorFechaFin: false,
            placeholder: ' ',
        };
    }
    formatDate(fecha) {
        let arrayFecha = fecha.split('-');
        indexMes = parseInt(arrayFecha[1]) - 1;
        let newDate = arrayFecha[2] + '-' + meses[indexMes] + '-' + arrayFecha[0];
        return newDate;

    }
    updateHito = async () => {
        const { accessInfo } = this.props.screenProps;
        const { nombre, descripcion, fecha_inicio, fecha_fin } = this.state;
        var formData = new FormData();
        const { hito } = this.props.navigation.state.params;
        let arrayFechaFin = fecha_fin.split('-');
        let arrayFechaInico = fecha_inicio.split('-');
        let formatFechaFin = moment(new Date(arrayFechaFin[2], meses.indexOf(arrayFechaFin[1]), arrayFechaFin[0])).format("YYYY-MM-DD");
        let formatFechaInicio = moment(new Date(arrayFechaInico[2], meses.indexOf(arrayFechaInico[1]), arrayFechaInico[0])).format("YYYY-MM-DD");
        formData.append('id', hito.id);
        formData.append('name', nombre);
        formData.append('descripcion', descripcion);
        formData.append('fecha_inicio', formatFechaInicio);
        formData.append('fecha_fin', formatFechaFin);
        fetch(URLBase + '/dir/updateHito', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Modificar Hito************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.props.navigation.state.params.updateHitos(hito.id, nombre, descripcion, formatFechaInicio, formatFechaFin);
                    this.setState({
                        showAlert: true,
                        complete: true,
                        title: 'Hito Actualizado',
                        message: 'Se ha actualizado el hito de manera exitosa.',
                        loading: false
                    });
                } else {
                    this.setState({
                        showAlert: true,
                        loading: false,
                        title: 'Error',
                        message: 'No ha sido posible modificar el Hito',
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error', JSON.stringify(error));
                console.error(error);
            });
    }
    validaForm() {
        this.setState({
            loading:true
        });
        const { nombre, fecha_inicio, fecha_fin } = this.state;
        if (nombre == '' || fecha_inicio == '' || fecha_fin == '') {
            this.setState({
                showAlert: true,
                title: 'Campos vacíos',
                message: 'Ingrese los campos Nombre, Fecha Inicio, Fecha Fin.',
                loading: false
            })
        } else {
            this.updateHito();
        }
    }
    onDelete= () => {
        const { accessInfo } = this.props.screenProps;
        var formData = new FormData();
        const { hito } = this.props.navigation.state.params;
        formData.append('id', hito.id);
        fetch(URLBase + '/dir/deleteHito', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Eliminar Hito************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.props.navigation.state.params.deleteHito(hito.id);
                    this.props.navigation.goBack();
                } else {
                    Alert.alert('Error', 'No ha sido posible eliminar el Hito');
                }
            })
            .catch((error) => {
                Alert.alert('Error', JSON.stringify(error));
                console.error(error);
            });
    }
    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBackDelete
                    title='Editar Hito'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                    onDelete={() => this.setState({showAlertConfirm: true})}
                />
                <KeyboardAvoidingView 
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : null} enabled
                >
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.container}>
                            <View style={styles.hitoDescriptionContainer} >
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Nombre
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder, fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
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
                                        date={this.state.fecha_inicio}
                                        mode="date"
                                        placeholder=" "
                                        format="DD-MMM-YYYY"
                                        minDate={'01-ene-1930'}
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
                                            let arrayFechaFin = this.state.fecha_fin.split('-');
                                            let arrayFechaInico = fecha_inicio.split('-');
                                            let formatFechaFin = moment(new Date(arrayFechaFin[2], meses.indexOf(arrayFechaFin[1]), arrayFechaFin[0])).format("YYYY-MM-DD");
                                            let formatFechaInicio = moment(new Date(arrayFechaInico[2], meses.indexOf(arrayFechaInico[1]), arrayFechaInico[0])).format("YYYY-MM-DD");
                                            if (formatFechaFin >= formatFechaInicio) {
                                                this.setState({
                                                    fecha_inicio,
                                                    formatFechaInicio,
                                                    formatFechaFin,
                                                    errorFechaFin: '',
                                                    errorGastoSemanal: false
                                                })
                                            } else {
                                                this.setState({ errorFechaFin: 'menor' })
                                            }
                                        }}
                                    />
                                    { this.state.errorFechaFin == 'menor' ? <AvenirBook style={{ color: 'red', fontSize: 12 }}>Seleccione una fecha menor o igual a la Fecha de Fin</AvenirBook> : null}
                                </View>
                                <View>
                                    <AvenirHeavy>
                                        Fecha Fin
                                    </AvenirHeavy>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        date={this.state.fecha_fin}
                                        mode="date"
                                        placeholder={this.state.placeholder}
                                        format="DD-MMM-YYYY"
                                        minDate={'01-ene-1930'}
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
                                                    this.setState({ errorFechaFin: 'menorFin', fecha_fin: '' })
                                                }
                                            }
                                        }}
                                    />
                                    {this.state.errorFechaFin == 'menorFin' ? <AvenirBook style={{ color: 'red', fontSize: 12 }}>La Fecha de Fin debe ser mayor a la Fecha de Inicio</AvenirBook> : null}
                                </View>
                            </View>
                            <CustomButton
                                style={{ marginTop: 30 }}
                                title='Modificar'
                                loading={this.state.loading}
                                fontSize={14}
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
                    onDismiss={() => {
                        if(this.state.complete==true){
                            this.props.navigation.goBack();
                        }
                    }}
                />
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertConfirm}
                    title={'Eliminar Hito'}
                    message={'¿Está seguro de eliminar el hito de la planeación?'}
                    closeOnTouchOutside={true}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Confirmar'
                    cancelText='Cancelar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlertConfirm: false
                        });
                    }}
                    onConfirmPressed={() => {
                        this.onDelete();
                        this.setState({
                            showAlertConfirm: false
                        });
                    }}
                    onDismiss={() => {
                       
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