import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Alert,Platform } from 'react-native';
import { Divider} from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import NumberFormat from 'react-number-format';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
var currencyFormatter = require('currency-formatter');

export default class PlanearGastosScreen extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            categorias: [],
            total: 0
        }
    }
    componentDidMount() {
        this.refreshCategorias();
    }

    _keyExtractor = (item, index) => item.id.toString();
    _renderItemCategoria = ({ item }) => (
        <View style={SharedStyles.rowCategoriaContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DesgloseGastoAdd', {
                costos: item.costos,
                title: item.nombre,
                idCategoria: item.id,
                refreshCategorias: this.refreshCategorias.bind(this),
            })}>
                <AvenirMedium style={SharedStyles.textGray}>
                    {item.nombre + '   >'}
                </AvenirMedium>
            </TouchableOpacity>
            <AvenirMedium style={SharedStyles.textGray}>
                {currencyFormatter.format(parseFloat(item.total), { code: 'USD' })}
            </AvenirMedium>
        </View>
    );
    refreshCategorias = async () => {
        var formData = new FormData();
        const { params } = this.props.navigation.state;
        const { accessInfo }=this.props.screenProps;

        formData.append('id', params.idProyecto);
        fetch(URLBase + '/dir/refreshCat', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON REFRESH CATEGORIAS *********************');
                console.log(responseJson.categorias);
                if(responseJson.success && responseJson.success=='200'){
                    let auxCategorias=responseJson.categorias;
                    let total = 0;
                    let categorias=auxCategorias.filter(element => element.statusGastos=='0');
                    categorias.forEach((element) => {
                        total = total + parseFloat(element.total);
                    });
                    this.setState({
                        categorias,
                        total,
                    });
                } else {
                    Alert.alert('Error', 'No se han podido actualizar las categorias');
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }
    render() {
        const { presupuesto, idProyecto } = this.props.navigation.state.params;
        const { total }= this.state;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Planeación de Gastos'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={styles.container}>
                        <View style={[SharedStyles.gastoTotalContainer,{width: '100%'}]}>
                            <AvenirHeavy style={{ color: Colors.white, fontSize: 12 }}>
                                Costo Estimado
                            </AvenirHeavy>
                            <AvenirHeavy style={{ color: Colors.white, fontSize: 16 }}>
                                {currencyFormatter.format(parseFloat(total), { code: 'USD' })}
                            </AvenirHeavy>
                        </View>
                    <CustomButton
                        style={{ marginVertical: 40 }}
                        title='Planear Gastos'
                        fontSize={14}
                        onPress={() => {
                            this.props.navigation.navigate('AgregarGasto',{ 
                                refreshCategorias: this.refreshCategorias.bind(this),
                                idProyecto,
                                categorias: this.state.categorias });
                        }} />
                    <View style={styles.categoriaContainer}>
                        <View style={SharedStyles.rowCategoriaContainer}>
                            <AvenirHeavy style={styles.text}>
                                Categoría
                            </AvenirHeavy>
                            <AvenirHeavy style={styles.text}>
                                Importe
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
                                Total: {currencyFormatter.format(parseFloat(total), { code: 'USD' })}
                            </AvenirHeavy>
                        </View>
                </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    text: {
        fontSize: 12
    },
    categoriaContainer: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 10,
        flex: 1,
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
    diferenciaContainer: {
        backgroundColor: Colors.subtitle,
        borderRadius: 5,
        marginTop: 10,
        padding: 10
    },
    divisorStyle: {
        backgroundColor: Colors.divisor
    }
});