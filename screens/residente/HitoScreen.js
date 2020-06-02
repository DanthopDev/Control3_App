import React, { Component } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, Platform, TextInput, FlatList} from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { Divider } from 'react-native-elements';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import moment from "moment";

const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export default class HitoScreen extends Component {
  constructor(props) {
    super(props);
      const { hito } = this.props.navigation.state.params;
      console.log('Hito: ', hito);
    this.state = {
        progreso: '',
        hito,
        progresoGeneral: hito.progreso,
        notas: '',
        historial: null,
        loadingActualizar: false
    };
  }
  componentDidMount(){
      this.getHitoHistory();
  }
    updateHito = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { hito } = this.props.navigation.state.params;
        const { progreso, notas }=this.state;
        console.log('***NOTAS: ', notas);
        console.log('hito id: ', hito.id);
        formData.append('id', hito.id);
        formData.append('progreso',progreso);
        formData.append('notas',this.state.notas);
        fetch(URLBase + '/res/updateHito', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON *********************');
                console.log(responseJson);
                if (responseJson.success) {
                    if (responseJson.success == '200'){
                        let historialActual = []
                        if(this.state.historial!==null){
                          historialActual = this.state.historial;
                        }
                        historialActual.push(responseJson.historial);
                        this.setState({
                            showAlert: true,
                            loadingActualizar: false,
                            title: 'Hito Actualizado',
                            message: 'El hito se ha actualizado correctamente',
                            historial: historialActual,
                            progresoGeneral: responseJson.historial.progreso
                        });
                        this.props.navigation.state.params.updateHitos(hito.id, responseJson.historial.progreso, responseJson.hito.fecha_terminada);
                    }else {
                        Alert.alert('No se ha podido actualizar el hito', 'Vuelva a intentarlo'); 
                    }
                } else {
                    Alert.alert('Error al actualizar el hito', 'Vuelva a intentarlo');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    getHitoHistory = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { hito } = this.props.navigation.state.params;
        formData.append('id', hito.id);

        fetch(URLBase + '/res/getHitoHistory', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success=='200') {
                    if (responseJson.historial.length!=0){
                        this.setState({
                            historial: responseJson.historial
                        });
                        console.log('Historial: ', responseJson.historial);
                    }
                } else {
                    Alert.alert('Error en consultar hito', 'Cierra sesión y vuelve a ingresar');
                } 
            })
            .catch((error) => {
                console.error(error);
            });
    }
    validaCampos(){
        const { progreso } = this.state;
        if(progreso==''){
            this.setState({
                errorProgreso: true
            }); 
        } else {
            this.setState({
                loadingActualizar: true
            });
            this.updateHito();
        }
    }
    _keyExtractor = (item, index) => item.id.toString();
    _renderItem = ({ item, index }) => (
        <View style={[SharedStyles.categoriaContainer,{marginHorizontal: 20}]}>
            <Text>
                <AvenirHeavy style={styles.title}>
                    Fecha:
                            </AvenirHeavy>
                <Text> </Text>
                <AvenirBook style={styles.text}>
                    {this.formatDate(item.created_at.substring(0, 10))}
                </AvenirBook>
            </Text>
            <Text>
                <AvenirHeavy style={styles.title}>
                    Progreso:
                            </AvenirHeavy>
                <Text> </Text>
                <AvenirBook style={styles.text}>
                    {item.progreso} %
                            </AvenirBook>
            </Text>
            <View style={{ marginTop: 10 }}>
                <AvenirHeavy style={styles.title}>
                    Notas:
                            </AvenirHeavy>
                <AvenirBook style={styles.text}>
                    {item.notas == '' ? 'Sin notas' : item.notas}
                </AvenirBook>
            </View>
        </View>
    );
    formatDate(fecha) {
        let arrayFecha = fecha.split('-');
        indexMes = parseInt(arrayFecha[1]) - 1;
        let newDate = arrayFecha[2] + '-' + meses[indexMes] + '-' + arrayFecha[0];
        return newDate;

    }
  render() {
    const barWidth = Layout.window.width - 60;
    const { hito }=this.state;
    const { historial, progresoGeneral}= this.state;
    return (
        <View style={SharedStyles.container}>
            <HeaderGrayBack
                title={hito.name}
                action={() => {
                    this.props.navigation.goBack();
                }}
            />
            <ScrollView>
                <View style={styles.container}>
                    <View style={SharedStyles.categoriaContainer}>
                        <AvenirHeavy style={{ fontSize: 14, marginBottom: 10, textAlign: 'center', marginTop: 10 }}>
                            Progreso del Hito
                        </AvenirHeavy>
                        <View style={[SharedStyles.progressBarBackground, {backgroundColor: '#dfdfdf'}]}>
                            <ProgressBarAnimated
                                height={10}
                                width={barWidth}
                                value={parseFloat(progresoGeneral) > 100 ? 100 : parseFloat(progresoGeneral)}
                                backgroundColor={Colors.progressBar1}
                            backgroundColor={hito.fecha_terminada != null && progresoGeneral == '100' ? Colors.progressBar1 : moment().format("YYYY-MM-DD") <= hito.fecha_fin ? Colors.primary : 'red'}
                                borderRadius={10}
                                borderWidth={0}
                            />
                        </View>
                        <AvenirMedium style={SharedStyles.textProgress}>
                            Progreso: {parseFloat(progresoGeneral)} %
                        </AvenirMedium>
                        <View style={styles.inputContainer}>
                            <AvenirHeavy>
                                Actualizar Progreso
                            </AvenirHeavy>
                            <TextInput
                                style={styles.input}
                                placeholder='% progreso'
                                onChangeText={(progreso) => {
                                    let expresion = /^\d*\.?\d*$/;
                                    if (expresion.test(progreso)) {
                                        if(progreso>100){
                                            this.setState({
                                                progreso: '100',
                                                errorProgreso: false
                                            })
                                        }else {
                                            this.setState({
                                                progreso,
                                                errorProgreso: false
                                            })
                                        }
                                    }
                                }}
                                keyboardType='numeric'
                                value={this.state.progreso}
                                returnKeyType={'done'}
                            />
                            {this.state.errorProgreso == true && this.state.progreso=='' ? <AvenirBook style={{ color: 'red', fontSize: 12 }}>Ingrese el progreso</AvenirBook> : null}
                        </View>
                        <View style={{ marginBottom: 12 }}>
                            <AvenirHeavy>
                                Notas
                            </AvenirHeavy>
                            <TextInput
                                style={styles.input}
                                placeholder='Notas sobre la actividad a realizar'
                                onChangeText={(notas) => this.setState({ notas: notas })}
                                value={this.state.notas}
                                returnKeyType={'done'}
                                multiline={true}
                            />
                        </View>
                    </View>
                    <CustomButton
                        style={{ marginTop: 20 }}
                        title='Actualizar'
                        fontSize={14}
                        loading={this.state.loadingActualizar}
                        onPress={() => {
                            if(this.state.loadingActualizar==false){
                                this.validaCampos();
                            }
                        }} />
                </View>
                <Divider style={styles.divisorStyle} />
                <View>
                    <View style={{ margin:20 }}>
                        <AvenirHeavy style={styles.title}>
                            Descripción
                        </AvenirHeavy>
                        <AvenirBook style={styles.text}>
                            {hito.descripcion=='' ? 'Sin descripción' : hito.descripcion}
                        </AvenirBook>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 20, marginHorizontal: 20 }}>
                        <View style={{ marginRight: 30 }}>
                            <AvenirHeavy style={styles.title}>
                                Fecha Inicio
                            </AvenirHeavy>
                            <AvenirBook style={styles.text}>
                                {this.formatDate(hito.fecha_inicio)}
                            </AvenirBook>
                        </View>
                        <View>
                            <AvenirHeavy style={styles.title}>
                                Fecha Fin
                            </AvenirHeavy>
                            <AvenirBook style={styles.text}>
                                {this.formatDate(hito.fecha_fin)}
                            </AvenirBook>
                        </View>
                    </View>
                    {this.state.historial === null ? null : <FlatList
                        data={this.state.historial}
                        ListFooterComponent={<View style={{ height: 20 }} />}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    /> 
                    }
                </View>
            </ScrollView>
            <AwesomeAlert
                titleStyle={SharedStyles.titleStyle}
                messageStyle={SharedStyles.messageStyle}
                confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                show={this.state.showAlert}
                title={this.state.title}
                message={this.state.message}
                closeOnTouchOutside={true}
                showConfirmButton={true}
                showCancelButton={false}
                confirmText='Aceptar'
                cancelText='Cancelar'
                closeOnHardwareBackPress={false}
                confirmButtonColor={Colors.primary}
                cancelButtonColor={Colors.title}
                onCancelPressed={() => {
                    this.setState({
                        showAlert: false,
                    });
                }}
                onConfirmPressed={() => {
                    this.setState({
                        showAlert: false
                    });
                }}
                onDismiss={() => {
                    this.setState({
                        showAlert: false
                    });
                }}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    fatherContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    inputContainer: {
        marginBottom: 20
    },
    input: { 
        fontFamily: 'avenir-book', 
        borderColor: Colors.divisor, 
        borderBottomWidth: 1 
    },
    divisorStyle: {
        backgroundColor: Colors.divisor
    },
    title: { 
        fontSize: 13
    },
    text: {
        fontSize: 13
    }
});