import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, ScrollView, Platform } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import NumberFormat from 'react-number-format';
import { HeaderGrayBack } from '../../components/Headers';
import CustomButton from '../../components/CustomButton';

export default class GastosResidenteScreen extends Component {
    constructor(props) { 
        super(props);
        const { categorias, unidades } = props.navigation.state.params;
        //console.log('************************ Categorias GASTOS *************************');
        //console.log(categorias);

        let total = 0;
        let Gastos = [];
        let totalGastos = 0;

        if (categorias && categorias.lenght !== 0) {
            categorias.forEach((element) => {
                element.gastos.forEach((gasto) => {
                    if(gasto.pagado == 1 && gasto.costo)
                        Gastos.push({ id: gasto.id, idCategoria: element.id, categoria: element.nombre, nombre: gasto.costo.nombre, unidad: gasto.costo.unidad, pu: gasto.costo.pu, cantidad: gasto.cantidad, created_at: gasto.created_at, total: gasto.total });
                });
            });
            Gastos.forEach((element) => {
                totalGastos = totalGastos + parseFloat(element.total)
            });

            categorias.forEach((element) => {
                if(element.gastos.length > 0){
                    total_gastos = 0;
                    
                    element.gastos.forEach(element2 => {
                        total_gastos += parseFloat(element2.total);
                    });

                    if(total_gastos > 0)
                        total = total + parseFloat(element.total);
                }
            });

            this.state = {
                categorias: categorias.filter(element => element.statusGastos!='3'),
                unidades, unidades,
                total,
                gastos: Gastos,
                totalGastos: totalGastos.toFixed(2)
            }
        } else {
            this.state = {
                categorias: [],
                unidades: unidades,
                total,
                gastos: Gastos,
                totalGastos
            }
        }
    }

    updateGastos(nombreCategoria, nombreGasto, total) {
        let auxGastos=this.state.gastos;
        auxGastos.push({ id: this.state.gastos.length + 1 , categoria: nombreCategoria, nombre: nombreGasto, total: total });
        this.setState({
            gastos: auxGastos
        })
    }

    _keyExtractor = (item, index) => item.id.toString();

    renderRealvsPlaneado(idCat) {
        let total = 0;
        let gastosDeCategoria=this.state.gastos.filter(element => element.idCategoria == idCat);
        if (gastosDeCategoria && gastosDeCategoria !== 0) {
            gastosDeCategoria.forEach((element) => {
                total = total + parseFloat(element.total.replace("$", "", "gi"));
            })
        }
        return (
            <NumberFormat
                value={parseFloat(total).toFixed(2)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
                renderText={value => <Text>{value}</Text>}
            />
        )
    }

    _renderItemCategoria = ({ item }) => {
        if(item.gastos.length > 0){
            return( 
                <TouchableOpacity
                    style={styles.rowCategoriaContainer}
                    onPress={() => this.props.navigation.navigate('DesgloseGasto', {
                        gastos: this.state.gastos.filter(element => element.idCategoria == item.id),
                        title: item.nombre
                    })}>
                    <AvenirMedium style={[SharedStyles.textGray, {fontSize: 13}]}>
                        {item.nombre + '  >  '}
                    </AvenirMedium>
                    <AvenirMedium style={[SharedStyles.textGray, { marginRight: 10, fontSize: 13 }]}>
                        {
                            this.renderRealvsPlaneado(item.id)
                        } / <NumberFormat
                            value={parseFloat(Math.round(item.total)).toFixed(2)}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                            renderText={value => <Text>{value}</Text>}
                        />
                    </AvenirMedium>
                </TouchableOpacity>
            )
        } else
            return null;
    }

    _renderItemGastoRealizado = ({ item }) => (
        <View style={SharedStyles.rowCategoriaContainer}>
            <AvenirHeavy style={[styles.text,{ width: '40%' }]}>
                {item.categoria}
            </AvenirHeavy>
            <AvenirMedium style={[SharedStyles.textGray, { width: '40%' }]}>
                {item.nombre}
            </AvenirMedium>
            <AvenirMedium style={[SharedStyles.textGray, {width: '20%'}]}>
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
        const { presupuesto, idProyecto } = this.props.navigation.state.params;
        const { total, totalGastos, categorias, unidades } = this.state;
        let diferencia = parseInt(presupuesto) - parseFloat(totalGastos);
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Gastos'
                    action={() => {
                        this.props.navigation.state.params.getProyectoInfo()
                        this.props.navigation.goBack();

                    }}
                />
                <ScrollView style={styles.container}>
                    <View style={[SharedStyles.gastos, {marginHorizontal: 20, marginTop: 20}]}>
                        <View style={SharedStyles.presupuestoContainer}>
                            <AvenirHeavy style={styles.text}>
                                Costo Estimado
                            </AvenirHeavy>
                            <AvenirHeavy style={SharedStyles.textPrecio}>
                                <NumberFormat
                                    value={parseFloat(Math.round(presupuesto)).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$ '}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </AvenirHeavy>
                        </View>
                        <View style={SharedStyles.gastoTotalContainer}>
                            <AvenirHeavy style={{ color: Colors.white, fontSize: 12 }}>
                                Gasto Total
                        </AvenirHeavy>
                            <AvenirHeavy style={{ color: Colors.white, fontSize: 16 }}>
                                <NumberFormat
                                    value={parseFloat(Math.round(totalGastos)).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$ '}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </AvenirHeavy>
                        </View>
                    </View>
                    <View style={styles.diferenciaContainer}>
                        <AvenirHeavy style={{ color: Colors.white, fontSize: 12 }}>
                            Diferencia
                        </AvenirHeavy>
                        <AvenirHeavy style={{ color: Colors.white, fontSize: 16 }}>
                            <NumberFormat
                                value={Math.round(diferencia.toFixed(2))}
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
                    <View style={[SharedStyles.categoriaContainer, {marginHorizontal: 20}]}>
                        <View style={styles.rowCategoriaContainer}>
                            <AvenirHeavy style={styles.text}>
                                Categoría  >  Realizado / Planeado
                            </AvenirHeavy>
                        </View>
                        <View style={{ height: 10 }} />
                        <FlatList
                            data={categorias}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItemCategoria}
                        />
                        <Divider style={styles.divisorStyle} />
                        <View style={SharedStyles.totalContainer}>
                            <AvenirHeavy style={styles.text}>
                                    Total  <NumberFormat
                                    value={parseFloat(Math.round(totalGastos)).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    renderText={value => <Text>{value}</Text>}
                                /> / <NumberFormat
                                    value={parseFloat(Math.round(total)).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </AvenirHeavy>
                        </View>
                    </View>                
                    <CustomButton
                        style={{ marginVertical: 40, marginHorizontal: 20 }}
                        title='Registrar Gasto'
                        fontSize={14}
                        onPress={() => {
                            this.props.navigation.navigate('RegistrarGasto', { 
                                idProyecto: idProyecto,
                                categorias: categorias, 
                                unidades, unidades,
                                updateGastos: this.updateGastos.bind(this)
                                });
                        }} />
                    <View style={{ height: 20 }}></View>
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
        fontSize: 13
    },
    rowCategoriaContainer: {
        flexDirection: 'row',
    },
    diferenciaContainer: {
        backgroundColor: Colors.subtitle,
        marginHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
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
        backgroundColor: Colors.divisor,
        marginVertical: 10,
    },
});

/* this.props.navigation.navigate('DesgloseGasto', {
                costos: item.costos,
                title: item.nombre
            }*/