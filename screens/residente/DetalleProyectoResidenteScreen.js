import React, { Component } from 'react';
import { View, Alert, Text, SafeAreaView, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { HeaderGrayBack } from '../../components/Headers';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import CustomButton from '../../components/CustomButton';
import URLBase from '../../constants/URLBase';
import Spinner from 'react-native-loading-spinner-overlay';
 
export default class DetalleProyectoResidenteScreen extends Component {
    constructor(props) {
        super(props);
        this.getProyectoInfo();
    }

    state = {
        progressAvance: 0 + parseFloat(this.props.navigation.state.params.avance),
        progressCobros: 0,
        progressGastos: 0,
        terminoReal: '',
        hitos: [],
        cobros: [],
        costos: [],
        tareas: [],
        spinner: true
    }

    updateGastos(nombreCategoria, nombreGasto, total) {
        console.log(nombreCategoria);
        console.log(nombreGasto);
        console.log(total);
        this.getProyectoInfo();
    }
 
    getProyectoInfo = async (progress) => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { params } = this.props.navigation.state;
        formData.append('id', params.id);
        fetch(URLBase + '/res/getProyectoInfo', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
               // console.log('************************* VALOR DEL JSON DETALLE PROYECTO *********************');
               // console.log(responseJson);
                if (responseJson.message) {
                    Alert.alert('Error en el servidor', responseJson.message);
                } else {
                    //console.log('Progreso',progress);
                    if(progress){
                        console.log('Entra');
                        this.setState({
                            progressAvance: parseFloat(progress)
                        });
                        this.props.navigation.state.params.update();
                    }
                    this.setState({
                        progressCobros: parseFloat(responseJson.porcentajeCobros),
                        terminoReal: responseJson.status === '1' ? responseJson.updated_at : '',
                        progressGastos: parseFloat(responseJson.porcentajeGastos),
                        hitos: responseJson.plan.hitos,
                        cobros: responseJson.proyecto.cobro,
                        categorias: responseJson.categorias,
                        unidades: responseJson.unidades,
                        costoContrato: responseJson.proyecto.costo,
                        presupuesto: responseJson.proyecto.presupuesto,
                        tareas: responseJson.tareas,
                        spinner: false
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
    const barWidth = Layout.window.width - 60;
    const {title, id}=this.props.navigation.state.params;
    const { progressAvance, terminoReal, hitos, presupuesto, categorias, unidades } = this.state;

    return (
        <View style={SharedStyles.container}>
            <Spinner
                visible={this.state.spinner}
                textContent={'Cargando...'}
                textStyle={styles.spinnerTextStyle}
            />
            <HeaderGrayBack
                title={title}
                action={() => {
                    this.props.navigation.goBack();
                }}
            />
            <View style={styles.container}>
                <View style={SharedStyles.progresosContainer}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('DesgloseAvance', {
                            progressAvance,
                            terminoReal,
                            hitos,
                            getProyectoInfo: this.getProyectoInfo.bind(this)
                        });
                    }} 
                    style={SharedStyles.progressBarContainer}>
                            <AvenirHeavy style={SharedStyles.progressTitle}>
                                Avance de Proyecto
                            </AvenirHeavy>
                            <View style={SharedStyles.progressBarBackground}>
                                <ProgressBarAnimated
                                    height={10}
                                    width={barWidth}
                                    value={this.state.progressAvance > 100 ? 100 : this.state.progressAvance}
                                    backgroundColor={Colors.progressBar1}
                                    borderRadius={10}
                                    borderWidth={0}
                                />
                            </View>
                        <AvenirMedium style={SharedStyles.textProgress}>
                          {this.state.progressAvance} %
                        </AvenirMedium>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => {
                        this.props.navigation.navigate('GastosResidente', {
                            presupuesto,
                            categorias,
                            unidades,
                            idProyecto: id,
                            getProyectoInfo: this.getProyectoInfo.bind(this)
                        });
                        //console.log('*************************** GASTOS ******************************************************');
                        //console.log(this.state.costos);
                    }}
                    style={SharedStyles.progressBarContainer}>
                            <AvenirHeavy style={SharedStyles.progressTitle}>
                                Gastos
                            </AvenirHeavy>
                            <View style={SharedStyles.progressBarBackground}>
                                <ProgressBarAnimated
                                    height={10}
                                    width={barWidth}
                                    value={this.state.progressGastos >100 ? 100 : this.state.progressGastos}
                                    backgroundColor={Colors.progressBar3}
                                    borderWidth={0}
                                />
                            </View>
                        <AvenirMedium style={SharedStyles.textProgress}>
                         {this.state.progressGastos} %
                        </AvenirMedium>
                    </TouchableOpacity>
                    <View style={SharedStyles.progressBarContainer}>
                        <AvenirHeavy style={SharedStyles.progressTitle}>
                            Cobros
                            </AvenirHeavy>
                        <View style={SharedStyles.progressBarBackground}>
                            <ProgressBarAnimated
                                height={10}
                                width={barWidth}
                                value={this.state.progressCobros > 100 ? 100 : this.state.progressCobros}
                                backgroundColor={Colors.progressBar2}
                                borderRadius={10}
                                borderWidth={0}
                            />
                        </View>
                        <AvenirMedium style={SharedStyles.textProgress}>
                         {this.state.progressCobros} %
                        </AvenirMedium>
                    </View>
                </View>
                <CustomButton
                    style={{ marginTop: 40 }}
                    title='Solicitud'
                    fontSize={14}
                    onPress={() => {
                        this.props.navigation.navigate('Solicitud',{
                            categorias: categorias, 
                            idProyecto: id,
                            getProyectoInfo: this.getProyectoInfo.bind(this)
                            });
                    }} />
                <CustomButton
                    style={{ marginTop: 20 }}
                    title='Asistencia de Obreros'
                    fontSize={14}
                    onPress={() => {
                        this.props.navigation.navigate('Asistencia', { idProyecto: id, foto: this.props.navigation.state.params.foto });
                    }} />
                <CustomButton
                    style={{ marginTop: 20 }}
                    title='Registrar Gasto'
                    fontSize={14}
                    onPress={() => {
                        this.props.navigation.navigate('RegistrarGasto', { 
                            idProyecto: id,
                            categorias: categorias, 
                            unidades: unidades,
                            updateGastos: this.updateGastos.bind(this)
                            });
                    }} />
            </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    spinnerTextStyle: {
        fontFamily: 'avenir-book',
        fontWeight: 'normal',
        color: Colors.white
    }
});