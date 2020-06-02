import React, { Component } from 'react';
import { Platform,View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Modal, Text, Alert, KeyboardAvoidingView } from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import AwesomeAlert from 'react-native-awesome-alerts';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium, AvenirBook } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import NumberFormat from 'react-number-format';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBackDelete } from '../../components/Headers';
import SearchableDropdown from 'react-native-searchable-dropdown';
var currencyFormatter = require('currency-formatter');

export default class DesgloseGastoScreen extends Component {
    constructor(props) {
        super(props);
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
        
        console.log('************************* Costos ***************************');
        const { costos, idCategoria } = this.props.navigation.state.params;
        console.log(this.props.navigation.state.params.costos);
        console.log('ID DE CATEGORIA: ', idCategoria);
        let total = 0;
        let nuevosCostos=[];
        if (costos && costos.lenght !== 0) {
            costos.forEach((element) => {
                if (element.obrero != '1' && element.status == '1' && element.statusGastos=='0') {
                    nuevosCostos.push(element);
                    total = total + parseFloat(element.total.replace("$", "", "gi"));
                }
            })
            this.state = {
                modalVisible: false,
                clear: false,
                costos: nuevosCostos.filter(element => element.status=='1'),
                total,
                notas: '',
                dataProveedores: [],
                dataUnidadades,
                nombre: '',
                errorNombre: false,
                unidad: '',
                errorUnidad: false,
                precioUnidad: '',
                errorPrecioUnidad: false,
                cantidad: '',
                errorCantidad: false,
                totalGasto: '',
                errorTotalGasto: false,
                errorTotal: false,
                proveedor: '',
                showAlertConfirm: false,
                showAlertEdit: false,
                errorProveedor: false,
                isLoading: false
            }
        } else { 
            this.state = {
                modalVisible: false,
                clear: false,
                costos: [],
                total,
                notas:'',
                dataProveedores: [],
                dataUnidadades,
                nombre: '',
                errorNombre: false,
                unidad: '',
                errorUnidad: false,
                precioUnidad: '',
                errorPrecioUnidad: false,
                cantidad: '',
                errorCantidad: false,
                totalGasto: '',
                errorTotal: false,
                proveedor: '',
                showAlertConfirm: false,
                showAlertEdit: false,
                errorProveedor: false,
                isLoading: false
            } 
    }

    }
    componentDidMount() {
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
    setModalVisible(visible) {
        this.setState({ 
            modalVisible: visible,
            clear: false
         });
    }
    actualizaCosto(hito){
        let index =this.state.costos.findIndex(element => element.id ==hito.id);
        let updateCostos=this.state.costos;
        let total=0;
        updateCostos[index]=hito;
        updateCostos.forEach((element) => {
                total = total + parseFloat(element.total.replace("$", "", "gi"));
        })
        this.setState({
            costos: updateCostos,
            total
        });
    }

    createCosto = async () => {
        var formData = new FormData();
        const { params } = this.props.navigation.state;
        const { accessInfo } = this.props.screenProps;
        const { nombre, unidad, precioUnidad, cantidad, proveedor, totalGasto, notas } = this.state;
        formData.append('id', params.idCategoria);
        formData.append('nombre', nombre);
        formData.append('unidad', unidad);
        if(precioUnidad==''){
            Alert.alert('Entra');
            formData.append('pu', '0');
        }else {
            formData.append('pu', parseFloat(precioUnidad).toFixed(2));
        }
        formData.append('cantidad', parseFloat(cantidad).toFixed(2));
        formData.append('total', parseFloat(totalGasto).toFixed(2));
        formData.append('provedor', proveedor);
        formData.append('notas', notas);
        fetch(URLBase + '/dir/createCosto', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Agreagra Gasto DESGLOSE *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    let unidades = [];
                    let index = this.state.dataUnidadades.findIndex(element => element.name == unidad)
                    console.log('Index: ', index);
                    if (index == -1) {
                        if (this.state.dataUnidadades.length == 0) {
                            unidades.push({
                                id: this.state.dataUnidadades.length + 1,
                                name: unidad
                            });
                        }else {
                            unidades = this.state.dataUnidadades;
                            unidades.push({
                                id: this.state.dataUnidadades.length + 1,
                                name: unidad
                            });
                        }
                        
                    } else {
                        unidades = this.state.dataUnidadades
                    }
                    let costos=this.state.costos;
                    costos= costos.filter(element => element.id != responseJson.costo.id );
                    costos.push(responseJson.costo);
                    this.setState({
                        isLoading: false, 
                        modalVisible: false,
                        costos,
                        nombre: '',
                        total: this.state.total + parseFloat(responseJson.costo.total),
                        unidad: '',
                        precioUnidad: '',
                        cantidad: '',
                        totalGasto: '',
                        proveedor: '',
                        dataUnidadades: unidades,
                        notas: ''
                    });
                    this.props.navigation.state.params.refreshCategorias();
                } else {
                    Alert.alert('Error', 'No se han podido actualizar las categorias');
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
    validaAddGasto(){
        const{ nombre, totalGasto }=this.state;
        if(nombre==''){
            this.setState({
                errorNombre: true,
                isLoading: false
            });
        }else if(totalGasto==''){
            this.setState({
                errorTotalGasto: true,
                isLoading: false
            });
        }else {
            this.setState({
                isLoading: true,
                isLoading: false
            });
            this.createCosto();
        }
    }
    _keyExtractor = (item, index) => item.id.toString();
    _renderItem = ({ item }) => (
        <TouchableOpacity
        onPress={() => this.setState({
            showAlertEdit: true,
            editable: item
        })} 
        style={styles.rowCategoriaContainer}>
            <AvenirMedium style={styles.textGray}>
                {item.nombre}
            </AvenirMedium>
            <AvenirMedium style={styles.textGray}>
                {item.unidad}
            </AvenirMedium>
            <AvenirMedium style={styles.textGray}>
                {
                    item.pu == "null" || item.pu == "NaN" ? '--' : <NumberFormat
                        value={parseFloat(item.pu).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        renderText={value => <Text>{value}</Text>}
                    />
                }
            </AvenirMedium>
            <AvenirMedium style={styles.textGray}>
                {item.cantidad == "null" || item.cantidad == "NaN"? '--' : parseFloat(item.cantidad).toFixed(2) }
            </AvenirMedium>
            <AvenirMedium style={styles.textGray}>
                <NumberFormat
                    value={parseFloat(item.total.replace("$", "", "gi")).toFixed(2)}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    renderText={value => <Text>{value}</Text>}
                />
            </AvenirMedium>
        </TouchableOpacity>
    );
    onDeleteDesglose() {
        const { editable } = this.state;
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        console.log('Id ha eliminar: ', editable.id);
        formData.append('id', editable.id);
        fetch(URLBase + '/dir/deleteCosto', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* ELIMINAR DESGLOSE *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    let total = 0;
                    let nuevosCostos = [];
                    this.state.costos.forEach(element => {
                        if (element.id != editable.id) {
                            nuevosCostos.push(element);
                            total = total + parseFloat(element.total.replace("$", "", "gi"));
                        }
                    })
                    this.setState({
                        costos: nuevosCostos,
                        total
                    });
                    this.props.navigation.state.params.refreshCategorias();
                } else {
                    Alert.alert('Error', 'No se han podido eliminar el desglose');
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
    onDelete= () => {
        const { params } = this.props.navigation.state;
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        console.log('Id de categoria: ', params.idCategoria);
        formData.append('id', params.idCategoria);
        fetch(URLBase + '/dir/deleteCategoria', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* ELIMINAR Categoria *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.props.navigation.state.params.refreshCategorias();
                    this.props.navigation.goBack();
                } else {
                   Alert.alert('Error', 'No ha sido posible eliminar la categoría');
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
       /* this.props.navigation.state.params.refreshCategorias();
        this.props.navigation.goBack(); */
    }
    render() {
        const { total, costos }=this.state;
        const { title } = this.props.navigation.state.params;
        const offset = (Platform.OS === 'android') ? -200 : 0;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBackDelete 
                    title={title}
                    action={() => {
                            this.props.navigation.goBack();
                    }}
                    onDelete={() => this.setState({
                        showAlertConfirm: true
                    })}
                />
                <ScrollView 
                keyboardShouldPersistTaps="always" 
                style={styles.container}>
                        <View style={SharedStyles.categoriaContainer}>
                            <View style={styles.rowCategoriaContainer}>
                                <AvenirHeavy style={styles.text}>
                                    Concepto
                                </AvenirHeavy>
                                <AvenirHeavy style={styles.text}>
                                    Unidad
                                </AvenirHeavy>
                                <AvenirHeavy style={styles.text}>
                                    Precio Unit.
                                </AvenirHeavy>
                                <AvenirHeavy style={styles.text}>
                                    Cant.
                                </AvenirHeavy>
                                <AvenirHeavy style={styles.text}>
                                    Costo Total
                                </AvenirHeavy>
                            </View>
                            <FlatList
                                data={costos}
                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            />
                            <Divider style={{ backgroundColor: Colors.divisor, marginVertical: 10 }} />
                            <View style={styles.totalContainer}>
                                <AvenirHeavy style={{ fontSize: 12}}>
                                    Total: <NumberFormat
                                        value={parseFloat(total).toFixed(2)}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$ '}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </AvenirHeavy>
                            </View>
                        </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({
                                modalVisible: false
                            })
                        }}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(17, 17, 17, .1)'}}>
                            <KeyboardAvoidingView style={{ flex: 1 }}
                                keyboardShouldPersistTaps="always"  
                                behavior={Platform.OS === "ios" ? "padding" : null} enabled
                            >
                            <ScrollView 
                                    keyboardShouldPersistTaps="always" 
                                    style={{ flex: 1 }}>
                                <View style={{ marginHorizontal: 15, marginTop: 40, paddingHorizontal: 10, paddingVertical: 20, backgroundColor: Colors.white, borderRadius: 10 }}>
                                <TouchableOpacity
                                    style={{alignItems: 'flex-start'}} 
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Icon
                                        name='left'
                                        type='antdesign'
                                        size={26}
                                        color={Colors.primary}
                                />
                                </TouchableOpacity>
                                <AvenirHeavy style={{fontSize: 16, marginHorizontal: 5}}>Agregar Gasto</AvenirHeavy>
                                    <CustomInput
                                        style={styles.inputStyle}
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
                                            {this.state.clear == true ? null : <SearchableDropdown
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
                                                itemsContainerStyle={{ maxHeight: 120 }}
                                                items={this.state.dataUnidadades}
                                                placeholder="Escriba aquí..."
                                                underlineColorAndroid="transparent"
                                            />}
                                        </View>
                                    <CustomInput
                                        style={styles.inputStyle}
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
                                    <AvenirBook style={{ marginTop: 5 }}>
                                        <NumberFormat
                                            value={parseFloat(this.state.cantidad).toFixed(2)}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={''}
                                            renderText={value => <Text>{value}</Text>}
                                        />
                                    </AvenirBook>
                                    <CustomInput
                                        style={styles.inputStyle}
                                        error={this.state.errorPrecioUnidad}
                                        label='Precio Unitario'
                                        value={this.state.precioUnidad}
                                        returnKeyType={'done'}
                                        keyboardType='numeric'
                                        onChangeText={precioUnidad => {
                                            let expresion = /^\d*\.?\d*$/;
                                            if (expresion.test(precioUnidad)) {
                                                if(this.state.cantidad!=''){
                                                    this.setState({
                                                        precioUnidad, errorPrecioUnidad: false,
                                                        totalGasto: (precioUnidad * this.state.cantidad).toString()
                                                    }) 
                                                }else {
                                                    this.setState({
                                                        precioUnidad, errorPrecioUnidad: false
                                                    })
                                                }
                                            }
                                        }}
                                        underlineColor={Colors.divisor}
                                    />
                                    <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.precioUnidad), { code: 'USD' })}</AvenirBook>
                                    <CustomInput
                                        style={styles.inputStyle}
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
                                    <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.totalGasto), { code: 'USD' })}</AvenirBook>
                                    <View style={styles.inputContent}>
                                        <AvenirMedium style={styles.label}>
                                            Proveedor
                                        </AvenirMedium>
                                            { this.state.clear == true ? null : <SearchableDropdown
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
                                                items={this.state.dataProveedores}
                                                placeholder="Escriba aquí..."
                                                underlineColorAndroid="transparent"
                                            /> }
                                    </View>
                                    <CustomInput
                                        style={styles.inputStyle}
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
                                        style={{ marginTop: 40 }}
                                        title='Agregar Gasto'
                                        loading={this.state.isLoading}
                                        fontSize={14}
                                        onPress={() => {
                                            if(this.state.isLoading==false){
                                                this.setState({
                                                    isLoading: true,
                                                    clear: true
                                                });
                                                this.validaAddGasto();
                                            }}} />
                                            
                                
                            </View>
                            <View style={{height: 50}}/>
                            </ScrollView>
                        </KeyboardAvoidingView>
                        </View>
                    </Modal>
                    <View style={{height: 80}}></View>
                </ScrollView>
                <TouchableOpacity
                    style={styles.addContainer}
                    onPress={() => {
                        this.setModalVisible(true);
                    }}>
                    <Icon
                        name='plus'
                        type='antdesign'
                        size={24}
                        color={Colors.white}
                    />
                </TouchableOpacity>
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertConfirm}
                    title={'Eliminar'}
                    message={'Al eliminar esta categoría,se perderan todos los registros de gastos asociados a la misma, ¿Desea eliminarlo?'}
                    closeOnTouchOutside={true}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Si '
                    cancelText='No'
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
                        this.setState({
                            showAlertConfirm: false
                        });
                    }}
                />
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertEdit}
                    title={'Modificar Desglose'}
                    message={'Seleccione la acción a realizar'}
                    closeOnTouchOutside={true}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Eliminar'
                    cancelText='Editar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                        this.props.navigation.navigate('EditarDesgloseGasto', { 
                            dataUnidadades: this.state.dataUnidadades,
                            editable: this.state.editable,
                            actualizaCosto: this.actualizaCosto.bind(this),
                            refreshCategorias: () => this.props.navigation.state.params.refreshCategorias()
                            });
                    }}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                        this.onDeleteDesglose();
                    }}
                    onDismiss={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                    }}
                />
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
        marginTop: 5 
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