import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import SearchableDropdown from 'react-native-searchable-dropdown';
import NumberFormat from 'react-number-format';
var currencyFormatter = require('currency-formatter');

export default class RegistrarGastoScreen extends Component {
    constructor(props) {
        super(props);
        let newCategorias = [];
        const { categorias, idProyecto } = props.navigation.state.params;
        categorias.forEach(element => {
            if (element.statusGastos != '3') {
                newCategorias.push({ id: element.id, value: element.nombre, name: element.nombre, costos: element.costos});
            }
        });
        let dataUnidadades=[];
        let i=1;
        const { unidades }=this.props.screenProps;
        unidades.forEach(element => {
            dataUnidadades.push({
                id: i,
                name: element
            });
            i++;
        }); 
        this.state = {
            enableScrollViewScroll: true,
            clear: false,
            cantidad: '',
            loading: false,
            nombreCategoria: '',
            nombreCosto: '',
            errorCantidad: false,
            categoria: '',
            errorCategoria: false,
            total: '',
            errorTotal: false,
            unidad: '',
            pu: '',
            importe: '',
            proveedor: '',
            notas: '',
            errorImporte: false,
            categorias: newCategorias,
            costos: [],
            costo: '',
            dataUnidadades,
            dataProveedores: []
        };
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
                this.setState({
                    dataProveedores: responseJson.proveedores
                });
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    createGasto = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { idProyecto } = this.props.navigation.state.params;
        const { nombreCategoria, nombreCosto, unidad, pu, importe, cantidad, proveedor, notas } = this.state;
        let precioUnitario= parseFloat(pu).toFixed(2);
        let formatImporte = parseFloat(importe).toFixed(2);

        formData.append('proyecto_id',idProyecto);
        formData.append('categorias', nombreCategoria);
        formData.append('costos', nombreCosto);
        formData.append('unidad',unidad);
        formData.append('pu', precioUnitario);
        formData.append('cantidad', cantidad);
        formData.append('importe',formatImporte);
        formData.append('proveedor', proveedor);
        formData.append('notas', notas);

        fetch(URLBase + '/res/crearGasto', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR JSON CREAR GASTO *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    let total= parseFloat(this.state.precioUnidad) * parseFloat(cantidad);
                    this.props.navigation.state.params.updateGastos(this.state.nombreCategoria, this.state.nombreGasto,total);
                    this.setState({
                        showAlert: true,
                        clear: true,
                        title: 'Gasto Registrado',
                        message: 'El nuevo gasto ha sido registrado exitosamente',
                        loading: false
                    });
                } else {
                    Alert.alert('Error', 'No se han podido actualizar el gasto');
                    this.setState({
                        loading: false
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    validaForm() {
        const { nombreCategoria, importe, nombreCosto} = this.state;
        this.setState({
            loading: true
        });
        if (nombreCategoria == '') {
            this.setState({
                errorCategoria: true,
                loading: false
            });
        } else if (nombreCosto == '') {
            this.setState({
                errorCosto: true,
                loading: false
            });
        } else if (importe == '') {
            this.setState({
                errorImporte: true,
                loading: false
            });
        } else
           this.createGasto();
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
                        title='Registrar Gasto'
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView
                    keyboardShouldPersistTaps="always"
                    style={styles.container}>
                        <View style={styles.inputContent}>
                            <AvenirMedium style={{color: Colors.title, fontSize: 12, marginTop: 10, marginLeft: 10}}>
                            Categoría
                            </AvenirMedium>
                            { this.state.clear == true ? null 
                                : <SearchableDropdown
                                    onTextChange={text => this.setState({
                                        nombreCategoria: text,
                                        pu: ''
                                    })}
                                    onItemSelect={item => {
                                        let costos = this.state.categorias.filter(element => element.id == item.id)[0].costos;
                                        let newCostos = [];
                                        let indexRep = -1;
                                        let i = 0;
                                        costos.forEach(element => {
                                            /*indexRep = newCostos.findIndex(item => item.name == element.nombre);
                                            if (indexRep == -1) {
                                                newCostos.push({ id: element.id, name: element.nombre, value: element.nombre, pu: element.pu, unidad: element.unidad })
                                            } else if (i == 0) {
                                                newCostos.push({ id: element.id, name: element.nombre, value: element.nombre, pu: element.pu, unidad: element.unidad })
                                            }
                                            i++;*/
                                            newCostos.push({ id: element.id, name: element.nombre + ', $'+ element.pu, value: element.nombre, pu: element.pu, unidad: element.unidad, proveedor: element.provedor });
                                        });
                                        this.setState({
                                            nombreCategoria: item.name,
                                            errorCategoria: false,
                                            costos: newCostos,
                                            pu: ''
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
                                />
                            }
                        </View>
                        { this.state.errorCategoria == true ? <AvenirBook style={styles.error}>Ingrese la Categoría</AvenirBook> : null }
                        { this.state.clear == true ? null 
                            : this.state.isSelectedProveedor == false 
                                ?   <View style={{ marginHorizontal: 20, marginTop: 20 }}
                                        onTouchStart={() => this.setState({
                                            isSelectedProveedor: true
                                        })}>
                                        <CustomInput
                                            error={this.state.errorProveedor}
                                            label={'Proveedor'}
                                            selectionColor={Colors.primary}
                                            value={this.state.proveedor}
                                            returnKeyType={'done'}
                                            onChangeText={(proveedor) => {
                                                this.setState({ proveedor });
                                            }}
                                            underlineColor='transparent'
                                        />
                                    </View> 
                                :   <View style={styles.inputContent}>
                                        <AvenirMedium style={styles.label}>
                                            Proveedor
                                        </AvenirMedium>
                                        <SearchableDropdown
                                            onTextChange={text => this.setState({ proveedor: text})}
                                            onItemSelect={item => { this.setState({ proveedor: item.name }) }}
                                            containerStyle={{ width: '100%' }}
                                            textInputStyle={SharedStyles.autoInputStyle}
                                            itemStyle={SharedStyles.autoItemStyle}
                                            itemTextStyle={SharedStyles.autoItemTextStyle}
                                            itemsContainerStyle={{ maxHeight: 120 }}
                                            items={this.state.dataProveedores}
                                            defaultIndex={this.state.proveedorIndex}
                                            placeholder="Escriba aquí..."
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                        }
                        <View style={styles.inputContent}>
                            <AvenirMedium style={styles.label}>
                                Concepto
                            </AvenirMedium>
                            { this.state.clear == true ? null 
                                :   <SearchableDropdown
                                        containerStyle={{ width: '100%' }}
                                        textInputStyle={SharedStyles.autoInputStyle}
                                        itemStyle={SharedStyles.autoItemStyle}
                                        itemTextStyle={SharedStyles.autoItemTextStyle}
                                        itemsContainerStyle={{ maxHeight: 120 }}
                                        items={this.state.costos}
                                        placeholder="Escriba aquí..."
                                        underlineColorAndroid="transparent"
                                        onTextChange={text => this.setState({
                                            nombreCosto: text,
                                            pu: '',
                                            importe: '',
                                            isSelectedUnidad: false,
                                            isSelectedProveedor: false,
                                        })}
                                        onItemSelect={item => {
                                            concepto = this.state.costos.filter(element => element.id == item.id)[0];
                                            proveedorIndex = this.state.dataProveedores.findIndex(element => element.name == item.proveedor);     

                                            if (concepto.pu == "null" || concepto.pu == "NaN") {
                                                this.setState({
                                                    costo: concepto.id,
                                                    pu: '',
                                                    importe: '',
                                                    nombreCosto: concepto.name,
                                                    errorCosto: false,
                                                    isSelectedUnidad: false,
                                                    isSelectedProveedor: false,
                                                    unidad: concepto.unidad
                                                });
                                            } else {
                                                this.setState({
                                                    costo: concepto.id,
                                                    pu: concepto.pu,
                                                    importe: '',
                                                    nombreCosto: concepto.name,
                                                    errorCosto: false,
                                                    isSelectedUnidad: false,
                                                    isSelectedProveedor: false,
                                                    unidad: concepto.unidad
                                                });
                                            }
                                        }}
                                    /> 
                            }       
                        </View>
                        { this.state.errorCosto == true ? <AvenirBook style={styles.error}>Ingrese el Concepto</AvenirBook> : null}
                        { this.state.clear == true ? null 
                            : this.state.isSelectedUnidad == false 
                                ?   <View style={{ marginHorizontal: 20, marginTop: 20 }}
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
                                    </View> 
                                :   <View style={styles.inputContent}>
                                        <AvenirMedium style={styles.label}>
                                            Unidad
                                        </AvenirMedium>
                                        {this.state.clear == true ? null : <SearchableDropdown
                                            onTextChange={text => this.setState({
                                                unidad: text
                                            })}
                                            onItemSelect={item => {
                                                this.setState({
                                                    unidad: item.name
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
                                        /> }
                                    </View>
                        }
                        <View style={{ height: 20 }} />
                        <View style={{marginHorizontal: 20}}>
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
                                        if (this.state.pu != '') {
                                            this.setState({
                                                cantidad, errorCantidad: false,
                                                importe: (cantidad * this.state.pu).toString()
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
                                error={this.state.errorPu}
                                label='Precio Unitario'
                                selectionColor={Colors.primary}
                                keyboardType={'numeric'}
                                value={this.state.pu}
                                returnKeyType={'done'}
                                onChangeText={(pu) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(pu)) {
                                         if(this.state.cantidad!=''){
                                                    this.setState({
                                                        pu, 
                                                        errorPrecioUnidad: false,
                                                        importe: (pu * this.state.cantidad).toString()
                                                    });
                                                }else {
                                                    this.setState({
                                                        pu, 
                                                        errorPrecioUnidad: false
                                                    });
                                                }
                                    }
                                }}
                                underlineColor='transparent'
                            />
                            <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.pu), { code: 'USD' })}</AvenirBook>
                            {this.state.errorPu == true ? <AvenirBook style={styles.error}>Ingrese una cantidad</AvenirBook> : null}
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
                        <View style={{marginHorizontal: 20, marginTop: 20}}>
                            <CustomInput
                                label='Método de Pago / Notas'
                                selectionColor={Colors.primary}
                                value={this.state.notas}
                                returnKeyType={'done'}
                                multiline={true}
                                onChangeText={notas => this.setState({ notas })}
                                underlineColor='transparent'
                            />
                        </View>
                        <CustomButton
                            style={{ marginVertical: 40, marginHorizontal: 20 }}
                            loading={this.state.loading}
                            title='Registrar'
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
                            costo: '',
                            nombreCategoria: '',
                            nombreCosto: '',
                            unidad: '',
                            categoria: '',
                            cantidad: '',
                            pu: '',
                            importe: '',
                            categoria: '',
                            concepto: '',
                            notas:'',
                            proveedor: '',
                            clear: false,
                            isSelectedUnidad: false,
                            isSelectedProveedor: false
                        })
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    label: { 
        color: Colors.title, 
        fontSize: 12, 
        marginTop: 10, 
        marginLeft: 10 
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
        marginTop: 10,
        marginHorizontal: 20
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
});