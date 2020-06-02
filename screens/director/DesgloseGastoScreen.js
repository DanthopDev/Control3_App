import React, { Component } from 'react';
import { View, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import { Header, Divider } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import NumberFormat from 'react-number-format';
import { HeaderGrayBackDelete } from '../../components/Headers';
import URLBase from '../../constants/URLBase';

export default class DesgloseGastoScreen extends Component {
    constructor(props) {
        super(props);
        //console.log('************************* Costos ***************************');
        const { costos } = this.props.navigation.state.params;
        //console.log(this.props.navigation.state.params.costos);
        let total = 0;
        let nuevosCostos=[]
        if (costos && costos.lenght !== 0) {
            costos.forEach((element) => {
                total = total + parseFloat(element.total.replace("$", "", "gi"));
            });
            nuevosCostos = costos.sort((a, b) => a.create_at < b.create_at);
            this.state = {
                costos: nuevosCostos,
                total,
                nombres_obreros: [],
                showAlertEdit: false,
                showAlertConfirm: false
            }
        } else {
            this.state = {
                costos: [],
                nombres_obreros: [],
                total,
                showAlertEdit: false,
                showAlertConfirm: false
            }
        } 
    }

    _keyExtractor = (item, index) => item.id.toString();

    in_array(nuevo, arreglo) {
        for(var i = 0; i < arreglo.length; i++) {
            if(arreglo[i].nombre == nuevo.nombre) 
                return true;
        }
        return false;
    }

    _renderItem(item, title) {
        return(
            <TouchableOpacity
            onPress={() => {
                console.log(item);
                this.setState({
                editable: item,
                showAlertEdit: true
            });
            }} 
            style={styles.rowCategoriaContainer}>
                <AvenirMedium style={styles.textGray}>
                    {item.item.nombre}
                </AvenirMedium>
                <AvenirMedium style={styles.textGray}>
                    {item.item.unidad}
                </AvenirMedium>
                { title != 'Mano de obra'
                    ?   <AvenirMedium style={[styles.textGray,{width: '16%'}]}>
                        { item.item.cantidad == "null" ? '--' : 
                            <NumberFormat
                                value={item.item.cantidad}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={''}
                                renderText={value => <Text>{value}</Text>}
                            />
                        }
                        </AvenirMedium>
                    :   <AvenirMedium style={[styles.textGray,{width: '16%'}]}>
                        { item.item.asistencias == null ? '--' : 
                            <NumberFormat
                                value={item.item.asistencias}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={''}
                                renderText={value => <Text>{value}</Text>}
                            />
                        }
                        </AvenirMedium>
                }
                <AvenirMedium style={styles.textGray}>
                    {
                        item.item.pu == "null" ? '--' : <NumberFormat
                            value={parseFloat(item.item.pu).toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                            renderText={value => <Text>{value}</Text>}
                        />
                    }
                </AvenirMedium>
                { title != 'Mano de obra'
                    ?   <AvenirMedium style={[styles.textGray,{width: '24%'}]}>
                            <NumberFormat
                                value={parseFloat(item.item.total.replace("$", "", "gi")).toFixed(2)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </AvenirMedium>
                    :   <AvenirMedium style={[styles.textGray,{width: '24%'}]}>
                            <NumberFormat
                                value={parseFloat(item.item.pu.replace("$", "", "gi") * item.item.asistencias).toFixed(2)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </AvenirMedium>
                }
            </TouchableOpacity>
        );
    }

    actualizaCosto(gasto) {
        let index = this.state.costos.findIndex(element => element.id == gasto.id);
        let updateCostos = this.state.costos;
        let total = 0;
        updateCostos[index] = gasto;
        updateCostos.forEach((element) => {
            total = total + parseFloat(element.total.replace("$", "", "gi"));
        });
        this.setState({
            costos: updateCostos,
            total
        });
    }

    onDeleteDesglose() {
        const { editable } = this.state;
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        formData.append('id', editable.id);
        fetch(URLBase + '/dir/eliminarGasto', {
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
                    Alert.alert('No se han podido eliminar el gasto', responseJson.message);
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
    
    onDelete = () => {
        const { params } = this.props.navigation.state;
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        formData.append('id', params.idCategoria);
        fetch(URLBase + '/dir/deleteCategoriaGastos', {
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
        const { title, idProyecto }= this.props.navigation.state.params;
        const { costos, total } = this.state;

        if(title == 'Mano de obra'){
            datos = this.state.nombres_obreros;

            costos.forEach(element => {
                if(!this.in_array(element, this.state.nombres_obreros))
                    this.state.nombres_obreros.push({id: element.id, nombre: element.nombre, unidad: element.unidad, categoria: element.categoria, cantidad: element.cantidad, pu: element.pu, total: element.total, asistencias: 0});
            });

            this.state.nombres_obreros.forEach(obrero => {
                var asistencias = 0;
                costos.forEach(gasto => {
                    if(obrero.nombre == gasto.nombre)
                        asistencias++;
                });
                obrero.asistencias = asistencias;
            });
        } else 
            datos = costos;
        
        console.log(datos);

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
                <ScrollView style={styles.container}>
                        <View style={[SharedStyles.categoriaContainer, {margin: 20}]}>            
                            <View style={styles.rowCategoriaContainer}>
                                <AvenirHeavy style={styles.text}>
                                    Concepto
                                </AvenirHeavy>
                                <AvenirHeavy style={styles.text}>
                                    Unidad
                                </AvenirHeavy>
                                { title != 'Mano de obra'
                                    ?   <AvenirHeavy style={[styles.text, { width: '18%'}]}>
                                            Cant.
                                        </AvenirHeavy>
                                    :   <AvenirHeavy style={[styles.text, { width: '18%'}]}>
                                            Asist.
                                        </AvenirHeavy>
                                }
                                <AvenirHeavy style={styles.text}>
                                Precio Unit.
                                </AvenirHeavy>
                                <AvenirHeavy style={styles.text}>
                                    Importe
                                </AvenirHeavy>
                            </View>
                            <FlatList
                                data={datos}
                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                keyExtractor={this._keyExtractor}
                                renderItem={(item) => this._renderItem(item, title)}
                            />
                            <Divider style={{ backgroundColor: Colors.divisor, marginVertical: 10 }} />
                            <View style={styles.totalContainer}>
                                <AvenirHeavy style={{fontSize: 13}}>
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
                        <View style={{height: 40}}/>
                    </ScrollView>
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
                        title={'Modificar Gasto'}
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
                            this.props.navigation.navigate('EditarGasto', {
                                idProyecto: idProyecto,
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

const styles= StyleSheet.create({
    container: {
        flex: 1,
    }, 
    text: {
        fontSize: 13,
        width: '20%',
        textAlign: 'center'
    },
    textGray: {
        fontSize: 13,
        color: Colors.subtitle,
        width: '20%',
        textAlign: 'center'
    },
    totalContainer: {
        alignItems: 'flex-end'
    },
    rowCategoriaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
});