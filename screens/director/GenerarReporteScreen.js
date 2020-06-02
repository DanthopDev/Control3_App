import React, { Component } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
import CustomButton from '../../components/CustomButton';
import { Button } from 'react-native-paper';
import { AvenirHeavy, AvenirBook} from '../../components/StyledText';
import ReporteItemCheckBox from '../../components/ReporteItemCheckBox';
import Layout from '../../constants/Layout';

export default class GenerarReporteScreen extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        checkedPendientes: false,
        checkedCompletados: false,
        checkedTareas: false,
        checkedSolicitudes: false,
        loadingReporte: false
    }
    createReporte = async (reporte) => {
        var formData = new FormData();
        console.log('REPORTE: ', reporte);
        console.log('URLBASDE: ', this.state);
        const { accessInfo } = this.props.screenProps;
        const { idProyecto }=this.props.navigation.state.params;
        const { checkedPendientes, checkedCompletados, checkedTareas, checkedSolicitudes } = this.state;

        formData.append('id', idProyecto );
        formData.append('avances', checkedPendientes);
        formData.append('gastos', checkedCompletados);
        formData.append('cobros', checkedTareas);
        formData.append('tareas', checkedSolicitudes);
        fetch(URLBase + '/dir/downloadPDF', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.ruta);
                if(responseJson.success && responseJson.success == '300'){
                    this.setState({
                        loadingReporte: false
                    });
                    Linking.openURL(responseJson.ruta).catch((err) => console.error('An error occurred', err));
                } else {
                    Alert.alert('Error', 'No se pudo generar el reporte');
                    this.setState({
                        loadingReporte: false
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                console.error(error);
            });
    }
    
    render() {
        const buttonWidth = (Layout.window.width - 60)/2;
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Generar Reporte'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={styles.container}>
                    <View style={{marginVertical: 20}}>
                        <AvenirBook style={{
                            fontSize: 12,
                            fontStyle: 'italic',
                            color: Colors.subtitle,
                            textAlign: 'center',
                        }}>
                            Agrega los indicadores a mostrar en el reporte
                        </AvenirBook>
                    </View>
                    <ReporteItemCheckBox
                            title='Avances'
                            checked={this.state.checkedPendientes}
                            onPress={() => this.setState({ checkedPendientes: !this.state.checkedPendientes })}
                    />
                    <View style={{ height: 20}}/>
                    <ReporteItemCheckBox
                        title='Gastos'
                        checked={this.state.checkedCompletados}
                        onPress={() => this.setState({ checkedCompletados: !this.state.checkedCompletados })}
                    />
                    <View style={{ height: 20 }} />
                    <ReporteItemCheckBox
                        title='Cobros'
                        checked={this.state.checkedTareas}
                        onPress={() => this.setState({ checkedTareas: !this.state.checkedTareas })}
                    />
                    <View style={{ height: 20 }} />
                    <ReporteItemCheckBox
                        title='Tareas'
                        checked={this.state.checkedSolicitudes}
                        onPress={() => this.setState({ checkedSolicitudes: !this.state.checkedSolicitudes })}
                    />
                    <View style={{ height: 20 }} />
                    <View style={{flexDirection: 'row', marginHorizontal: 20, marginVertical: 40, justifyContent: 'space-between'}}>
                        <Button
                            uppercase={false}
                            style={{ width: buttonWidth }}
                            children={<AvenirHeavy style={{ fontSize: 14, color: Colors.white, letterSpacing: 0 }}>
                                Cancelar
                            </AvenirHeavy>}
                            color={Colors.title}
                            mode="contained"
                            onPress={() => {
                                this.props.navigation.goBack();
                            }} />
                        <CustomButton
                            loading={this.state.loadingReporte}
                            style={{ width: buttonWidth }}
                            title='Generar'
                            fontSize={14}
                            onPress={() => {
                                if(this.state.loadingReporte==false){
                                    this.setState({
                                        loadingReporte: true
                                    }),
                                        this.createReporte();
                                }
                            }} />
                    </View>
                </View>
            </View>
        );
    }
}
// 'Hitos Pendientes', 'Hitos Completados', 'Tareas', 'Solicitudes'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});