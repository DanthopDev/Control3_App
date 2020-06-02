import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Divider, ListItem, Icon} from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import { AvenirHeavy, AvenirMedium, } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
import AwesomeAlert from 'react-native-awesome-alerts';
import Spinner from 'react-native-loading-spinner-overlay';

export default class DetalleProyectoScreen extends Component {
  constructor(props) {
    super(props);
    console.log('PROPIEDADES DE DETALLE PROYECTO');
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
        showAlertEdit: false,
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
        const {params}= this.props.navigation.state;
        formData.append('id', params.id);
        fetch(URLBase + '/dir/getProyectoInfo', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + params.accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                /*console.log('************************* VALOR DEL JSON *********************');
                console.log(responseJson); */
                if (responseJson.message) {
                    Alert.alert('Error de acceso', responseJson.message);
                } else {
                    if (progress) {
                        this.setState({
                            progressAvance: parseFloat(progress)
                        });
                        this.props.screenProps.updateProyectos();
                    }
                    this.setState({
                        progressCobros: parseFloat(responseJson.porcentajeCobros),
                        terminoReal: responseJson.status ==='1' ? responseJson.updated_at : '',
                        progressGastos: parseFloat(responseJson.porcentajeGastos),
                        hitos: responseJson.plan.hitos,
                        cobros: responseJson.proyecto.cobro,
                        categorias: responseJson.categorias,
                        costoContrato: responseJson.proyecto.costo,
                        presupuesto: responseJson.proyecto.presupuesto,
                        tareas: responseJson.tareas,
                        spinner: false
                    });
                }
                console.log('*************Hitos **************');
                //console.log(responseJson.tareas);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    
    _keyExtractor = (item, index) => item.id.toString();

    renderEstadoComponent= (status) => {
        if(status=='0'){
            return (
                <AvenirMedium style={{color: Colors.title, fontSize: 13}}>Pendiente</AvenirMedium>
            );
        }else {
            return (
                <AvenirMedium style={{color: '#a5a5a5', fontSize: 13}}>Completada</AvenirMedium>
            );
        }
        
    }

    _renderItem = ({ item }) => (
        <TouchableOpacity
        style={{marginHorizontal: 20}} 
        onPress={() => this.setState({
            tarea: item,
            showAlertEdit: true
        })}>
            <ListItem
                rightElement={this.renderEstadoComponent(item.status)}
                containerStyle={[SharedStyles.itemProyectoContainer, { marginHorizontal: 0 }]}
                title={item.name}
                subtitle={item.descripcion}
                titleStyle={[SharedStyles.itemDescriptionText, { fontFamily: 'avenir-heavy' }]}
                subtitleStyle={SharedStyles.itemDescriptionText}
            />
        </TouchableOpacity>
    );

    deleteTarea = async () => {
        var formData = new FormData();
        const { tarea } = this.state;
        const { accessInfo } = this.props.screenProps;

        formData.append('id', tarea.id);

        fetch(URLBase + '/dir/deleteTarea', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Eliminar Tarea *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    let nuevasTarea=this.state.tareas.filter( element => element.id != tarea.id)
                    this.setState({
                        tareas: nuevasTarea
                    });
                } else {
                    Alert.alert('No se han podido eliminar la tarea', responseJson.message);
                    this.setState({
                        loading: false
                    });
                }
            })
            .catch((error) => {
                Alert.alert('Error ', JSON.stringify(error));
                console.error(error);
            });
    }

    render() {
    const barWidth= Layout.window.width - 60;
    const { params } = this.props.navigation.state;
    const {progressAvance, terminoReal, hitos, cobros, costoContrato, presupuesto, categorias} = this.state;
    return (
        <View style={SharedStyles.container}>
            <Spinner
                visible={this.state.spinner}
                textContent={'Cargando...'}
                textStyle={styles.spinnerTextStyle}
            />
        <View style={SharedStyles.container}>
            <HeaderGrayBack
                title={this.props.navigation.state.params.title}
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
                    style={SharedStyles.progressBarContainer} >
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
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('GastosDirector', {
                            presupuesto,
                            categorias,
                            idProyecto: params.id,
                            getProyectoInfo: this.getProyectoInfo.bind(this)
                        });
                    }}
                    style={SharedStyles.progressBarContainer}>
                            <AvenirHeavy style={SharedStyles.progressTitle}>
                                Gastos
                            </AvenirHeavy>
                            <View style={SharedStyles.progressBarBackground}>
                                <ProgressBarAnimated
                                    height={10}
                                    width={barWidth}
                                    value={this.state.progressGastos> 100 ? 100 : this.state.progressGastos}
                                    backgroundColor={Colors.progressBar3}
                                    borderWidth={0}                                />
                            </View>
                        <AvenirMedium style={SharedStyles.textProgress}>
                         {this.state.progressGastos} %
                        </AvenirMedium>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('DesgloseCobros', {
                            cobros,
                            costoContrato,
                            idProyecto: params.id,
                            getProyectoInfo: this.getProyectoInfo.bind(this)
                        });
                    }}
                    style={SharedStyles.progressBarContainer}>
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
                    </TouchableOpacity>
                </View>
                <CustomButton
                    style={{ marginTop: 20 }}
                    title='Planeación  >'
                    fontSize={14}
                    onPress={() => {
                        this.props.navigation.navigate('CrearPlaneacion', {
                            idProyecto: params.id,
                            getProyectoInfo: this.getProyectoInfo.bind(this),
                            progressAvance,
                            terminoReal,
                            hitos,
                            presupuesto,
                            categorias
                            });
                    }} />
                <CustomButton
                    style={{ marginTop: 20 }}
                    title='Registrar Gasto'
                    fontSize={14}
                    onPress={() => {
                        this.props.navigation.navigate('RegistrarGasto', {
                            categorias: categorias,
                            idProyecto: params.id,
                            updateGastos: this.updateGastos.bind(this)
                        });
                    }} />
            </View>
            <Divider style={styles.divisorStyle} />
            <View style={styles.listContainer}>
                <View style={styles.titleTareasContainer}>
                    <AvenirHeavy style={{fontSize: 14}}>
                            Lista de Tareas
                    </AvenirHeavy>
                    <TouchableOpacity
                    style={{padding: 1, borderRadius: 2}} 
                        onPress={() => this.props.navigation.navigate('AgregarTarea', { idProyecto: params.id , getProyectoInfo: this.getProyectoInfo.bind(this)})}>
                    <Icon
                        name='plus'
                        color={Colors.title}
                        type='feather'
                        size={18}
                    />
                    </TouchableOpacity>
                </View>
                {this.state.tareas.length == 0 ? <AvenirMedium style={styles.message}>
                    Sin Tareas
                    </AvenirMedium> : null
                }
                <FlatList
                    data={this.state.tareas}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    ListFooterComponent={() => <View style={{ height: 20 }} />}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        </View>
            <AwesomeAlert
                titleStyle={SharedStyles.titleStyle}
                messageStyle={SharedStyles.messageStyle}
                confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                show={this.state.showAlertEdit}
                title={'Modificar Tarea'}
                message={'Seleccione la acción a realizar'}
                closeOnTouchOutside={true}
                showConfirmButton={true}
                showCancelButton={true}
                confirmText='Eliminar'
                cancelText='Editar'
                closeOnHardwareBackPress={false}
                confirmButtonColor={Colors.primary}
                cancelButtonColor={Colors.title}
                onCancelPressed={() => {
                    this.setState({
                        showAlertEdit: false
                    });
                    this.props.navigation.navigate('AgregarTarea', { 
                        idProyecto: params.id, 
                        getProyectoInfo: this.getProyectoInfo.bind(this),
                        tarea: this.state.tarea 
                        });
                }}
                onConfirmPressed={() => {
                    this.setState({
                        showAlertEdit: false
                    });
                    this.deleteTarea();
                }}
                onDismiss={() => {
                    this.setState({
                        showAlertEdit: false
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
    message: {
        margin: 20,
        color: Colors.subtitle
    },
    divisorStyle: { 
        backgroundColor: Colors.divisor 
    },
    spinnerTextStyle: {
        fontFamily: 'avenir-book',
        fontWeight: 'normal',
        color: Colors.white
    },
    listContainer: { flex: 1 },
    titleTareasContainer: {
        marginBottom: 10,
        marginTop: 20,
        marginHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
});