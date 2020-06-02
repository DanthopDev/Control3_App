import React, { Component } from 'react';
import { View, Alert, StyleSheet, ScrollView, FlatList, RefreshControl} from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { HeaderBlackMenu } from '../../components/Headers';
import { AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import TareaResidenteItemSelected from '../../components/TareaResidenteItemSelected';
import AwesomeAlert from 'react-native-awesome-alerts';
import ProgressProyecto  from '../../components/ProgressProyecto';
import CustomButton from '../../components/CustomButton';
import URLBase from '../../constants/URLBase';
import ObteniendoInformacion from '../../components/ObteniendoInformacion';
 
export default class HomeResidenteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            message: '',
            idTarea: '',
            refreshing: false,
            isLoading: true,
            showAlert: false,
            tareas: [],
            proyectos: [],
        };
    }

    componentDidMount(){
        this.getInfoResidente();
    }

    updateProyectos = async () => {
        const { accessInfo } = this.props.screenProps;

        fetch(URLBase + '/res/getInfoRes', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                /*console.log('******************** LOADING DATA Residente*****************');
                console.log(responseJson); */     
                if (responseJson.message) {
                    if (responseJson.message == "Unauthenticated.") {
                        Alert.alert('Error de acceso', 'Cerrando sesión...');
                        this.props.screenProps.userLogOut()
                    } else
                        Alert.alert('Error de acceso', responseJson.message);
                } else {
                    arrayProyectos = responseJson.avancesPorProyecto;
                    orderProyectos = arrayProyectos.sort((a, b) => a.nombre.toLowerCase() > b.nombre.toLowerCase());
                    this.props.screenProps.changeState(responseJson.avancesPorProyecto, responseJson.unidades);
                    this.setState({
                        progressAvancesGeneral: parseFloat(responseJson.promedioAvanceGeneral),
                        progressCobrosGeneral: parseFloat(responseJson.promedioCobrosGeneral),
                        progressGastosGeneral: parseFloat(responseJson.promedioGastosGeneral),
                        proyectos: orderProyectos,
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }

    getInfoResidente = async () => {
        const { accessInfo } = this.props.screenProps;

        fetch(URLBase + '/res/getInfoRes', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('******************** LOADING DATA Residente*****************');
                console.log(responseJson);
                if (responseJson.message) {
                    if (responseJson.message == "Unauthenticated.") {
                        Alert.alert('Error de acceso', 'Cerrando sesión...');
                        this.props.screenProps.userLogOut()
                    } else 
                        Alert.alert('Error de acceso', responseJson.message);
                } else {
                    arrayProyectos = responseJson.avancesPorProyecto;
                    orderProyectos = arrayProyectos.sort((a, b) => a.nombre.toLowerCase() > b.nombre.toLowerCase());
                    this.props.screenProps.changeState(responseJson.avancesPorProyecto, responseJson.unidades, responseJson.proyectos);                  
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        progressAvancesGeneral: parseFloat(responseJson.promedioAvanceGeneral),
                        progressCobrosGeneral: parseFloat(responseJson.promedioCobrosGeneral),
                        progressGastosGeneral: parseFloat(responseJson.promedioGastosGeneral),
                        proyectos: orderProyectos,
                        tareas: responseJson.tareas
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }

    updateTarea = async () => {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        formData.append('id', this.state.idTarea);

        fetch(URLBase + '/res/checkTarea', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
               /* console.log('************************* VALOR DEL JSON UPDATE TAREA *********************');
                console.log(responseJson); */
                if (responseJson.success && responseJson.success=='200') {
                    let {tareas, idTarea}=this.state;
                    this.setState({
                        tareas: tareas.filter((element) => element.id != idTarea),
                        showAlert: false
                    });
                } else {
                   Alert.alert('Error', 'No se pudo actualizar la tarea.');
                }
                //console.log('*************Hitos **************');
                //console.log(responseJson.tareas);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    finalizarTarea(showAlert, title, message, idTarea ) {
        this.setState({
            showAlert,
            title: title,
            message,
            idTarea
        });
    }

    _keyExtractor = (item, index) => item.id.toString();

    _renderItemProgresoProyecto = ({ item, index }) => (
        <ProgressProyecto 
            item={item} 
            navigation={this.props.navigation}
            updateProyectos={this.updateProyectos.bind(this)}
        />
    );

    _renderItemTareaPendiente = ({ item, index }) => (
        <TareaResidenteItemSelected 
            finalizarTarea={this.finalizarTarea.bind(this)}
            item={item}
        />
    );

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getInfoResidente();
    }
                      
    render() {
        const barWidth = Layout.window.width - 60;
        return (
            <View style={SharedStyles.container}>
                <HeaderBlackMenu
                    title='Residente'
                    action={ () => this.props.navigation.openDrawer() }
                />
                {this.props.screenProps.isLoading == true || this.state.isLoading == true 
                    ?   <ObteniendoInformacion/> 
                    :   <ScrollView 
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                />
                            } 
                        >
                            <View 
                                style={{
                                    justifyContent: 'space-between',
                                    paddingTop: 15,
                                    borderBottomColor: Colors.divisor,
                                    borderBottomWidth: 1
                                }}>
                                <AvenirHeavy
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                    }}>
                                    Tareas Pendientes
                                </AvenirHeavy>
                                <View>
                                    {this.state.tareas.length == 0 
                                        ?   <AvenirMedium style={styles.message}> No hay Tareas Pendientes</AvenirMedium> 
                                        :   <FlatList
                                                data={this.state.tareas}
                                                horizontal={true}
                                                keyExtractor={this._keyExtractor}
                                                renderItem={this._renderItemTareaPendiente}
                                            />
                                    }
                                </View>
                            </View>
                            <View style={styles.avances}>
                                <View style={SharedStyles.progresosContainer}>
                                    <View style={SharedStyles.progressBarContainer}>
                                        <AvenirHeavy style={SharedStyles.progressTitle}>
                                            Avances
                                        </AvenirHeavy>
                                        <View style={SharedStyles.progressBarBackground}>
                                            <ProgressBarAnimated
                                                height={10}
                                                width={barWidth}
                                                value={this.state.progressAvancesGeneral > 100 ? 100 : this.state.progressAvancesGeneral}
                                                backgroundColor={Colors.progressBar1}
                                                borderRadius={10}
                                                borderWidth={0}
                                            />
                                        </View>
                                        <AvenirMedium style={SharedStyles.textProgress}>
                                            {this.state.progressAvancesGeneral} %
                                        </AvenirMedium>
                                    </View>
                                    <View style={SharedStyles.progressBarContainer}>
                                        <AvenirHeavy style={SharedStyles.progressTitle}>
                                            Gastos
                                        </AvenirHeavy>
                                        <View style={SharedStyles.progressBarBackground}>
                                            <ProgressBarAnimated
                                                height={10}
                                                width={barWidth}
                                                value={this.state.progressGastosGeneral > 100 ? 100 : this.state.progressGastosGeneral}
                                                backgroundColor={Colors.progressBar3}
                                                borderWidth={0}
                                            />
                                        </View>
                                        <AvenirMedium style={SharedStyles.textProgress}>
                                            {this.state.progressGastosGeneral} %
                                        </AvenirMedium>
                                    </View>
                                    <View style={SharedStyles.progressBarContainer}>
                                        <AvenirHeavy style={SharedStyles.progressTitle}>
                                            Cobros
                                        </AvenirHeavy>
                                        <View style={SharedStyles.progressBarBackground}>
                                            <ProgressBarAnimated
                                                height={10}
                                                width={barWidth}
                                                value={this.state.progressCobrosGeneral > 100 ? 100 : this.state.progressCobrosGeneral}
                                                backgroundColor={Colors.progressBar2}
                                                borderRadius={10}
                                                borderWidth={0}
                                            />
                                        </View>
                                        <AvenirMedium style={SharedStyles.textProgress}>
                                            {this.state.progressCobrosGeneral} %
                                        </AvenirMedium>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingVertical: 20}}>
                                {this.state.proyectos.length == 0 
                                    ?   <AvenirMedium style={styles.message}>
                                            Sin proyectos asignados
                                        </AvenirMedium> 
                                    :   <FlatList
                                            data={this.state.proyectos}
                                            horizontal={true}
                                            keyExtractor={this._keyExtractor}
                                            renderItem={this._renderItemProgresoProyecto}
                                        />
                                }
                                <CustomButton
                                    style={{ marginHorizontal: 20, marginVertical: 20 }}
                                    title='Generar Reporte  >'
                                    fontSize={14}
                                    onPress={() => {
                                        this.props.navigation.navigate('Reportes');
                                    }} 
                                />
                            </View>
                        </ScrollView> 
                }
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlert}
                    title={this.state.title}
                    message={this.state.message}
                    closeOnTouchOutside={true}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Confirmar'
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
                            title: 'Finalizando Tarea',
                            message: 'Se esta marcando la tarea como finalizada'
                        });
                        this.updateTarea();
                    }}
                    onDismiss={() => {
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
    message: { 
        margin: 20, 
        color: Colors.subtitle 
    },
    avances: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomColor: Colors.divisor,
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
});