import React, { Component } from 'react';
import { View, FlatList, ScrollView, StyleSheet, Text } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import NumberFormat from 'react-number-format';
import { HeaderGrayBack } from '../../components/Headers';

export default class DesgloseGastoScreen extends Component {
    constructor(props) {
        super(props);
        const { gastos } = this.props.navigation.state.params;

        console.log('************************* Gastos ***************************');
        console.log(this.props.navigation.state.params.gastos);

        let total = 0;
        nuevos_gastos=[];

        if (gastos && gastos.lenght !== 0) {
            gastos.forEach((element) => {
                total = total + parseFloat(element.total.replace("$", "", "gi"));
            });

            nuevos_gastos = gastos.sort((a, b) => a.create_at < b.create_at);
            this.state = {
                total,
                nombres_obreros: [],
                gastos: nuevos_gastos,
            }
        } else {
            this.state = {
                total,
                gastos: [],
                nombres_obreros: [],
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
            <View style={styles.rowCategoriaContainer}>
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
            </View>
        );
    }

    render() {
        const { title } = this.props.navigation.state.params;
        const { gastos, total } = this.state;
        
        if(title == 'Mano de obra'){
            datos = this.state.nombres_obreros;
            
            gastos.forEach(element => {
                if(!this.in_array(element, this.state.nombres_obreros))
                    this.state.nombres_obreros.push({id: element.id, nombre: element.nombre, unidad: element.unidad, categoria: element.categoria, cantidad: element.cantidad, pu: element.pu, total: element.total, asistencias: 0});
            });

            this.state.nombres_obreros.forEach(obrero => {
                var asistencias = 0;
                gastos.forEach(gasto => {
                    if(obrero.nombre == gasto.nombre)
                        asistencias++;
                });
                obrero.asistencias = asistencias;
            });
        } else 
            datos = gastos;

        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title={title}
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <ScrollView style={styles.container}>
                    <View style={[SharedStyles.categoriaContainer,{marginHorizontal: 20, marginTop: 20}]}>
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
                            <AvenirHeavy style={[styles.text, { width: '22%' }]}>
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
                            <AvenirHeavy style={{ fontSize: 13}}>
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
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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