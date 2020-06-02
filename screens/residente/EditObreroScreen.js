import React, { Component } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import SearchableDropdown from 'react-native-searchable-dropdown';
var currencyFormatter = require('currency-formatter');

export default class EditObreroScreen extends Component {
    constructor(props) {
        super(props);

        const { item, cuadrillas, idProyecto, categoria } = props.navigation.state.params;
        let nombre_cuadrilla = '';
        let cuadrilla_index = cuadrillas.findIndex(element => element.id == item.grupo_id);

        cuadrillas.findIndex(element => {
            if(element.id == item.grupo_id)
                nombre_cuadrilla = element.name
        });

        if(cuadrilla_index == -1)
            cuadrilla_index = null;

        this.state = {
            loading: false,
            errorNombre: false,
            errorPuesto: false,
            error_cuadrilla: false,
            errorPrecioUnidad: false,
            nombre: item.nombre,
            precioUnidad: item.pu,
            puesto: item.puesto,
            cuadrilla: nombre_cuadrilla,
            cuadrilla_id: item.grupo_id,
            cuadrilla_index,
            idProyecto,
            cuadrillas,
            categoria
        };
    }

    editObrero = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { nombre, precioUnidad, puesto, cuadrilla_id, idProyecto } = this.state;
        const { item } = this.props.navigation.state.params;

        formData.append('idProyecto', idProyecto);
        formData.append('costo_id', item.id);
        formData.append('nombre', nombre);
        formData.append('puesto', puesto);
        formData.append('cuadrilla_id', cuadrilla_id);
        formData.append('pu', parseFloat(precioUnidad).toFixed(2));

        fetch(URLBase + '/res/updateObrero', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Editar Asistensia *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        title: 'Obrero actualizado',
                        message: 'La información del obrero ha sido actualizada correctamente',
                        loading: false
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                    Alert.alert('Error', 'No se han actualizar la información del Obrero');
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    validaForm() {
        const { nombre, precioUnidad, cuadrilla } = this.state;

        this.setState({
            loading: true
        });
        if (nombre == '') {
            this.setState({
                errorNombre: true,
                loading: false
            });
        } else if(cuadrilla == ''){
            this.setState({
                errorGrupo: true,
                loading: false
            });
        } else if (precioUnidad == '') {
            this.setState({
                errorPrecioUnidad: true,
                loading: false
            });
        } else
            this.editObrero();
    }

    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        return (
            <KeyboardAvoidingView 
                style={styles.fatherContainer}
                behavior={Platform.OS === "ios" ? "padding" : null} enabled
            >
                <View style={SharedStyles.container}>
                    <HeaderGrayBack
                        title='Editar Personal'
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.container}>
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.errorNombre}
                                label='Nombre'
                                selectionColor={Colors.primary}
                                value={this.state.nombre}
                                returnKeyType={'done'}
                                onChangeText={nombre => this.setState({ nombre, errorNombre: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorNombre == true ? <AvenirBook style={styles.error}>Ingrese un Nombre</AvenirBook> : null}
                        </View>
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.errorPuesto}
                                label='Puesto'
                                selectionColor={Colors.primary}
                                value={this.state.puesto}
                                returnKeyType={'done'}
                                onChangeText={puesto => this.setState({ puesto, errorPuesto: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorPuesto == true ? <AvenirBook style={styles.error}>Ingrese un Puesto</AvenirBook> : null}
                        </View>
                        <View style={styles.inputContent}>
                            {console.log("====Cuadrillas=====")}
                            {console.log(this.state.cuadrillas)}
                            <AvenirMedium style={styles.label}>
                                Cuadrilla
                            </AvenirMedium>
                            <SearchableDropdown
                                placeholder="Escriba aquí..."
                                underlineColorAndroid="transparent"
                                containerStyle={{ width: '100%' }}
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 120 }}
                                items={this.state.cuadrillas}
                                defaultIndex={this.state.cuadrilla_index.toString()}
                                onTextChange={text => this.setState({ cuadrilla: text, error_cuadrilla: false})}
                                onItemSelect={item => {
                                    this.setState({
                                        cuadrilla: item.name, 
                                        cuadrilla_id: item.id,
                                        error_cuadrilla: false,
                                    })
                                }}
                            />
                        </View>
                        {this.state.error_cuadrilla == true ? <AvenirBook style={[styles.error, {marginHorizontal: 20}]}>Ingrese una cuartilla</AvenirBook> : null}
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.errorPrecioUnidad}
                                label='Salario Diario'
                                keyboardType={'numeric'}
                                selectionColor={Colors.primary}
                                value={this.state.precioUnidad}
                                returnKeyType={'done'}
                                onChangeText={(precioUnidad) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(precioUnidad)) {
                                        this.setState({
                                            precioUnidad,
                                            errorPrecioUnidad: false
                                        })
                                    }
                                }}
                                underlineColor='transparent'
                            />
                            <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.precioUnidad), { code: 'USD' })}</AvenirBook>
                            {this.state.errorPrecioUnidad == true ? <AvenirBook style={styles.error}>Ingrese el Salario Diario</AvenirBook> : null}
                        </View>
                        <View style={{ height: 20 }} />
                        <CustomButton
                            style={{ marginVertical: 20, marginHorizontal: 20 }}
                            title='Actualizar'
                            loading={this.state.loading}
                            fontSize={14}
                            onPress={() => {
                                if(this.state.loading==false){
                                    this.validaForm();
                                }
                            }} />

                    </ScrollView>
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
                    closeOnHardwareBackPress={true}
                    confirmButtonColor={Colors.primary}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onDismiss={() => {
                        this.setState({
                            nombre: '',
                            precioUnidad: '',
                            puesto: ''
                        });

                        if(this.state.categoria != "Mano de obra")
                            this.props.navigation.state.params.getListaAsistencia();
                        else
                            this.props.navigation.state.params.getGastos();
                        this.props.navigation.goBack();
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        color: Colors.title,
        fontSize: 12,
        marginTop: 10,
        marginLeft: 10
    },
    inputContent: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: Colors.white,
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
    },
    marginContent: {
        marginHorizontal: 20,
        marginTop: 20
    },
    fatherContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 10
    },
});