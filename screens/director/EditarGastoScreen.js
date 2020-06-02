import React, { Component } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, Text } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import NumberFormat from 'react-number-format';
import SearchableDropdown from 'react-native-searchable-dropdown';

var currencyFormatter = require('currency-formatter');

export default class EditarGastoScreen extends Component {
    constructor(props) {
        super(props);
        let dataUnidadades = [];
        let dataCategorias = [];
        let i, defaultIndexUni, defaultIndexCate;
        let editable = this.props.navigation.state.params.editable;
        const { unidades, categorias } = this.props.screenProps;

        console.log('editable: ', editable);
        console.log(this.props.navigation);
        i = 1;

        unidades.forEach(element => {
            dataUnidadades.push({
                id: i,
                name: element
            });
            i++;
        });

        i = 1;

        categorias.forEach(element => {
            dataCategorias.push({
                id: i,
                name: element.nombre
            });
            i++;
        });

        dataUnidadades.push({
            id: dataUnidadades.length,
            name: editable.unidad
        });

        dataCategorias.push({
            id: dataCategorias.length + 1,
            name: editable.categoria
        });

        defaultIndexUni = dataUnidadades.findIndex(element => element.name == editable.unidad);
        defaultIndexCate = dataCategorias.findIndex(element => element.name == editable.categoria);

        this.state = {
            proveedor: '',
            descripcion: '',
            loading: false,
            clear: true,
            errorNombre: false,
            errorUnidad: false,
            errorCategoria: false,
            errorImporte: false,
            errorCantidad: false,
            errorPrecioUnidad: false,
            nombre: editable.nombre,
            notas: editable.notas,
            unidad: editable.unidad,
            categoria: editable.categoria,
            precioUnidad: editable.pu,
            cantidad: editable.cantidad,
            importe: editable.total,
            dataUnidadades,
            dataCategorias,
            defaultIndexUni: defaultIndexUni == -1 ? null : defaultIndexUni.toString(),
            defaultIndexCate: defaultIndexCate == -1 ? null : defaultIndexCate.toString(),
        };
    }

    componentDidMount() {
        this.getProveedores();
    }

    getProveedores() {
        const { accessInfo } = this.props.screenProps;
        const {idProyecto} = this.props.navigation.state.params;
        //let i;
        let dataCategorias = [];
        var formData = new FormData();
        
        formData.append('id', accessInfo.user.id);
        formData.append('idProyecto', idProyecto);
    
        fetch(URLBase + '/res/regresaProveedores', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                //console.log('************************* VALOR JSON PROVEEDORES *********************');
                //console.log(responseJson);
                let editable = this.props.navigation.state.params.editable;
                //console.log('************************* VALOR JSON PROVEEDORES *********************');
                let proveedorIndex = responseJson.proveedores.findIndex(element => element.name == editable.proveedor);
                //console.log('Index: ',proveedorIndex);

                /*i = 1;

                responseJson.categorias.forEach(element => {
                    dataCategorias.push({
                        id: i,
                        name: element.nombre
                    });
                    i++;
                });

                dataCategorias.push({
                    id: dataCategorias.length,
                    name: editable.nombre
                });
                
                console.log("HOLAAA ", dataCategorias);

                defaultIndexCate = dataCategorias.length - 1;

                console.log(defaultIndexCate);*/

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

    updateGasto = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { idProyecto, editable } = this.props.navigation.state.params;
        const { categoria, nombre, unidad, descripcion, cantidad, precioUnidad, importe, proveedor, notas } = this.state;

        formData.append('id', idProyecto);
        formData.append('idCosto', editable.idCosto);
        formData.append('idGasto', editable.id);
        formData.append('categoria', categoria);
        formData.append('nombre', nombre);
        formData.append('unidad', unidad);
        formData.append('notas', descripcion);
        formData.append('cantidad', parseFloat(cantidad).toFixed(2));
        formData.append('pu', parseFloat(precioUnidad).toFixed(2));
        formData.append('total', parseFloat(importe).toFixed(2));
        formData.append('proveedor', proveedor);
        formData.append('notas', notas);

        fetch(URLBase + '/dir/actualizarGasto', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Editar Destajista *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    let costoActualizado={
                        id: editable.id,
                        create_at: editable.create_at,
                        idCategoria: editable.idCategoria,
                        idCosto: editable.idCosto,
                        nombre: nombre,
                        notas: notas,
                        proveedor: proveedor,
                        cantidad: parseFloat(cantidad).toFixed(2),
                        pu: parseFloat(precioUnidad).toFixed(2),
                        total: parseFloat(importe).toFixed(2),
                        unidad: unidad
                    }
                    this.props.navigation.state.params.actualizaCosto(costoActualizado);
                    this.props.navigation.state.params.refreshCategorias();
                    this.setState({
                        showAlert: true,
                        title: 'Gasto actualizado',
                        message: 'El gasto ha sido actualizado correctamente',
                        loading: false
                    });
                } else {
                    Alert.alert('No se han podido actualizar el destajo', responseJson.message);
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
        const { categoria, nombre, unidad, cantidad, precioUnidad, importe, } = this.state;

        console.log(categoria);

        this.setState({
            loading: true
        });
        if (nombre == '') {
            this.setState({
                errorNombre: true,
                loading: false
            });
        } else if (unidad == '') {
            this.setState({
                errorUnidad: true,
                loading: false
            });
        } else if (categoria == '') {
            this.setState({
                errorCategoria: true,
                loading: false
            });
        } else if (cantidad == '') {
            this.setState({
                errorCantidad: true,
                loading: false
            });
        } else if (precioUnidad == '') {
            this.setState({
                errorPrecioUnidad: true,
                loading: false
            });
        } else if (importe == '') {
            this.setState({
                errorImporte: true,
                loading: false
            });
        } else {
           this.updateGasto();
        }
    }

    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;

        return (
            <KeyboardAvoidingView
                style={styles.fatherContainer} behavior="padding" 
                behavior={Platform.OS === "ios" ? "padding" : null} enabled
            >
                <View style={SharedStyles.container}>
                    <HeaderGrayBack
                        title={'Editar Gasto'}
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.container}>
                        <View style={styles.inputContent}>
                            <AvenirMedium style={styles.label}>
                                Categoria
                            </AvenirMedium>
                            <SearchableDropdown
                                onTextChange={text => this.setState({
                                    categoria: text,
                                    errorCategoria: false
                                })}
                                onItemSelect={item => {
                                    this.setState({
                                        categoria: item.name,
                                        errorCategoria: false,
                                    });
                                }}
                                containerStyle={{ width: '100%' }}
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 140 }}
                                items={this.state.dataCategorias}
                                defaultIndex={this.state.defaultIndexCate}
                                placeholder="Escriba aquí..."
                                underlineColorAndroid="transparent"
                            /> 
                        </View>
                        {this.state.errorCategoria == true ? <AvenirBook style={styles.error}>Ingrese una Categoría</AvenirBook> : null}
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.errorNombre}
                                label='Concepto'
                                selectionColor={Colors.primary}
                                value={this.state.nombre}
                                returnKeyType={'done'}
                                onChangeText={nombre => this.setState({ nombre, errorNombre: false })}
                                underlineColor='transparent'
                            />
                        </View>
                        {this.state.errorNombre == true ? <AvenirBook style={styles.error}>Ingrese un Nombre</AvenirBook> : null}
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
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 140 }}
                                items={this.state.dataUnidadades}
                                defaultIndex={this.state.defaultIndexUni}
                                placeholder="Escriba aquí..."
                                underlineColorAndroid="transparent"
                            /> 
                        </View>
                        {this.state.errorUnidad == true ? <AvenirBook style={styles.error}>Ingrese una Unidad</AvenirBook> : null}
                        <View style={styles.marginContent}>
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
                            {this.state.errorCantidad == true ? <AvenirBook style={styles.error}>Ingrese la Cantidad</AvenirBook> : null}
                        </View>
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.errorPrecioUnidad}
                                label='Precio Unitario'
                                keyboardType={'numeric'}
                                selectionColor={Colors.primary}
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
                        </View>
                        {this.state.errorPrecioUnidad == true ? <AvenirBook style={styles.error}>Ingrese el Precio por Unidad</AvenirBook> : null}
                        <View style={styles.marginContent}>
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
                        <View style={styles.inputContent}>
                            <AvenirMedium style={{ color: Colors.title, fontSize: 12, marginTop: 10, marginLeft: 10 }}>
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
                        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
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
                                style={{ marginVertical: 20, marginHorizontal: 20 }}
                                title='Actualizar'
                                loading={this.state.loading}
                                fontSize={14}
                                onPress={() => {
                                    if (this.state.loading == false) {
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
                        this.props.navigation.goBack();
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
        marginTop: 10,
        marginHorizontal: 20
    },
});
/* <View style={styles.marginContent}>
        <CustomInput
            label='Notas'
            selectionColor={Colors.primary}
            value={this.state.descripcion}
            returnKeyType={'done'}
            multiline={true}
            onChangeText={descripcion => this.setState({ descripcion })}
            underlineColor='transparent'
        />
    </View> */