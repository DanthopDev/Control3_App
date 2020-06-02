import React, { Component } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, Text, Keyboard} from 'react-native';
import { AvenirBook, AvenirMedium} from '../../components/StyledText';
import { HeaderGrayBack } from '../../components/Headers';
import AwesomeAlert from 'react-native-awesome-alerts';
import NumberFormat from 'react-number-format';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Colors from '../../constants/Colors';
import URLBase from '../../constants/URLBase';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

var currencyFormatter = require('currency-formatter');

export default class AddDestajoScreen extends Component {
    constructor(props) {
        super(props);

        let categorias = [];
        let { editable, costo_editable, costos_dest, costos_otros, categoria, unidades, proveedores_dest, proveedores_otros, _categorias } = this.props.navigation.state.params;

        console.log(categoria);
        if(categoria == "Destajos"){
            costos = costos_dest;
            proveedores = proveedores_dest;
        } else{
            costos = costos_otros;
            proveedores = proveedores_otros;
        }

        _categorias.forEach((element) => {
            if(element.value != "Mano de obra")
                categorias.push({ id: element.id, name: element.value, value: element.value });           
        });

        if(editable){
            console.log("EDITABLE: ", editable );

            categorias.forEach(element => {
                if(element.id == editable.categorias_id)
                    categoria = element.value;
            });

            costo_index = costos.findIndex(element => element.id == editable.costos_id);   
            unidad_index = unidades.findIndex(element => element.name == costo_editable.unidad);
            proveedor_index = proveedores.findIndex(element => element.name == editable.provedor);     
            categoria_index = categorias.findIndex(element => element.id == editable.categorias_id);   

            if(costo_index == -1)
                costo_index = '';
            if(unidad_index == -1)
                unidad_index = '';
            if(proveedor_index == -1)
                proveedor_index = '';
            if(categoria_index == -1)
                categoria_index = '';

            this.state = {
                loading: false,
                editable,
                costo_editable,
                categoria,
                costos,
                unidades,
                proveedores,
                categorias,
                costos_dest,
                costos_otros,
                proveedores_dest,
                proveedores_otros,
                costo_index,
                unidad_index,
                categoria_index,
                proveedor_index,
                nombre: costo_editable.nombre,
                unidad: costo_editable.unidad,
                notas: editable.notas,
                pu: costo_editable.pu,
                cantidad: editable.cantidad,
                importe: editable.total,
                proveedor: editable.provedor,
            };
        } else {
            categoria_index = categorias.findIndex(element => element.name == categoria);   

            this.state = {
                costo_index: '',
                unidad_index: '',
                proveedor_index: '',
                loading: false,
                categoria,
                costos,
                unidades,
                proveedores,
                categorias,
                costos_dest,
                costos_otros,
                proveedores_dest,
                proveedores_otros,
                categoria_index,
            };
        } 
    } 

    cargaDatos(){
        let costos_dest, costos_otros;
        let proveedores_dest, proveedores_otros;

        costos_dest = this.state.costos_dest;
        costos_otros = this.state.costos_otros;
        proveedores_dest = this.state.proveedores_dest;
        proveedores_otros = this.state.proveedores_otros;

        if(this.state.categoria == "Destajos"){
            this.setState({
                costos: costos_dest,
                proveedores: proveedores_dest
            })
        } else{
            this.setState({
                costos: costos_otros,
                proveedores: proveedores_otros
            })
        }
    }

    addDestajo = async () => {
        var formData = new FormData();
        const { accessInfo, idProyecto } = this.props.navigation.state.params;
        const { nombre, unidad, pu, cantidad, notas, importe, proveedor, categoria, costo_id, categoria_id} = this.state;
                
        formData.append('id', idProyecto);
        formData.append('costo_id', costo_id);
        formData.append('categoria_id', categoria_id);
        formData.append('categoria', categoria);
        formData.append('nombre', nombre);
        formData.append('unidad', unidad);
        formData.append('proveedor', proveedor);
        formData.append('notas', notas);
        formData.append('cantidad', cantidad);
        formData.append('pu', parseFloat(pu).toFixed(2));
        formData.append('total', parseFloat(importe).toFixed(2));

        fetch(URLBase + '/res/createDestajos', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Agreagar Destajista *********************');
                console.log(responseJson);
                
                categoria_sel = responseJson.categoria;

                if (responseJson.success && responseJson.success == '200') {
                    if(categoria_sel == "Destajos"){
                        this.setState({
                            title: 'Destajo agregado',
                            message: 'El nuevo destajo ha sido agregado correctamente',
                        });
                    } else {
                        this.setState({
                            title: 'Otro gasto agregado',
                            message: 'El nuevo gasto ha sido agregado correctamente',
                        });
                    }

                    this.setState({
                        categoria_index: '',
                        costo_index: '',
                        proveedor_index: '',
                        unidad_index: '',
                        showAlert: true,
                        loading: false,
                    })
                } else {
                    Alert.alert('Error', 'No se han podido crear el nuevo Destajo');
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }
    
    editDestajo = async () => {
        var formData = new FormData();
        const { accessInfo, idProyecto, editable } = this.props.navigation.state.params;
        const { nombre, unidad, proveedor, pu, cantidad, notas, importe, categoria, categoria_id } = this.state;

        formData.append('id_proyecto', idProyecto);
        formData.append('id_costo', editable.costos_id);
        formData.append('id_gasto', editable.id);
        formData.append('categoria_id', categoria_id);
        formData.append('categoria', categoria);
        formData.append('nombre', nombre);
        formData.append('unidad', unidad);
        formData.append('proveedor', proveedor);
        formData.append('notas', notas);
        formData.append('cantidad', cantidad);
        formData.append('pu', parseFloat(pu).toFixed(2));
        formData.append('total', parseFloat(importe).toFixed(2));

        fetch(URLBase + '/res/editarDestajos', {
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

                categoria_sel = responseJson.categoria;

                if (responseJson.success && responseJson.success == '200') {
                    if(categoria_sel == "Destajos"){
                        this.setState({
                            title: 'Destajo modificado',
                            message: 'El destajo ha sido actualizado correctamente',
                        });
                    } else {
                        this.setState({
                            title: 'Otro gasto modificado',
                            message: 'El gasto ha sido actualizado correctamente',
                        });
                    }

                    this.setState({
                        showAlert: true,
                        loading: false
                    })
                } else {
                    Alert.alert('No se han podido actualizar el destajo', responseJson.message);
                    this.setState({ loading: false });
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    validaForm(){
        const { nombre, pu, cantidad, importe } = this.state;
        
        this.setState({ loading: true });

        if (nombre == ''){
            this.setState({
                error_nombre: true,
                loading: false
            });
        } else if (cantidad=='') {
            this.setState({
                error_cantidad: true,
                loading: false
            });
        } else if (pu == '') {
            this.setState({
                error_pu: true,
                loading: false
            });
        } else if (importe == '') {
            this.setState({
                error_importe: true,
                loading: false
            });
        } else {
            if(this.props.navigation.state.params.editable)
                this.editDestajo();
            else
                this.addDestajo();
        }
    }

    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        let { editable } = this.props.navigation.state.params;
        return (
            <KeyboardAvoidingView  
                style={styles.fatherContainer} 
                behavior={Platform.OS === "ios" ? "padding" : null} 
                enabled
            >
                <View style={SharedStyles.container}>
                    <HeaderGrayBack
                        title = { editable ? 'Editar Destajo / Otro gasto' : 'Agregar Destajo / Otro gasto' }
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView
                        keyboardShouldPersistTaps="always" 
                        style={styles.container}>

                        <View style={styles.inputContent}>
                            <AvenirMedium style={{ color: Colors.title, fontSize: 12, marginTop: 10, marginLeft: 10 }}>
                                Categoría
                            </AvenirMedium>
                            <SearchableDropdown
                                placeholder="Escriba aquí..."
                                underlineColorAndroid="transparent"
                                containerStyle={{ width: '100%' }}
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 120 }}
                                items={this.state.categorias}
                                defaultIndex={this.state.categoria_index.toString()}
                                onTextChange={(value ) => {
                                    if(value == "Destajos" || value == "Otros gastos"){
                                        if(value == "Destajos"){
                                            this.setState({
                                                categoria: value,
                                            });
                                        } else {
                                            this.setState({
                                                categoria: value,
                                            });
                                        }
                                    } else {
                                        this.setState({
                                            categoria: 'Destajos',
                                        })
                                    }
                                    this.cargaDatos();
                                }}
                                onItemSelect={item => {
                                    if(item.name == "Destajos" || item.name == "Otros gastos"){
                                        if(item.name == "Destajos"){
                                            this.setState({
                                                categoria: item.name,
                                                errorCategoria: false,
                                            });
                                        } else {
                                            this.setState({
                                                categoria: item.name,
                                                errorCategoria: false,
                                            });
                                        }
                                    } else {
                                        this.setState({
                                            categoria: 'Destajos',
                                            errorCategoria: false,
                                        })
                                    }
                                    this.cargaDatos();
                                }}
                            />
                        </View>
                        <View style={styles.inputContent}>
                            <AvenirMedium style={styles.label}>
                                Concepto
                            </AvenirMedium>
                                   <SearchableDropdown
                                        containerStyle={{ width: '100%' }}
                                        textInputStyle={SharedStyles.autoInputStyle}
                                        itemStyle={SharedStyles.autoItemStyle}
                                        itemTextStyle={SharedStyles.autoItemTextStyle}
                                        itemsContainerStyle={{ maxHeight: 120 }}
                                        items={this.state.costos}
                                        placeholder="Escriba aquí..."
                                        underlineColorAndroid="transparent"
                                        defaultIndex={this.state.costo_index.toString()}
                                        onTextChange={text => this.setState({ 
                                            nombre: text,
                                            isSelectedUnidad: false,
                                            isSelectedProveedor: false
                                        })}
                                        onItemSelect={item => {
                                            costo = this.state.costos.filter(element => element.id == item.id)[0];
                                            
                                            if(item.proveedor != null){
                                                proveedor_index = this.state.proveedores.findIndex(element => element.name == item.proveedor);   
                                                
                                                this.setState({
                                                    importe: '',
                                                    errorCosto: false,
                                                    isSelectedUnidad: false,
                                                    isSelectedProveedor: false,
                                                    proveedor_index,
                                                    costo_id: costo.id,
                                                    nombre: costo.value,
                                                    unidad: costo.unidad,
                                                    pu: costo.pu,
                                                    notas: costo.notas,
                                                    categoria_id: costo.categoria_id,
                                                    proveedor: this.state.proveedores[proveedor_index].name,
                                                });  
                                            }
                                            else{                                                
                                                this.setState({
                                                    importe: '',
                                                    proveedor_index: '',
                                                    errorCosto: false,
                                                    isSelectedUnidad: false,
                                                    isSelectedProveedor: false,
                                                    costo_id: costo.id,
                                                    nombre: costo.value,
                                                    unidad: costo.unidad,
                                                    pu: costo.pu,
                                                    notas: costo.notas,
                                                    categoria_id: costo.categoria_id,
                                                });  
                                            }
                                        }}
                                    />
                        </View>
                        { this.state.error_nombre == true ? <AvenirBook style={styles.error}>Ingrese un Concepto</AvenirBook> : null }
                        { this.state.isSelectedUnidad == false 
                                ?   <View style={{ marginHorizontal: 20, marginTop: 20 }}
                                        onTouchStart={() => this.setState({
                                            isSelectedUnidad: true
                                        })}>
                                        <CustomInput
                                            label='Unidad'
                                            underlineColor='transparent'
                                            error={this.state.errorUnidad}
                                            selectionColor={Colors.primary}
                                            value={this.state.unidad}
                                            returnKeyType={'done'}
                                            onChangeText={(unidad) => {
                                                this.setState({
                                                    unidad
                                                });
                                            }}
                                        />
                                    </View> 
                                :    <View style={styles.inputContent}>
                                        <AvenirMedium style={styles.label}>
                                            Unidad
                                        </AvenirMedium>                   
                                        <SearchableDropdown
                                            onTextChange={text => this.setState({ unidad: text })}
                                            onItemSelect={item => {
                                                this.setState({ unidad: item.name });
                                            }}
                                            containerStyle={{ width: '100%' }}
                                            textInputStyle={SharedStyles.autoInputStyle}
                                            itemStyle={SharedStyles.autoItemStyle}
                                            itemTextStyle={SharedStyles.autoItemTextStyle}
                                            itemsContainerStyle={{ maxHeight: 140 }}
                                            items={this.state.unidades}
                                            defaultIndex={this.state.unidad_index.toString()}
                                            placeholder="Escriba aquí..."
                                            underlineColorAndroid="transparent"
                                        />
                                     </View>
                        }
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.error_cantidad}
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
                                                cantidad, error_cantidad: false,
                                                importe: (cantidad * this.state.pu).toString()
                                            })
                                        } else {
                                            this.setState({
                                                cantidad,
                                                error_cantidad: false
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
                        </View>  
                        { this.state.error_cantidad == true ? <AvenirBook style={styles.error}>Ingrese la Cantidad</AvenirBook> : null } 
                        <View style={styles.marginContent}>
                            <CustomInput
                                label='Precio Unitario'
                                underlineColor='transparent'
                                keyboardType={'numeric'}
                                returnKeyType={'done'}
                                selectionColor={Colors.primary}
                                value={this.state.pu}
                                error={this.state.error_pu}
                                onChangeText={(pu) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(pu)) {
                                        if (this.state.cantidad != '') {
                                            this.setState({
                                                pu,
                                                error_pu: false,
                                                importe: (pu * this.state.cantidad).toString()
                                            });
                                        } else {
                                            this.setState({
                                                pu,
                                                error_pu: false
                                            });
                                        }
                                    }
                                }}
                            />
                            <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.pu), { code: 'USD' })}</AvenirBook>
                        </View>
                        { this.state.error_pu == true ? <AvenirBook style={styles.error}>Ingrese el Precio por Unidad</AvenirBook> : null }
                        <View style={styles.marginContent}>
                            <CustomInput
                                error={this.state.error_importe}
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
                                            error_importe: false
                                        })
                                    }
                                }}
                                underlineColor='transparent'
                            />
                            <AvenirBook style={{ marginTop: 5 }}>{currencyFormatter.format(parseFloat(this.state.importe), { code: 'USD' })}</AvenirBook>
                            { this.state.error_importe == true ? <AvenirBook style={styles.error}>Ingrese el importe</AvenirBook> : null }
                        </View>
                        { this.state.isSelectedProveedor == false 
                                ?   <View style={{ marginHorizontal: 20, marginTop: 20 }}
                                        onTouchStart={() => this.setState({
                                            isSelectedProveedor: true
                                        })}> 
                                        <CustomInput
                                            error={this.state.error_proveedor}
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
                                        {}
                                        <SearchableDropdown
                                            onTextChange={text => this.setState({ proveedor: text})}
                                            onItemSelect={item => { this.setState({ proveedor: item.name }) }}
                                            containerStyle={{ width: '100%' }}
                                            textInputStyle={SharedStyles.autoInputStyle}
                                            itemStyle={SharedStyles.autoItemStyle}
                                            itemTextStyle={SharedStyles.autoItemTextStyle}
                                            itemsContainerStyle={{ maxHeight: 120 }}
                                            items={this.state.proveedores}
                                            defaultIndex={this.state.proveedor_index.toString()}
                                            placeholder="Escriba aquí..."
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                        }
                        <View style={styles.marginContent}>
                            <CustomInput
                                label='Notas'
                                selectionColor={Colors.primary}
                                value={this.state.notas}
                                returnKeyType={'done'}
                                multiline={true}
                                onChangeText={notas => this.setState({ notas })}
                                underlineColor='transparent'
                            />
                        </View>
                        { editable 
                            ?   <CustomButton
                                    style={{ marginVertical: 20, marginHorizontal: 20 }}
                                    title='Actualizar'
                                    loading={this.state.loading}
                                    fontSize={14}
                                    onPress={() => {
                                        if(this.state.loading == false)
                                            this.validaForm();                                  
                                    }} 
                                    /> 
                            :   <CustomButton
                                    style={{ marginVertical: 20, marginHorizontal: 20 }}
                                    title='Agregar'
                                    loading={this.state.loading}
                                    fontSize={14}
                                    onPress={() => {
                                        if(this.state.loading == false)
                                            this.validaForm();
                                    }} 
                                />
                        }  
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
                        if(editable){
                            this.props.navigation.goBack();
                            this.props.navigation.state.params.getGastos();
                        } else {
                            this.setState({
                                nombre: '',
                                unidad: '',
                                cantidad: '',
                                pu: '',
                                notas: '',
                                importe: '',
                                showAlert: false,
                                isSelectedUnidad: false,
                                isSelectedProveedor: false,
                            });
                            this.props.navigation.state.params.getGastos();
                        }
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
        marginTop: 10,
        marginHorizontal: 20
    },
});