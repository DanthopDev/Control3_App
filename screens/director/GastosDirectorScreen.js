import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Text, ScrollView, Platform, Alert} from 'react-native';
import { Header, Divider} from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import NumberFormat from 'react-number-format';
import { HeaderGrayBack } from '../../components/Headers';
import URLBase from '../../constants/URLBase';

export default class GastosDirectorScreen extends Component {
    constructor(props) {
        super(props);
            this.state = {
                categorias: [],
                total: 0,
                gastos: [],
                totalGastos: 0,
                isLoading: true
            }
    }
    
    componentDidMount() {
        this.refreshCategorias();
    }

    componentWillUnmount() {
        this.props.navigation.state.params.getProyectoInfo();
    }
    
    renderRealvsPlaneado(gastos){
        let total = 0;
        if ( gastos.lenght !== 0) {
            gastos.forEach((element) => {
                total = total + parseFloat(element.total.replace("$", "", "gi"));
            })
        }
        return(
            <NumberFormat
                value={parseFloat(total).toFixed(2)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
                renderText={value => <Text>{value}</Text>}
            />
        )
    }

    refreshCategorias = async () => {
        var formData = new FormData();
        const { params } = this.props.navigation.state;
        const { accessInfo } = this.props.screenProps;

        formData.append('id', params.idProyecto);

        fetch(URLBase + '/dir/getProyectoInfo', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.success && responseJson.success == '200') {
                    let categorias = responseJson.categorias;
                    let total = 0;
                    let Gastos = [];
                    let costo;
                    let totalGastos = 0;
                    if (categorias && categorias.lenght !== 0) {
                        categorias.forEach((element) => {
                            element.gastos.forEach((gasto) => {
                                //costo = element.costos.filter(item => item.id == gasto.costos_id);
                                if(gasto.pagado == 1 && gasto.costo)
                                    Gastos.push({ id: gasto.id, idCosto: gasto.costo.id, idCategoria: element.id, categoria: element.nombre, nombre: gasto.costo.nombre, notas: gasto.costo.notas, proveedor: gasto.costo.provedor, unidad: gasto.costo.unidad, pu: gasto.costo.pu, cantidad: gasto.cantidad, created_at: gasto.created_at, total: gasto.total });
                            });
                        });
                        Gastos.forEach((element) => {
                            totalGastos = totalGastos + parseFloat(element.total)
                        });
                        console.log('***************************** Gastos Array generate *******');
                        console.log(Gastos);
                        categorias.forEach((element) => {
                            total = total + parseFloat(element.total);
                        });
                        this.setState({
                            categorias: categorias.filter(element => element.statusGastos != '3'),
                            total,
                            gastos: Gastos,
                            totalGastos: totalGastos.toFixed(2),
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            categorias: [],
                            total,
                            gastos: Gastos,
                            totalGastos,
                            isLoading: false
                        });
                    }
                } else {
                    Alert.alert('Error', 'No se han podido actualizar las categorias');
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItemCategoria = ({ item }) => {
        if(item.gastos.length > 0){
            return(
                <TouchableOpacity 
                    style={styles.rowCategoriaContainer}
                    onPress={() => this.props.navigation.navigate('DesgloseGasto', {
                        costos: this.state.gastos.filter(element => element.idCategoria == item.id),
                        title: item.nombre,
                        idCategoria: item.id,
                        idProyecto: this.props.navigation.state.params.idProyecto,
                        refreshCategorias: this.refreshCategorias.bind(this)
                    })}>
                    <View style={SharedStyles.textGray}>
                    <AvenirMedium style={[SharedStyles.textGray, {fontSize: 13}]}>
                        {item.nombre + '  >  '}
                    </AvenirMedium>
                    </View>
                    <AvenirMedium style={[SharedStyles.textGray, {fontSize: 13}]}>
                        {
                            this.renderRealvsPlaneado(this.state.gastos.filter(element => element.idCategoria == item.id))
                        } / <NumberFormat
                            value={parseFloat(item.total).toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                            renderText={value => <Text>{value}</Text>}
                        />
                    </AvenirMedium>
                </TouchableOpacity>
            );
        } else
            return null;
    };

    _renderItemGastoRealizado = ({ item }) => (
            <View style={SharedStyles.rowCategoriaContainer}>
                <AvenirHeavy style={[styles.text, { width: '40%' }]}>
                    {item.categoria}
                </AvenirHeavy>
                <AvenirMedium style={[SharedStyles.textGray, { width: '40%' }]}>
                    {item.nombre}
                </AvenirMedium>
            <AvenirMedium style={[SharedStyles.textGray, { width: '20%' }]}>
                    <NumberFormat
                        value={parseFloat(item.total).toFixed(2)}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        renderText={value => <Text>{value}</Text>}
                    /> 
                </AvenirMedium>
            </View>
    );

    render() {
        const { presupuesto }=this.props.navigation.state.params;
        const {total, totalGastos}=this.state;
        let diferencia = parseFloat(presupuesto) - parseFloat(totalGastos);

        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Gastos'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <ScrollView style={styles.container}>
                <View style={[SharedStyles.gastos,{marginHorizontal: 20, marginTop: 20, marginBottom: 6}]}>
                    <View style={SharedStyles.presupuestoContainer}>
                        <AvenirHeavy style={styles.text}>
                            Costo Estimado
                        </AvenirHeavy>
                        <AvenirHeavy style={SharedStyles.textPrecio}>
                            <NumberFormat
                                value={parseFloat(presupuesto).toFixed(2)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$ '}
                                renderText={value => <Text>{value}</Text>} 
                            /> 
                        </AvenirHeavy>
                    </View>
                    <View style={SharedStyles.gastoTotalContainer}>
                        <AvenirHeavy style={{color: Colors.white, fontSize: 12}}>
                            Gasto Total
                        </AvenirHeavy>
                        <AvenirHeavy style={{ color: Colors.white, fontSize: 16 }}>
                                <NumberFormat
                                    value={parseFloat(totalGastos).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$ '}
                                    renderText={value => <Text>{value}</Text>}
                                /> 
                        </AvenirHeavy>
                    </View>
                </View>
                <View style={styles.diferenciaContainer}>
                        <AvenirHeavy style={styles.text}>
                            Diferencia
                        </AvenirHeavy>
                        <AvenirHeavy style={SharedStyles.textPrecio}>
                            <NumberFormat
                                value={diferencia.toFixed(2)}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$ '}
                                renderText={value => <Text>{value}</Text>}
                            /> 
                        </AvenirHeavy>
                </View>
                <View style={{ height: 20 }} />
                <AvenirHeavy style={{ marginHorizontal: 20 }}>
                    Gastos
                </AvenirHeavy>
                <View style={{ height: 10 }} />
                {
                        this.state.isLoading == true ? <ActivityIndicator size="large" color={Colors.primary} /> : <View style={[SharedStyles.categoriaContainer, { marginHorizontal: 20 }]}>
                            <View style={styles.rowCategoriaContainer}>
                                <AvenirHeavy style={styles.text}>
                                    Categoría  >  Realizado / Planeado
                        </AvenirHeavy>
                            </View>
                            <View style={{ height: 10 }} />
                            <FlatList
                                data={this.state.categorias}
                                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItemCategoria}
                            />
                            <Divider style={styles.divisorStyle} />
                            <View style={SharedStyles.totalContainer}>
                                <AvenirHeavy style={styles.text}>
                                    Total  <NumberFormat
                                        value={parseFloat(totalGastos).toFixed(2)}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        renderText={value => <Text>{value}</Text>}
                                    /> / <NumberFormat
                                        value={parseFloat(total).toFixed(2)}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </AvenirHeavy>
                            </View>
                        </View>

                }
               
                <View style={{height:40}}></View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: { 
        fontSize: 13,
    },
    rowCategoriaContainer: {
        flexDirection: 'row',
    },
    diferenciaContainer: { 
        backgroundColor: Colors.primary, 
        borderRadius: 5, 
        marginTop: 10, 
        padding: 10,
        marginHorizontal: 20,
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
        backgroundColor: Colors.divisor,
        marginVertical: 10,
    },
});
/*  <View style={{marginTop: 20,marginHorizontal: 20}}>
                    <AvenirHeavy>
                        Gastos Realizados
                    </AvenirHeavy>
                    <View style={{height: 10}}/>
                    <View style={SharedStyles.categoriaContainer}>
                        <FlatList
                            data={this.state.gastos}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItemGastoRealizado}
                            />
                        <Divider style={styles.divisorStyle} />
                        <View style={SharedStyles.totalContainer}>
                            <AvenirHeavy style={styles.text}>
                                Total: <NumberFormat
                                        value={parseFloat(totalGastos).toFixed(2)}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$ '}
                                        renderText={value => <Text>{value}</Text>}
                                        />
                            </AvenirHeavy>
                        </View>
                    </View>
                </View> */