import React, { Component } from 'react';
import { Platform, View, BackHandler , TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, Text, Alert, KeyboardAvoidingView } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirMedium, AvenirBook } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import NumberFormat from 'react-number-format';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
import SearchableDropdown from 'react-native-searchable-dropdown';
var currencyFormatter = require('currency-formatter');

export default class EditarDesgloseGastoScreen extends Component {
  constructor(props) {
    super(props);
    const { dataUnidadades, editable }=this.props.navigation.state.params;
    let index = dataUnidadades.findIndex(element => element.name == editable.unidad)

    this.state = {
        nombre: editable.nombre,
        errorNombre: false,
        clear: true,
        renderUnidad: false,
        unidad: editable.unidad,
        dataUnidadades: dataUnidadades,
        errorUnidad: false,
        defaultIndex: index.toString(),
        precioUnidad: editable.pu,
        errorPrecioUnidad: false,
        cantidad: editable.cantidad,
        errorCantidad: false,
        totalGasto: editable.total,
        auxTotalGasto: editable.total,
        errorTotal: false,
        proveedor: editable.provedor,
        dataProveedores: [],
        notas: editable.notas,
        showAlert: false,
        errorProveedor: false,
        isLoading: false
    };
  }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.getProveedores();
    }

    getProveedores() {
        const { accessInfo } = this.props.screenProps;
        var formData = new FormData();
        formData.append('id', accessInfo.user.id);
        fetch(URLBase + '/res/regresaProveedores', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR JSON PROVEEDORES *********************');
                console.log(responseJson);
                let editable = this.props.navigation.state.params.editable;
                console.log('************************* VALOR JSON PROVEEDORES *********************');
                let proveedorIndex = responseJson.proveedores.findIndex(element => element.name == editable.provedor);
                console.log('Index: ', proveedorIndex);
                console.log('Proveedor: ', editable.provedor);
                this.setState({
                    dataProveedores: responseJson.proveedores,
                    proveedorIndex: proveedorIndex == -1 ? null : proveedorIndex.toString(),
                    clear: false
                });
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }

    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }
    updateCosto = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { editable } = this.props.navigation.state.params;
        const { nombre, unidad, precioUnidad, cantidad, proveedor, totalGasto, auxTotalGasto, notas} = this.state;
        let diferencia= parseInt(totalGasto) - parseInt(auxTotalGasto); 
        formData.append('id', editable.id);
        formData.append('nombre', nombre);
        formData.append('unidad', unidad);
        formData.append('pu', precioUnidad);
        formData.append('cantidad', cantidad);
        formData.append('total', totalGasto);
        formData.append('diferencia', diferencia);
        formData.append('provedor', proveedor);
        formData.append('notas', notas);
        fetch(URLBase + '/dir/updateCosto', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Editar DESGLOSE *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                   this.props.navigation.state.params.actualizaCosto(responseJson.Costo);
                   this.props.navigation.state.params.refreshCategorias();
                   this.props.navigation.goBack();
                } else {
                    Alert.alert('Error', 'No se han podido actualizar el gasto');
                    this.setState({
                        isLoading: false
                    })
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }
  validaEditGasto() {
        const { nombre, totalGasto } = this.state;
        if (nombre == '') {
            this.setState({
                errorNombre: true,
                isLoading: false
            });
        } else if (totalGasto == '') {
            this.setState({
                errorTotalGasto: true,
                isLoading: false
            });
        } else {
            this.setState({
                isLoading: true,
                isLoading: false
            });
            this.updateCosto();
        }
    }
    
  render() {
    const offset = (Platform.OS === 'android') ? -200 : 0;
    return (
        <View style={SharedStyles.container}>
            <HeaderGrayBack
                title={'Editar Desglose'}
                action={() => {
                    this.props.navigation.goBack();
                }}
            />
            <View style={{ flex: 1}}>
                <KeyboardAvoidingView style={{ flex: 1, }}
                    keyboardShouldPersistTaps="always"
                    behavior={Platform.OS === "ios" ? "padding" : null} enabled
                >
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={{ flex: 1 }}>
                        <View style={{ margin: 20 }}>
                            <CustomInput
                                error={this.state.errorNombre}
                                label='Concepto'
                                value={this.state.nombre}
                                returnKeyType={'done'}
                                onChangeText={nombre => {
                                    this.setState({ nombre, errorNombre: false });
                                }}
                                underlineColor={Colors.divisor}
                            />
                            <View style={styles.inputContent}>
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
                                                    errorUnidad: false,
                                                });
                                            }}
                                            containerStyle={{ width: '100%' }}
                                            defaultIndex={this.state.defaultIndex}
                                            textInputStyle={SharedStyles.autoInputStyle}
                                            itemStyle={SharedStyles.autoItemStyle}
                                            itemTextStyle={SharedStyles.autoItemTextStyle}
                                            itemsContainerStyle={{ maxHeight: 140 }}
                                            items={this.state.dataUnidadades}
                                            defaultIndex={this.state.defaultIndex}
                                            placeholder="Escriba aquí..."
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                            
                            <View style={{height: 20}}/>
                            <CustomInput
                                error={this.state.errorCantidad}
                                label='Cantidad'
                                value={this.state.cantidad}
                                returnKeyType={'done'}
                                keyboardType='numeric'
                                onChangeText={cantidad => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(cantidad)) {
                                        if (this.state.precioUnidad != '') {
                                            this.setState({
                                                cantidad, errorCantidad: false,
                                                totalGasto: (cantidad * this.state.precioUnidad).toString()
                                            })
                                        } else {
                                            this.setState({
                                                cantidad, errorCantidad: false
                                            });
                                        }
                                    }
                                }}
                                underlineColor={Colors.divisor}
                            />
                            <AvenirBook style={{ marginVertical: 5 }}>
                                <NumberFormat
                                    value={parseFloat(this.state.cantidad)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={''}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </AvenirBook>
                            <CustomInput
                                error={this.state.errorPrecioUnidad}
                                label='Precio Unitario'
                                value={this.state.precioUnidad}
                                returnKeyType={'done'}
                                keyboardType='numeric'
                                onChangeText={precioUnidad => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(precioUnidad)) {
                                        if (this.state.cantidad != '') {
                                            this.setState({
                                                precioUnidad, errorPrecioUnidad: false,
                                                totalGasto: (precioUnidad * this.state.cantidad).toString()
                                            })
                                        } else {
                                            this.setState({
                                                precioUnidad, errorPrecioUnidad: false
                                            })
                                        }
                                    }
                                }}
                                underlineColor={Colors.divisor}
                            />
                            <AvenirBook style={{ marginVertical: 5 }}>{currencyFormatter.format(parseFloat(this.state.precioUnidad), { code: 'USD' })}</AvenirBook>
                            <CustomInput
                                error={this.state.errorTotalGasto}
                                onChangeText={total => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(total)) {
                                        this.setState({
                                            totalGasto: total,
                                            errorTotalGasto: false
                                        });
                                    }
                                }}
                                label='Importe'
                                keyboardType='numeric'
                                value={this.state.totalGasto}
                                returnKeyType={'done'}
                                underlineColor={Colors.divisor}
                            />
                            <AvenirBook style={{ marginVertical: 5 }}>{currencyFormatter.format(parseFloat(this.state.totalGasto), { code: 'USD' })}</AvenirBook>
                            <View style={[styles.inputContent, {marginTop: 0}]}>
                                <AvenirMedium style={styles.label}>
                                    Proveedor
                                </AvenirMedium>
                                {this.state.clear == true ? null : <SearchableDropdown
                                    onTextChange={text => this.setState({
                                        proveedor: text,
                                    })}
                                    onItemSelect={item => {
                                        this.setState({
                                            proveedor: item.name,
                                        });
                                    }}
                                    containerStyle={{ width: '100%' }}
                                    textInputStyle={SharedStyles.autoInputStyle}
                                    itemStyle={SharedStyles.autoItemStyle}
                                    itemTextStyle={SharedStyles.autoItemTextStyle}
                                    itemsContainerStyle={{ maxHeight: 140 }}
                                    defaultIndex={this.state.proveedorIndex}
                                    items={this.state.dataProveedores}
                                    placeholder="Escriba aquí..."
                                    underlineColorAndroid="transparent"
                                />}
                            </View>
                            <View style={{height: 20}}/>
                            <CustomInput
                                error={this.state.errorNotas}
                                label='Notas'
                                value={this.state.notas}
                                returnKeyType={'done'}
                                onChangeText={notas => {
                                    this.setState({ notas });
                                }}
                                multiline={true}
                                underlineColor={Colors.divisor}
                            />
                            <CustomButton
                                style={{ marginTop: 20 }}
                                title='Modificar'
                                loading={this.state.isLoading}
                                fontSize={14}
                                onPress={() => {
                                    console.log('isLoading: ', this.state.isLoading);
                                    if (this.state.isLoading == false) {
                                        this.setState({
                                            isLoading: true
                                        });
                                        this.validaEditGasto();
                                    }
                                }} />

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    label: {
        color: Colors.title,
        fontSize: 12,
        marginTop: 10,
        marginLeft: 10
    },
    inputContent: {
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
    inputStyle: {
        borderRadius: 0,
        backgroundColor: Colors.white,
        marginTop: 5
    },
    addContainer: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.title
    },
    text: {
        fontSize: 12,
        width: '20%',
        textAlign: 'center'
    },
    textGray: {
        fontSize: 12,
        color: Colors.subtitle,
        width: '20%',
        textAlign: 'center'
    },
    totalContainer: {
        marginTop: 10,
        alignItems: 'flex-end'
    },
    rowCategoriaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
});
/* <View style={styles.inputContent}>
                                    <AvenirMedium style={styles.label}>
                                        Unidad
                                </AvenirMedium>
                                    <TextInput
                                        style={{ fontSize: 16, fontFamily: 'avenir-medium', paddingLeft: 12, color: Colors.gray, width: '100%', borderColor: Colors.gray, borderBottomWidth: 1 }}
                                        onTouchStart={() => this.setState({
                                            renderUnidad: true
                                        })}
                                        value={this.state.unidad}
                                    />
                                </View> */