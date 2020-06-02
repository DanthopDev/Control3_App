import React, { Component } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import SearchableDropdown from 'react-native-searchable-dropdown';
var currencyFormatter = require('currency-formatter');

export default class AddAsistenciaScreen extends Component {
    constructor(props) {
        super(props);
        const { grupos } = this.props.navigation.state.params;

        this.state = {
            loading: false,
            errorNombre: false,
            errorGrupo: false,
            errorPrecioUnidad: false,
            errorPuesto: false,
            grupos
        };
    }

    addAsistencia = async () => {
        var formData = new FormData();
        const { idProyecto, accessInfo } = this.props.navigation.state.params;
        const { nombre, grupo, precioUnidad, puesto } = this.state;

        console.log('id', idProyecto);
        console.log('nombre', nombre);
        console.log('grupo', grupo);
        console.log('puesto', puesto);
        console.log('unidad', 'día');
        console.log('pu', parseFloat(precioUnidad).toFixed(2));

        formData.append('id', idProyecto);
        formData.append('nombre', nombre);
        formData.append('grupo', grupo);
        formData.append('puesto', puesto);
        formData.append('unidad', 'día');
        formData.append('pu', parseFloat(precioUnidad).toFixed(2));
        
        fetch(URLBase + '/res/crearObrero', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Agreagar Asistensia *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        title: 'Obrero agregado',
                        message: 'El nuevo obrero ha sido agregado correctamente',
                        loading:false
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                    Alert.alert('Error', 'No se han podido crear el nuevo Obrero');
                } 
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    validaForm() {
        const { nombre, puesto, grupo, precioUnidad } = this.state;

        this.setState({
            loading: true
        });
        if (nombre == undefined) {
            this.setState({
                errorNombre: true,
                loading: false
            });
        } else if(puesto == undefined){
            this.setState({
                errorPuesto: true,
                loading: false
            });
        } else if(grupo == undefined){
            this.setState({
                errorGrupo: true,
                loading: false
            });
        } else if (precioUnidad == undefined) {
            this.setState({
                errorPrecioUnidad: true,
                loading: false
            });
        } else 
            this.addAsistencia();
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
                    title='Agregar Personal'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <ScrollView 
                keyboardShouldPersistTaps="always"
                style={styles.container}>
                    <AvenirHeavy style={styles.title}>
                        Asistencia de Obreros{"\n"}en Tareas Activas
                    </AvenirHeavy>
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
                        {this.state.errorNombre == true ? <AvenirBook style={styles.error}>Ingrese un nombre</AvenirBook> : null}
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
                        <AvenirMedium style={styles.label}>
                            Cuadrilla
                        </AvenirMedium>
                        <SearchableDropdown
                            onTextChange={text => this.setState({ grupo: text})}
                            onItemSelect={item => { this.setState({ grupo: item.name }) }}
                            containerStyle={{ width: '100%' }}
                            textInputStyle={SharedStyles.autoInputStyle}
                            itemStyle={SharedStyles.autoItemStyle}
                            itemTextStyle={SharedStyles.autoItemTextStyle}
                            itemsContainerStyle={{ maxHeight: 120 }}
                            items={this.state.grupos}
                            placeholder="Escriba aquí..."
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    {this.state.errorGrupo == true ? <AvenirBook style={[styles.error, {marginHorizontal: 20}]}>Ingrese una cuartilla</AvenirBook> : null}
                    <View style={styles.marginContent}>
                        <CustomInput
                            error={this.state.errorPrecioUnidad}
                            label='Salario diario'
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
                        {this.state.errorPrecioUnidad == true ? <AvenirBook style={styles.error}>Ingrese el salario diario</AvenirBook> : null}
                    </View>
                    <View style={{ height: 20 }} />
                    <CustomButton
                        style={{ marginVertical: 20, marginHorizontal: 20 }}
                        title='Agregar'
                        loading={this.state.loading}
                        fontSize={14}
                        onPress={() => {
                            if(this.state.loading == false)
                                this.validaForm();       
                            }
                        } 
                    />

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
                        unidad: '',
                        precioUnidad: '',
                        puesto: ''
                    });
                    this.props.navigation.state.params.getListaAsistencia();
                }}
            />
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    label: {
        color: Colors.title,
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