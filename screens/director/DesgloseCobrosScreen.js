import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AvenirHeavy, AvenirMedium  } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBackAdd } from '../../components/Headers';
import moment from "moment";
var currencyFormatter = require('currency-formatter');

export default class DesgloseCobrosScreen extends Component {
    constructor(props) {
        super(props);
        console.log('***************************************** COBROS *******************************');
        console.log(this.props.navigation.state.params.cobros);
        const { cobros, costoContrato } = props.navigation.state.params;
        let montoTotalPagado=0
        cobros.forEach((element) => {
            montoTotalPagado= montoTotalPagado + parseFloat(element.cobro);
        });
        let porcentaje=0;
        if (costoContrato>0){
            porcentaje = ((montoTotalPagado * 100) / parseFloat(costoContrato));
        }
        this.state={
            cobros,
            montoTotalPagado,
            porcentaje,
            showAlertEdit: false
        }
    }
    componentWillUnmount() {
        this.props.navigation.state.params.getProyectoInfo();
    }
    updateCobro(cobro){
        const { costoContrato } = this.props.navigation.state.params;
        let auxCobros = this.state.cobros;
        let index=auxCobros.findIndex(element => element.id==cobro.id);
        let montoTotalPagado = 0;
        auxCobros[index]=cobro;
        auxCobros.forEach((element) => {
            montoTotalPagado = montoTotalPagado + parseFloat(element.cobro);
        });
        let porcentaje = 0
        if (costoContrato > 0) {
            porcentaje = ((montoTotalPagado * 100) / parseFloat(costoContrato));
        };
        this.setState({
            cobros: auxCobros,
            montoTotalPagado,
            porcentaje
        });
    }
    pushCobro(cobro) {
        const { costoContrato } = this.props.navigation.state.params;
        let auxCobros= this.state.cobros;
        auxCobros.push(cobro);
        let montoTotalPagado=0;
        auxCobros.forEach((element) => {
            montoTotalPagado = montoTotalPagado + parseFloat(element.cobro);
        });
        let porcentaje = 0;
        if (costoContrato > 0) {
            porcentaje = ((montoTotalPagado * 100) / parseFloat(costoContrato));
        }
        this.setState({
            cobros: auxCobros,
            montoTotalPagado,
            porcentaje
        });
    }
    deleteCobro(){
        const { accessInfo } = this.props.screenProps;
        const { editable } = this.state;
        var formData = new FormData();
        console.log('Editable: ', editable);
        formData.append('id', editable.id);
        fetch(URLBase + '/dir/deleteCobro', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Delete Cobro****************************************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    const { costoContrato } = this.props.navigation.state.params;
                    let auxCobros = this.state.cobros.filter(element => element.id != editable.id);
                    let montoTotalPagado = 0;
                    auxCobros.forEach((element) => {
                        montoTotalPagado = montoTotalPagado + parseFloat(element.cobro);
                    });
                    let porcentaje = 0
                    if (costoContrato > 0) {
                        porcentaje = ((montoTotalPagado * 100) / parseFloat(costoContrato));
                    };
                    this.setState({
                        cobros: auxCobros,
                        montoTotalPagado,
                        porcentaje
                    });
                } else {
                    Alert.alert('No ha sido posible eliminar el cobro', responseJson.message);
                }
            })
            .catch((error) => {
                // Alert.alert('Error', JSON.parse(error));
                console.error(error);
            });
    }
    _keyExtractor = (item, index) => item.id.toString();
    _renderItem= ({item}) => (
        <TouchableOpacity onPress={() => this.setState({ editable: item, showAlertEdit: true })}>
            <Text>
                <AvenirHeavy style={styles.text}>
                    Fecha:
                </AvenirHeavy>
                <Text> </Text>
                <AvenirMedium style={SharedStyles.textGray}>
                    {moment(item.fechaCobro).format("DD-MMM-YYYY")}
                </AvenirMedium>
            </Text>
            <Text>
                <AvenirHeavy style={styles.text}>
                    Recibio:
                </AvenirHeavy>
                <Text> </Text>
                <AvenirMedium style={SharedStyles.textGray}>
                    {item.recibe}
                </AvenirMedium>
            </Text>
            <Text>
                <AvenirHeavy style={styles.text}>
                    Método de Pago:
                </AvenirHeavy>
                <Text> </Text>
                <AvenirMedium style={SharedStyles.textGray}>
                    {item.tipoPago}
                </AvenirMedium>
            </Text>
            <Text>
                <AvenirHeavy style={styles.text}>
                    Notas:
                </AvenirHeavy>
                <Text> </Text>
                <AvenirMedium style={SharedStyles.textGray}>
                    {item.notas}
                </AvenirMedium>
            </Text>
            <Text style={{alignSelf: 'flex-end'}}>
                <AvenirHeavy style={styles.text}>
                    Monto: 
                </AvenirHeavy>
                <Text> </Text>
                <AvenirMedium style={SharedStyles.textGray}>
                    {currencyFormatter.format(parseFloat(item.cobro), { code: 'USD' })}
                </AvenirMedium>
            </Text>
        </TouchableOpacity>
    );

    render() {
        const { costoContrato, idProyecto }=this.props.navigation.state.params;
        return (
            <View style={SharedStyles.container}>
                <View style={SharedStyles.container}>
                    <HeaderGrayBackAdd
                        title='Cobros'
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                        onAdd={() => this.props.navigation.navigate('AgregarCobro',{ 
                            idProyecto: idProyecto,
                            pushCobro: this.pushCobro.bind(this) })}
                    />
                    <View style={styles.container}>
                        <View style={{marginHorizontal: 20, marginTop: 20}}>
                            <View style={styles.diferenciaContainer}>
                                <AvenirHeavy style={styles.text}>
                                    Monto de Contrato
                                </AvenirHeavy>
                                <AvenirHeavy style={SharedStyles.textPrecio}>
                                    {currencyFormatter.format(parseFloat(costoContrato), { code: 'USD' })}
                                </AvenirHeavy>
                            </View>
                        </View>
                        <View style={styles.gastos}>
                            <View style={styles.gastoTotalContainer}>
                                <AvenirHeavy style={{ color: Colors.white, fontSize: 12 }}>
                                    Monto Total Pagado
                                </AvenirHeavy>
                                <AvenirHeavy style={{ color: Colors.white, fontSize: 16 }}>
                                    {currencyFormatter.format(parseFloat(this.state.montoTotalPagado), { code: 'USD' })}
                                </AvenirHeavy>
                            </View>
                            <View style={styles.presupuestoContainer}>
                                <AvenirHeavy style={styles.text}>
                                    Porcentaje
                                </AvenirHeavy>
                                <AvenirHeavy style={SharedStyles.textPrecio}>
                                    {this.state.porcentaje.toFixed(2)} %
                                </AvenirHeavy>
                            </View>
                        </View> 
                        <View style={{flex: 1, marginBottom: 20}}>
                            <View style={[SharedStyles.categoriaContainer, {marginHorizontal: 20}]}>
                            
                                <View style={{ height: 5 }} />
                                <FlatList
                                    data={this.state.cobros}
                                    ItemSeparatorComponent={() => <View style={{ marginVertical: 5, borderBottomColor: Colors.divisor, borderBottomWidth: 1 }} />}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={this._renderItem}
                                />
                            </View>
                        </View> 
                    </View>
                </View>
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertEdit}
                    title={'Modificar Cobro'}
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
                        this.props.navigation.navigate('AgregarCobro', {
                            editable:this.state.editable,
                            updateCobro: this.updateCobro.bind(this)
                        });
                    }}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlertEdit: false
                        });
                        this.deleteCobro();
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
    },
    gastos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 20
    },
    text: {
        fontSize: 12,
    },
    diferenciaContainer: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
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
    presupuestoContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 5,
        width: '38%',
        padding: 10,
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
    gastoTotalContainer: {
        backgroundColor: Colors.title,
        borderRadius: 5,
        width: '60%',
        padding: 10,
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
    divisorStyle: {
        backgroundColor: Colors.divisor
    },
});