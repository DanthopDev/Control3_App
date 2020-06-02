import React, { Component } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import AwesomeAlert from 'react-native-awesome-alerts';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
var currencyFormatter = require('currency-formatter');
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class AgregarGastoScreen extends Component {
    constructor(props) {
        super(props);
        let categorias= props.navigation.state.params.categorias;
        let newCategorias=[];
        categorias.forEach(element => {
            newCategorias.push({
                id: element.id,
                name: element.nombre
            });
        });
        this.state={
            nombreGasto: '',
            errorNombreGasto: false,
            total: '',
            categorias: newCategorias,
            errorTotal: false,
            loading: false,
            resetValue: false
        }
    }

    refreshCategorias = async () => {
        var formData = new FormData();
        const { params } = this.props.navigation.state;
        const { accessInfo } = this.props.screenProps;
        const { nombreGasto, total } = this.state;
        let formTotal= parseFloat(total).toFixed(2);

        formData.append('id', params.idProyecto);
        formData.append('nombre', nombreGasto);
        formData.append('total', formTotal);
        
        fetch(URLBase + '/dir/createCategoria', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Agreagra Gasto Categoria *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                   
                   // this.props.navigation.state.params.refreshCategorias();
                    let categorias=this.state.categorias;
                    console.log('Index: ');
                    let index = categorias.findIndex(element => element.id == responseJson.categoria);
                    console.log(index);
                    if(index==-1){
                        categorias.push({id: responseJson.categoria, name: this.state.nombreGasto});
                    }
                    this.setState({
                        showAlert: true,
                        errorTotal: false,
                        categorias: categorias,
                        loading: false,
                        title: 'Gasto agregado',
                        message: 'La nueva categoría ha sido agregada de manera exitosa.',
                        resetValue: true,
                    });
                    this.props.navigation.state.params.refreshCategorias();
                } else {
                    Alert.alert('Error', 'No se han podido actualizar la categoria');
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
    render() {
        return (
            <View style={SharedStyles.container}>
                <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Planear Gasto'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                    <View style={styles.container}>
                        <View style={styles.formContainer}>
                            <AvenirMedium style={SharedStyles.textLabel}>
                                Categoría
                            </AvenirMedium>
                            {this.state.resetValue == true ? null : <SearchableDropdown
                                onTextChange={text => this.setState({
                                    nombreGasto: text,
                                    errorNombreGasto: false
                                })}
                                onItemSelect={item => this.setState({
                                    nombreGasto: item.name,
                                    errorNombreGasto: false
                                })}
                                containerStyle={{ width: '100%' }}
                                textInputStyle={SharedStyles.autoInputStyle}
                                itemStyle={SharedStyles.autoItemStyle}
                                itemTextStyle={SharedStyles.autoItemTextStyle}
                                itemsContainerStyle={{ maxHeight: 140 }}
                                items={this.state.categorias}
                                placeholder="Escriba aquí..."
                                value={this.state.nombreGasto}
                                underlineColorAndroid="transparent"
                            /> }
                           
                            {
                                this.state.errorNombreGasto == true ? <AvenirBook style={styles.errorStyle}>Rellene este campo</AvenirBook> : null
                            }
                            <CustomInput
                                style={{ borderRadius: 0, backgroundColor: Colors.white, marginTop: 20, marginBottom: 20 }}
                                error={this.state.errorTotal}
                                label='Total'
                                keyboardType={'numeric'}
                                value={this.state.total}
                                returnKeyType={'done'}
                                onChangeText={total => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(total)) {
                                        this.setState({
                                            total
                                        })
                                    }
                                }}
                                underlineColor={Colors.divisor}
                            />
                            <AvenirBook>{currencyFormatter.format(parseFloat(this.state.total), { code: 'USD' })}</AvenirBook>
                            {
                                this.state.errorTotal == true ? <AvenirBook style={styles.errorStyle}>Ingrese el total</AvenirBook> : null
                            }
                        </View>
                        <CustomButton
                            style={{ marginTop: 40 }}
                            title='Agregar Gasto'
                            fontSize={14}
                            loading={this.state.loading}
                            onPress={() => {
                                if(this.state.loading==false) {
                                    if (this.state.nombreGasto == '') {
                                        this.setState({
                                            errorNombreGasto: true
                                        });
                                    } else if (this.state.total == '') {
                                        this.setState({
                                            errorNombreGasto: false,
                                            errorTotal: true
                                        });
                                    } else {
                                        this.setState({
                                            loading: true
                                        });
                                        this.refreshCategorias();
                                    } 
                                }
                            }} />
                    </View>
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
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onDismiss={() => {
                        this.setState({
                            nombreGasto: '',
                            total: '',
                            resetValue: false
                        })
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
    errorStyle: {
        color: 'red', 
        marginTop: 10,
        fontSize: 12 
    },
    formContainer: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 20,
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