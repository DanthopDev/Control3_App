import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Header, Divider} from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import { AvenirMedium, AvenirBook, AvenirHeavy } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import { HeaderGrayBack } from '../../components/Headers';
import moment from "moment";
const barWidth = Layout.window.width - 60;

const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export default class HitosScreen extends Component {
    constructor(props) {
        super(props);
        let terminoProgramado = '-----';
        let orderHitos = [];
        if (props.navigation.state.params.hitos && props.navigation.state.params.hitos.length !== 0) {
            let arrayHitos = props.navigation.state.params.hitos;
            //console.log(arrayHitos.sort((a, b) => a.fecha_fin < b.fecha_fin));
            orderHitos = arrayHitos.sort((a, b) => parseFloat(a.progreso) > parseFloat(b.progreso));
            terminoProgramado = orderHitos[0].fecha_fin;
        }

        this.state = {
            terminoProgramado: terminoProgramado,
            hitos: orderHitos
        };
        console.log('*********************** ID PROYECTO HITOS ******************');
        console.log(props.navigation.state.params.idProyecto);
        console.log(props.navigation.state.params.hitos);
    }
    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({ item }) => (
        <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EditHito', {
            hito: item, 
            updateHitos: this.updateHitos.bind(this),
            deleteHito: this.deleteHito.bind(this) 
            })} 
            style={[SharedStyles.hitoDescriptionContainer, { marginHorizontal: 20 }]} >
            <AvenirHeavy style={SharedStyles.nameHitoContainer}>
                {item.name}
            </AvenirHeavy>
            <View style={[SharedStyles.progressBarBackground, { backgroundColor: '#dfdfdf' }]}>
                <ProgressBarAnimated
                    height={10}
                    width={barWidth}
                    value={parseFloat(item.progreso)}
                    backgroundColor={item.fecha_terminada != null && item.progreso == '100' ? Colors.progressBar1 : moment().format("YYYY-MM-DD") <= item.fecha_fin ? Colors.primary : 'red' }
                    borderRadius={10}
                    borderWidth={0}
                />
            </View>
            <View style={SharedStyles.desgloseHitoContainer}>
                <Text>
                    <AvenirMedium style={SharedStyles.infoTitle}>Termina el: </AvenirMedium>
                    <AvenirBook style={SharedStyles.infoValor}>{this.formatDate(item.fecha_fin)}</AvenirBook>
                </Text>
                <Text>
                    <AvenirMedium style={SharedStyles.infoTitle}>Término Real: </AvenirMedium>
                    <AvenirBook style={SharedStyles.infoValor}>{item.fecha_terminada === null ? '-----' : this.formatDate(item.fecha_terminada)}</AvenirBook>
                </Text>
                <Text style={{ marginVertical: 10 }}>
                    <AvenirMedium style={SharedStyles.infoTitle}>Progreso: </AvenirMedium>
                    <AvenirBook style={SharedStyles.infoValor}>{item.progreso} %</AvenirBook>
                </Text>
            </View>
        </TouchableOpacity>
    );
    formatDate(fecha){
        let arrayFecha= fecha.split('-');
        indexMes=parseInt(arrayFecha[1])-1;
        let newDate = arrayFecha[2] + '-' + meses[indexMes] + '-' + arrayFecha[0];
        return newDate;
        
    }
    addHito(itemHito){
        let hitos=this.state.hitos;
        let orderHitos=[];
        console.log('***************************************Hitos', hitos);
        hitos.push(itemHito);
        orderHitos = hitos.sort((a, b) => a.fecha_fin < b.fecha_fin);
        terminoProgramado = orderHitos[0].fecha_fin;
        this.setState({
            hitos: orderHitos,
            terminoProgramado: terminoProgramado,
        });
        this.props.navigation.state.params.updateHitos(orderHitos);
    }
    updateHitos(idHito, nombre,descripcion, fecha_inicio, fecha_fin){
        console.log('ID HITO: ', idHito);
        let hitos=this.state.hitos;
        let index= hitos.findIndex( element => element.id == idHito );
        console.log('INDEX HITO: ', index);
        hitos[index].name=nombre;
        hitos[index].descripcion=descripcion; 
        hitos[index].fecha_inicio= fecha_inicio; 
        hitos[index].fecha_fin=fecha_fin; 
        this.setState({
            hitos: hitos
        });
        this.props.navigation.state.params.updateHitos(hitos);
    }
    deleteHito(idHito) {
        let hitos = this.state.hitos.filter(element => element.id != idHito);
        this.setState({
            hitos: hitos
        });
        this.props.navigation.state.params.updateHitos(hitos);
    }
    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Hitos'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={styles.container}>
                    <View style={{ margin: 20}}>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Progreso: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{params.progressAvance} %</AvenirBook>
                        </Text>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Termino Programado: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{this.state.terminoProgramado == '-----' ? '-----' : this.formatDate(this.state.terminoProgramado)}</AvenirBook>
                        </Text>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Término Real: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{params.terminoReal == '' ? '-----' : this.formatDate(params.terminoReal)}</AvenirBook>
                        </Text>
                        <CustomButton
                            style={{ marginTop: 20, width: 150}}
                            title='Agregar Hito'
                            fontSize={14}
                            onPress={() => {
                                this.props.navigation.navigate('AgregarHito', { 
                                    idProyecto: params.idProyecto,
                                    addHito: this.addHito.bind(this)
                                    });
                            }} />
                    </View>
                    <Divider style={styles.divisorStyle} />
                    <FlatList
                        data={this.state.hitos}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        ListFooterComponent={() => <View style={{ height: 20 }} />}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
            );
        }
    }
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    divisorStyle: {
        backgroundColor: Colors.divisor,
        marginHorizontal: 20 
    },
});