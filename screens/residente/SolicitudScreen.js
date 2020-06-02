import React, { Component } from 'react';
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
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
import NumberFormat from 'react-number-format';

export default class SolicitudScreen extends Component {
    constructor(props) {
        super(props);
        let newCategorias=[];
        const { categorias } = props.navigation.state.params;
        categorias.forEach(element => {
            newCategorias.push({ id: element.id, name: element.nombre, costos: element.costos });
        });
        let dataUnidadades = [];
        let i = 1;
        const { unidades } = this.props.screenProps;
        unidades.forEach(element => {
            dataUnidadades.push({
                id: i,
                name: element
            });
            i++;
        }); 
        this.state = {
            cantidad: '',
            loading: false,
            clear: false,
            isSelectedUnidad: false,
            errorCantidad: false,
            nombreCategoria: '',
            errorCategoria: false,
            unidad: '',
            defaultIndex: null,
            categoria: '',
            dataCostos: [],
            concepto: '',
            errorConcepto: false,
            errorUnidad: false,
            precioUnidad: '',
            errorPrecioUnidad: false,
            categorias: newCategorias,
            importe: '',
            dataUnidadades,
            dataCostos: []
        };
       // console.log('Categorias: ******************');
        //console.log(this.props.navigation.state.params.categorias)
    }
    componentWillUnmount() {
        this.props.navigation.state.params.getProyectoInfo();
    }
    createSolicitud = async () => {
        var formData = new FormData();
        const { params } = this.props.navigation.state;
        const { accessInfo } = this.props.screenProps;
        const { nombreCategoria, concepto, unidad, precioUnidad, cantidad, importe} = this.state;
        
        formData.append('proyecto_id', params.idProyecto);
        formData.append('categorias', nombreCategoria);
        formData.append('concepto', concepto);
        formData.append('unidad', unidad);
        formData.append('pu', parseFloat(precioUnidad).toFixed(2));
        formData.append('cantidad', parseFloat(cantidad).toFixed(2));
        formData.append('importe', parseFloat(importe).toFixed(2));
        fetch(URLBase + '/res/createSolicitud', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
               /* console.log('************************* VALOR DEL JSON Crear Solicitud *********************');
                console.log(responseJson); */
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        title: 'Solicitud enviada',
                        message: 'La nueva solicitud ha sido enviada exitosamente',
                        loading: false,
                        clear: true
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                    Alert.alert('Error', 'No se han podido enviar la solicitud');
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }
    validaForm() {
        const { concepto, cantidad, categoria, nombreCategoria, precioUnidad, unidad } = this.state;
        this.setState({
            loading: true
        });
       // Alert.alert('Nombre Categoria', nombreCategoria);
        if(nombreCategoria=='') {
            this.setState({
                errorCategoria: true,
                loading: false
            });
        } else if (concepto == '') {
            this.setState({
                errorConcepto: true,
                loading: false
            });
        } else if (unidad == '') {
            this.setState({
                errorUnidad: true,
                loading: false
            });
        } else if (cantidad == '') {
            this.setState({
                errorCantidad: true,
                loading: false
            });
        } else {
            this.createSolicitud();
        } 
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
                        title='Solicitud'
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView
                    keyboardShouldPersistTaps="always" 
                    style={styles.container}>
                        <View style={styles.inputContent}>
                            <AvenirMedium style={styles.label}>
                                Categoría
                            </AvenirMedium>
                            {this.state.clear == true ? null : <SearchableDropdown
                                onTextChange={text => this.setState({
                                    nombreCategoria: text,
                                    errorCategoria: false,
                                    precioUnidad: ''
                                })}
                                onItemSelect={item => {
                                    let costos = this.state.categorias.filter(element => element.id == item.id)[0].costos;
                                    let newCostos = [];
                                    let indexRep = -1;
                                    let i = 0;
                                    costos.forEach(element => {
                                        indexRep = newCostos.findIndex(item => item.name == element.nombre);
                                        if (indexRep == -1 ) {
                                            newCostos.push({ id: element.id, name: element.nombre, value: element.nombre, pu: element.pu, unidad: element.unidad })
                                        }else if(i==0){
                                            newCostos.push({ id: element.id, name: element.nombre, value: element.nombre, pu: element.pu, unidad: element.unidad })
                                        }
                                        i++;
                                    })
                                    this.setState({
                                        nombreCategoria: item.name,
                                        categoria: item.id,
                                        errorCategoria: false,
                                        dataCostos: newCostos,
                                        precioUnidad: ''
                                    });
                                }}
                                containerStyle={{ width: '100%' }}
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 120 }}
                                items={this.state.categorias}
                                placeholder="Escriba aquí..."
                                underlineColorAndroid="transparent"
                            /> }
                           
                        </View>
                        {this.state.errorCategoria == true ? <AvenirBook style={[styles.error,{marginHorizontal: 20}]}>Ingrese la Categoría</AvenirBook> : null}
                        <View style={styles.inputContent}>
                            <AvenirMedium style={styles.label}>
                                Concepto
                            </AvenirMedium>
                            {this.state.clear == true ? null : <SearchableDropdown
                                onTextChange={text => this.setState({
                                    concepto: text,
                                    errorConcepto: false,
                                    isSelectedUnidad: false,
                                    precioUnidad: ''
                                })}
                                onItemSelect={item => {
                                    let concepto = this.state.dataCostos.filter(element => element.id == item.id)[0];
                                    //console.log('Concepto: ', concepto);
                                    if (concepto.pu == "null" || concepto.pu == "NaN") {
                                        this.setState({
                                            precioUnidad: '',
                                            isSelectedUnidad: false,
                                            concepto: concepto.name,
                                            unidad: concepto.unidad,
                                            errorConcepto: false
                                        });
                                    } else {
                                        this.setState({
                                            precioUnidad: concepto.pu,
                                            isSelectedUnidad: false,
                                            unidad: concepto.unidad,
                                            concepto: concepto.name,
                                            errorConcepto: false
                                        });
                                    }
                                }}
                                containerStyle={{ width: '100%' }}
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 120 }}
                                items={this.state.dataCostos}
                                placeholder="Escriba aquí..."
                                underlineColorAndroid="transparent"
                            /> }
                        </View>
                        {this.state.errorConcepto == true ? <AvenirBook style={[styles.error, { marginHorizontal: 20 }]}>Ingrese el concepto</AvenirBook> : null}
                       
                        {this.state.clear == true ? null : this.state.isSelectedUnidad == false ? <View style={{ marginHorizontal: 20, marginTop: 20 }} 
                            onTouchStart={() => this.setState({
                                isSelectedUnidad: true
                            })}>
                                <CustomInput
                                    error={this.state.errorPrecioUnidad}
                                    label='Unidad'
                                    selectionColor={Colors.primary}
                                    value={this.state.unidad}
                                    returnKeyType={'done'}
                                    onChangeText={(unidad) => {
                                        this.setState({
                                            unidad
                                        });
                                    }}
                                    underlineColor='transparent'
                                />
                            </View> : <View style={styles.inputContent}>
                                <AvenirMedium style={styles.label}>
                                    Unidad
                                </AvenirMedium> 
                                <SearchableDropdown
                                    onTextChange={text => this.setState({
                                        unidad: text,
                                        errorUnidad: false
                                    })}
                                    onItemSelect={item => {
                                        this.setState({
                                            unidad: item.name,
                                            errorUnidad: false
                                        });
                                    }}
                                    containerStyle={{ width: '100%' }}
                                    textInputStyle={SharedStyles.autoInputStyle}
                                    itemStyle={SharedStyles.autoItemStyle}
                                    itemTextStyle={SharedStyles.autoItemTextStyle}
                                    itemsContainerStyle={{ maxHeight: 120 }}
                                    items={this.state.dataUnidadades}
                                    placeholder="Escriba aquí..."
                                    underlineColorAndroid="transparent"
                                />
                            </View> }        
                        {this.state.errorUnidad == true ? <AvenirBook style={[styles.error, { marginHorizontal: 20 }]}>Ingrese la Unidad</AvenirBook> : null}
                        <View style={{ height: 20 }} />
                        <View style={{ marginHorizontal: 20 }}>
                            <CustomInput
                                error={this.state.errorCantidad}
                                label='Cantidad'
                                selectionColor={Colors.primary}
                                keyboardType={'numeric'}
                                value={this.state.cantidad}
                                returnKeyType={'done'}
                                onChangeText={(cantidad) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(cantidad)) {
                                        if (this.state.precioUnidad != '') {
                                            this.setState({
                                                cantidad, errorCantidad: false,
                                                importe: (cantidad * this.state.precioUnidad).toString()
                                            })
                                        } else {
                                            this.setState({
                                                cantidad,
                                                errorCantidad: false
                                            });
                                        }
                                    }
                                }}
                                underlineColor='transparent'
                            />
                            <AvenirBook style={{ marginTop: 5 }}>
                                <NumberFormat
                                    value={parseFloat(this.state.cantidad).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={''}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </AvenirBook>
                            {this.state.errorCantidad == true ? <AvenirBook style={styles.error}>Ingrese una cantidad</AvenirBook> : null}
                        </View>
                        <View style={{ height: 20 }} />
                        <View style={{ marginHorizontal: 20 }}>
                            <CustomInput
                                error={this.state.errorPrecioUnidad}
                                label='Precio Unitario'
                                selectionColor={Colors.primary}
                                keyboardType={'numeric'}
                                value={this.state.precioUnidad}
                                returnKeyType={'done'}
                                onChangeText={(precioUnidad) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(precioUnidad)) {
                                        if (this.state.cantidad != '') {
                                            this.setState({
                                                precioUnidad,
                                                errorPrecioUnidad: false,
                                                importe: (precioUnidad * this.state.cantidad).toString()
                                            });
                                        } else {
                                            this.setState({
                                                precioUnidad,
                                                errorPrecioUnidad: false
                                            });
                                        }
                                    }
                                }}
                                underlineColor='transparent'
                            />
                            <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.precioUnidad), { code: 'USD' })}</AvenirBook>
                            {this.state.errorPrecioUnidad == true ? <AvenirBook style={styles.error}>Ingrese una cantidad</AvenirBook> : null}
                        </View>
                        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                            <CustomInput
                                error={this.state.errorImporte}
                                label='Importe'
                                selectionColor={Colors.primary}
                                keyboardType={'numeric'}
                                value={this.state.importe}
                                returnKeyType={'done'}
                                onChangeText={(importe) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(importe)) {
                                        this.setState({
                                            importe,
                                            errorImporte: false
                                        })
                                    }
                                }}
                                underlineColor='transparent'
                            />
                            <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.importe), { code: 'USD' })}</AvenirBook>
                            {this.state.errorImporte == true ? <AvenirBook style={styles.error}>Ingrese el importe</AvenirBook> : null}
                        </View>
                        <CustomButton
                            style={{ marginVertical: 30, marginHorizontal: 20}}
                            title='Solicitar'
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
                            cantidad: '',
                            concepto: '',
                            categoria: '',
                            unidad: '',
                            precioUnidad: '',
                            importe: '',
                            clear: false,
                            isSelectedUnidad: false
                        });
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    marginContent: {
        marginHorizontal: 20,
        marginTop: 20
    }, 
    label: {
        color: Colors.title,
        fontSize: 12,
        marginTop: 10,
        marginLeft: 10
    },
    inputContent: {
        marginTop: 20,
        marginHorizontal: 20,
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
    dropdownContainer: {
        paddingTop: 0,
        marginTop: 0,
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