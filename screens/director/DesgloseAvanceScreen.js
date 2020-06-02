import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, Platform } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import { AvenirMedium, AvenirBook, AvenirHeavy } from '../../components/StyledText';
import { HeaderGrayBack } from '../../components/Headers';
import moment from "moment";
const barWidth = Layout.window.width - 60;

export default class DesgloseAvanceScreen extends Component {
    constructor(props) {
        super(props);
        let terminoProgramado = '-----';
        let orderHitos=null;
        if (props.navigation.state.params.hitos && props.navigation.state.params.hitos.length!==0){
            let arrayHitos = props.navigation.state.params.hitos;
            //console.log(arrayHitos.sort((a, b) => a.fecha_fin < b.fecha_fin));
            orderHitos = arrayHitos.sort((a, b) => a.fecha_fin < b.fecha_fin);
            terminoProgramado = orderHitos[0].fecha_fin;
        }
        this.state = {
            terminoProgramado: terminoProgramado,
            hitos: orderHitos
        };
    }
    
    _keyExtractor = (item, index) => item.id.toString();
    _renderItem=({item}) => (
        <View style={[SharedStyles.hitoDescriptionContainer,{marginHorizontal: 20}]} >
            <AvenirHeavy style={SharedStyles.nameHitoContainer}>
                {item.name}
            </AvenirHeavy>
            <View style={SharedStyles.progressBarBackground}>
                <ProgressBarAnimated
                    height={10}
                    width={barWidth}
                    value={parseFloat(item.progreso)}
                    backgroundColor={Colors.progressBar1}
                    borderRadius={10}
                    borderWidth={0}
                />
            </View>
            <View style={SharedStyles.desgloseHitoContainer}>
                <Text>
                    <AvenirMedium style={SharedStyles.infoTitle}>Termina el: </AvenirMedium>
                    <AvenirBook style={SharedStyles.infoValor}>{moment(new Date(item.fecha_fin)).format("DD-MMM-YYYY")}</AvenirBook>
                </Text>
                <Text>
                    <AvenirMedium style={SharedStyles.infoTitle}>Término Real: </AvenirMedium>
                    <AvenirBook style={SharedStyles.infoValor}>{item.fecha_terminada === null ? '-----' : moment(new Date(item.fecha_terminad)).format("DD-MMM-YYYY") }</AvenirBook>
                </Text>
                <Text style={{ marginVertical: 10 }}>
                    <AvenirMedium style={SharedStyles.infoTitle}>Progreso: </AvenirMedium>
                    <AvenirBook style={SharedStyles.infoValor}>{parseFloat(item.progreso)} %</AvenirBook>
                </Text>
            </View>
        </View>
    );
    render() {
        const {params}=this.props.navigation.state;
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
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Progreso: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{ params.progressAvance } %</AvenirBook>
                        </Text>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Termino Programado: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{moment(new Date(this.state.terminoProgramado)).format("DD-MMM-YYYY")}</AvenirBook>
                        </Text>
                        <Text>
                            <AvenirMedium style={{ color: Colors.title }}>Término Real: </AvenirMedium>
                            <AvenirBook style={{ color: Colors.subtitle }}>{params.terminoReal == '' ? '-----' : moment(new Date(params.terminoReal)).format("DD-MMM-YYYY")}</AvenirBook>
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