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
var currencyFormatter = require('currency-formatter');

const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export default class AgregarCobroScreen extends Component {
    constructor(props) {
        super(props);
        const { editable } = this.props.navigation.state.params;
        if(editable){
            this.state = {
                loading: false,
                showAlert: false,
                fecha: this.formatDate(editable.fechaCobro),
                formatFecha: editable.fechaCobro,
                monto: editable.cobro,
                recibe: editable.recibe,
                metodoPago: editable.tipoPago,
                placeholder: ' ',
                notas: editable.notas
            };
        }else {
            this.state = {
                loading: false,
                showAlert: false,
                fecha: '',
                monto: '',
                recibe: '',
                metodoPago: '',
                placeholder: ' ',
                notas: ''
            };
        }
    }
    formatDate(fecha) {
        let arrayFecha = fecha.split('-');
        indexMes = parseInt(arrayFecha[1]) - 1;
        let newDate = arrayFecha[2] + '-' + meses[indexMes] + '-' + arrayFecha[0];
        return newDate;

    }
    createCobro = async () => {
        const { accessInfo } = this.props.screenProps;
        const { monto, recibe, metodoPago, formatFecha, notas } = this.state;
        var formData = new FormData();
        const { idProyecto } = this.props.navigation.state.params;
        console.log('ID DE PROYECTO: ', idProyecto);
        formData.append('id', idProyecto);
        formData.append('fecha', formatFecha);
        formData.append('monto', monto);
        formData.append('recibe', recibe);
        formData.append('metodoPago', metodoPago);
        formData.append('notas', notas);

        fetch(URLBase + '/dir/createCobro', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Crear costo****************************************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        loading: false,
                        title: 'Cobro Registrado',
                        message: 'El nuevo cobro ha sido registrado de manera exitosa',
                        fecha: '',
                        monto: '',
                        recibe: '',
                        metodoPago: '',
                        notas: '',
                    });
                    this.props.navigation.state.params.pushCobro(responseJson.cobro);
                } else {
                   Alert.alert('No ha sido posible registrar el nuevo cobro', responseJson.message);
                   this.setState({
                       loading: false
                   })
                }
            })
            .catch((error) => {
                // Alert.alert('Error', JSON.parse(error));
                console.error(error);
            });
    }
    updateCobro = async () => {
        const { accessInfo } = this.props.screenProps;
        const { monto, recibe, metodoPago, formatFecha, notas } = this.state;
        const { editable }=this.props.navigation.state.params;
        var formData = new FormData();
        console.log('Editable: ', editable);
        formData.append('id', editable.id);
        formData.append('fecha', formatFecha);
        formData.append('monto', monto);
        formData.append('recibe', recibe);
        formData.append('metodoPago', metodoPago);
        formData.append('notas', notas);

        fetch(URLBase + '/dir/updateCobro', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('UPDATE Cobro****************************************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        loading: false,
                        title: 'Cobro Actualizado',
                        message: 'El cobro ha sido actualizado de manera exitosa',
                    });
                    this.props.navigation.state.params.updateCobro(responseJson.cobro);
                } else {
                    Alert.alert('No ha sido posible actualizar el cobro', responseJson.message);
                    this.setState({
                        loading: false
                    })
                }
            })
            .catch((error) => {
                // Alert.alert('Error', JSON.parse(error));
                console.error(error);
            });
    }
    validaForm() {
        this.setState({
            loading: true
        });
        const { fecha, monto } = this.state;
        if (fecha=='') {
            this.setState({
                showAlert: true,
                loading: false,
                title: 'Campos vacíos',
                message: 'Ingrese los campos Fecha y Monto',
            });
        } else if(monto=='') {
            this.setState({
                showAlert: true,
                loading: false,
                title: 'Campos vacíos',
                message: 'Ingrese los campos Fecha y Monto',
            });
        }else {
            if(this.props.navigation.state.params.editable){
                this.updateCobro();
            }else {
                this.createCobro();
            }
        }
    }
    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        const { editable }=this.props.navigation.state.params;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title={ editable ? 'Editar Cobro' : 'Registrar Nuevo Cobro'}
                    action={() => {
                        this.props.navigation.goBack();
                    }}
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
                                        Fecha
                                    </AvenirHeavy>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        locale={'es'}
                                        date={this.state.fecha}
                                        mode="date"
                                        placeholder=" "
                                        format="DD-MMM-YYYY"
                                        minDate="01-ene-1930"
                                        maxDate={new Date()}
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
                                        onDateChange={(fecha) => {
                                            let arrayFechaFin = fecha.split('-');
                                            let formatFecha = moment(new Date(arrayFechaFin[2], meses.indexOf(arrayFechaFin[1]), arrayFechaFin[0])).format("YYYY-MM-DD");
                                            this.setState({ fecha, formatFecha })
                                        }}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Monto
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder, fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
                                        onChangeText={(monto) => {
                                            let expresion = /^\d*\.?\d*$/;
                                            if (expresion.test(monto)) {
                                                    this.setState({
                                                        monto,
                                                        errorMonto: false
                                                    });
                                                }
                                        }}
                                        value={this.state.monto}
                                        keyboardType={'numeric'}
                                        returnKeyType={'done'}
                                    />
                                    <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.monto), { code: 'USD' })}</AvenirBook>
                                </View>
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Recibe
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder, fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
                                        onChangeText={(recibe) => this.setState({ recibe })}
                                        value={this.state.recibe}
                                        returnKeyType={'done'}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Método de Pago
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder, fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
                                        onChangeText={(metodoPago) => this.setState({ metodoPago })}
                                        value={this.state.metodoPago}
                                        returnKeyType={'done'}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <AvenirHeavy>
                                        Notas
                                    </AvenirHeavy>
                                    <TextInput
                                        style={{ color: Colors.placeholder, fontFamily: 'avenir-book', borderColor: Colors.divisor, borderBottomWidth: 1 }}
                                        onChangeText={(notas) => this.setState({ notas })}
                                        value={this.state.notas}
                                        multiline={true}
                                        returnKeyType={'done'}
                                    />
                                </View>
                            </View>
                            {editable ? <CustomButton
                                style={{ marginTop: 30 }}
                                title='Actualizar'
                                fontSize={14}
                                loading={this.state.loading}
                                onPress={() => {
                                    if (this.state.loading == false) {
                                        this.validaForm();
                                    }
                                }} /> : <CustomButton
                                    style={{ marginTop: 30 }}
                                    title='Registrar'
                                    fontSize={14}
                                    loading={this.state.loading}
                                    onPress={() => {
                                        if (this.state.loading == false) {
                                            this.validaForm();
                                        }
                                    }} />}
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
                    onDismiss={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                        if(editable){
                            this.props.navigation.goBack();
                        }
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