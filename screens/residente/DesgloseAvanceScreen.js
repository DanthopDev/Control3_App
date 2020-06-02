import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, Platform, TouchableOpacity } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import { AvenirMedium, AvenirBook, AvenirHeavy } from '../../components/StyledText';
import { HeaderGrayBack } from '../../components/Headers';
import moment from "moment";

const barWidth = Layout.window.width - 60;
const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export default class DesgloseAvanceScreen extends Component {
    constructor(props) {
        super(props);
        let terminoProgramado = '-----';
        let orderHitos = null;
        if (props.navigation.state.params.hitos && props.navigation.state.params.hitos.length !== 0) {
            let arrayHitos = props.navigation.state.params.hitos;
            //console.log(arrayHitos.sort((a, b) => a.fecha_fin < b.fecha_fin));
            orderHitos = arrayHitos.sort((a, b) => a.fecha_fin < b.fecha_fin);
            terminoProgramado = orderHitos[0].fecha_fin;
        }
        let numeroHitos= 0;
        let completados=0;
        if(orderHitos!=null){
            numeroHitos=orderHitos.length;
            orderHitos.forEach(element => {
                if(element.fecha_terminada!==null){
                    completados++;
                }
            });
        }
        const { params } = props.navigation.state;
        this.state = {
            terminoProgramado: terminoProgramado,
            hitos: orderHitos,
            progressAvance: params.progressAvance,
            numeroHitos,
            completados
        };
    }
    formatDate(fecha) {
        let arrayFecha = fecha.split('-');
        indexMes = parseInt(arrayFecha[1]) - 1;
        let newDate = arrayFecha[2] + '-' + meses[indexMes] + '-' + arrayFecha[0];
        return newDate;

    }
    _keyExtractor = (item, index) => item.id.toString();
    _renderItem = ({ item }) => (
        <TouchableOpacity 
        style={[SharedStyles.hitoDescriptionContainer,{marginHorizontal: 20}]}
        onPress={() => this.props.navigation.navigate('Hito',{ hito: item, updateHitos: this.updateHitos.bind(this) })}
        >
            <AvenirHeavy style={SharedStyles.nameHitoContainer}>
                {item.name}
            </AvenirHeavy>
            <View style={[SharedStyles.progressBarBackground, { backgroundColor: '#dfdfdf'}]}>
                <ProgressBarAnimated
                    height={10}
                    width={barWidth}
                    value={parseFloat(item.progreso) > 100 ? 100 : parseFloat(item.progreso) }
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
                    <AvenirBook style={SharedStyles.infoValor}>{parseFloat(item.progreso)} %  /  { this.realizarComparativa(item.fecha_inicio, item.fecha_fin) } %</AvenirBook>
                </Text>
            </View>
        </TouchableOpacity>
    );
    realizarComparativa(fecha_inicio, fecha_fin) {
        let porcentajeAlMomento = 100;
        if (moment().format("YYYY-MM-DD") <= fecha_fin ){
            let dateInicial = moment(fecha_inicio);
            let dateFinal = moment(fecha_fin);
            let duracionEnDias = dateFinal.diff(dateInicial, 'days') + 1;
            let diasHastaHoy = moment().diff(dateInicial, 'days') + 1;
            let porcentajeParcial= 100/duracionEnDias; 
            porcentajeAlMomento= diasHastaHoy * porcentajeParcial;
        }
        
        return porcentajeAlMomento.toFixed(0);
    }
    updateHitos(idHito, progreso, fecha_terminada) {
        console.log('ID HITO: ', idHito);
        let generalProgress=0;
        let hitos = this.state.hitos;
        let index = hitos.findIndex(element => element.id == idHito);
        console.log('INDEX HITO: ', index);
        hitos[index].progreso = progreso;
        hitos[index].fecha_terminada = fecha_terminada;
        hitos.forEach(element => {
            generalProgress= generalProgress + parseFloat(element.progreso);
        });
        generalProgress=generalProgress/(hitos.length);
        this.setState({
            hitos: hitos,
            progressAvance: generalProgress.toFixed(2)
        });
        this.props.navigation.state.params.getProyectoInfo(generalProgress.toFixed(2));
    }
    render() {
        const { params } = this.props.navigation.state;
        const { progressAvance }=this.state;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Desglose de Hitos'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={styles.container}>
                    <View style={{ margin: 20 }}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text>
                                <AvenirMedium style={{ color: Colors.title }}>Progreso: </AvenirMedium>
                                <AvenirBook style={{ color: Colors.subtitle }}>{progressAvance} %</AvenirBook>
                            </Text>
                            <AvenirBook style={{ color: Colors.subtitle }}>{this.state.completados} / {this.state.numeroHitos} </AvenirBook>
                        </View>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Termino Programado: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{this.state.terminoProgramado == '-----' ? '-----' : this.formatDate(this.state.terminoProgramado)}</AvenirBook>
                        </Text>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Término Real: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{params.terminoReal == '' ? '-----' : this.formatDate(params.terminoReal)}</AvenirBook>
                        </Text>
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