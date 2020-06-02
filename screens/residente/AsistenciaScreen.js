import React, { Component } from 'react';
import { Divider, Icon } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import CalendarStrip from 'react-native-calendar-strip';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import URLBase from '../../constants/URLBase';
import URLImage from '../../constants/URLImage';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import { HeaderGrayBack } from '../../components/Headers';
import ItemAsistencia from '../../components/ItemAsistencia';
import { AvenirHeavy, AvenirMedium, AvenirBook} from '../../components/StyledText';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import 'moment/locale/es';

export default class AsistenciaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obreros: [],
      grupos: [],
      isLoading: true,
      showAlert: false,
      estaEnviando: false,
      muestraBotonHoy: true,
      selectedDate: new Date(),
    };    
  }
  
  componentDidMount(){
    this.getListaAsistencia(this.state.selectedDate);
  }

  async _getPermisionsCamera() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== 'granted')
      Alert.alert('Permiso de camara denegado.');
    else
      this._getPermisionsGallery();
  }

  async _getPermisionsGallery() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted')
      Alert.alert('Permiso de galeria denegado.');
  }

  getDatesBlackList(){
    let datesBlacklist = [];

    for(i = 0; i > -100; i--){
       day = moment().add(i, 'days');

       if(day.isoWeekday() == 6 || day.isoWeekday() == 7)
          datesBlacklist.push(day);
    }

    for(i = 0; i < 100; i++){
       day = moment().add(i, 'days');

       if(day.isoWeekday() == 6 || day.isoWeekday() == 7)
          datesBlacklist.push(day);
    }
    return datesBlacklist;
  }

  getListaAsistencia = async (date) => {
    var formData = new FormData();
    const { accessInfo } = this.props.screenProps;
    const { idProyecto } = this.props.navigation.state.params;

    formData.append('id', idProyecto);
    formData.append('fecha', moment(date).format('YYYY-MM-DD'));

    console.log('ID DE PROYECTO: ', idProyecto);
    console.log(date);

    fetch(URLBase + '/res/ListaAsistencia', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessInfo.access_token,
        Accept: 'application/json',
      },
      body: formData
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('************************* VALOR Lista de Asistencia *********************');
        console.log(responseJson);
       if(responseJson.success && responseJson.success=='200'){
          let auxObreros = [];
          let grupos = responseJson.grupos;

          responseJson.obreros.forEach(element => {
            if(element.obrero=='1' && element.status=='1'){
              if (responseJson.asistencia) {
                let index = responseJson.asistencia.findIndex(item => item.costos_id == element.id);
                if (index != -1) {
                  auxObreros.push({
                    id: element.id, nombre: element.nombre,
                    uri: responseJson.asistencia[index].foto== '' ? null : URLImage + responseJson.asistencia[index].foto , pu: element.pu, puesto: element.puesto, grupo: element.grupo_id, asistencia: responseJson.asistencia[index].asistencia
                  });
                } else {
                  auxObreros.push({ id: element.id, nombre: element.nombre, uri: null, pu: element.pu, puesto: element.puesto, grupo_id: element.grupo_id, asistencia: null });
                }
              } else {
                auxObreros.push({ id: element.id, nombre: element.nombre, uri: null, pu: element.pu, puesto: element.puesto, grupo_id: element.grupo_id, asistencia: null });
              }
            }
          });
          this.setState({
            obreros: auxObreros,
            grupos,
            isLoading: false
          });
          this._getPermisionsCamera();
        } else {
          Alert.alert('Tuvimos un problema', 'No existe la categoria Mano de obra.');
          this.setState({
            isLoading: false
          });
        } 
      })
      .catch((error) => {
        console.error(error);
      });
  }

  countAsitencia() {
    let asistencias = 0;
    let faltas = 0;
    let asistenciaCompleta=true;

    this.state.obreros.forEach(element => {
      if(element.asistencia == null)
        asistenciaCompleta = false;

      if (element.asistencia == 'asistencia')
        asistencias = asistencias + 1;

      if (element.asistencia == 'falta')
        faltas = faltas + 1;
    });
    console.log('Asistencia: ', asistencias);
    console.log('Falta: ', faltas);

    if(asistenciaCompleta == false)
      Alert.alert('Aviso', 'No le has tomado asistencia a todos tus obreros, completa la actividad y vueleve a intentar' );
    else
      this.sendNotificacionAsistencia(asistencias, faltas);
  }

  sendNotificacionAsistencia = async (asistencias, faltas ) => {
    var formData = new FormData();
    const { accessInfo } = this.props.screenProps;
    const { idProyecto } = this.props.navigation.state.params;

    formData.append('id', idProyecto);
    formData.append('asistencias',asistencias);
    formData.append('faltas', faltas);
    formData.append('residente', accessInfo.user.name + ' ' + accessInfo.user.last_name);

    fetch(URLBase + '/res/notificarAsistencias', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessInfo.access_token,
        Accept: 'application/json',
      },
      body: formData
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('************************* VALOR Lista de Asistencia *********************');
        console.log(responseJson);
        if(responseJson.success=='200'){
          Alert.alert('Envio exitoso', 'La lista de asistencia de ha enviado de manera correcta');
          this.setState({
            estaEnviando: false
          });
        } else {
          Alert.alert('Envio erroneo', 'La lista de asistencia no se ha podido enviar de manera correcta. Intente de nuevo');
          this.setState({
            estaEnviando: false
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onShowAlert(item){
    this.setState({
      showAlert: true,
      obrero: item
    })
  }

  updateObreros(asistencia, index){
    let auxObreros=this.state.obreros;
    auxObreros[index].asistencia=asistencia;

    this.setState({
      obreros: auxObreros
    });
  }

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem = ({ item, index }) => (
    <ItemAsistencia 
      item={item}
      index={index}
      onShowAlert={this.onShowAlert.bind(this)}
      updateObreros={this.updateObreros.bind(this)}
      foto={this.props.navigation.state.params.foto}
      accessInfo={this.props.screenProps.accessInfo}
      date={moment(this.state.selectedDate).format('YYYY-MM-DD')}
    />
  );

  deleteObrero() {
    this.setState({
      showAlert: false
    });

    var formData = new FormData();
    const { accessInfo } = this.props.screenProps;
    const { obrero } = this.state;

    formData.append('id', obrero.id);
    
    fetch(URLBase + '/res/deleteObrero', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessInfo.access_token,
        Accept: 'application/json',
      },
      body: formData
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('************************* VALOR DEL JSON Eliminar Asistensia *********************');
        console.log(responseJson);
        if (responseJson.success && responseJson.success == '200') {
          const {obreros} = this.state;
          let newObreros = obreros.filter(element => element.id!=obrero.id);
          this.setState({
            obreros: newObreros,
            showAlert: false
          });
        } else {
          Alert.alert('Error', 'No se han podido eliminar al Obrero');
          this.setState({
            showAlert: false
          });
        }
      })
      .catch((error) => {
        Alert.alert('Error ', JSON.stringify(error));
        console.error(error);
      });

  }

  render() {
    const { idProyecto, title} = this.props.navigation.state.params;
    const { accessInfo } = this.props.screenProps;
    const date = new Date();

    return (
      <View style={SharedStyles.container}>
        <HeaderGrayBack
          title={'Asistencia ' + title}
          action={() => {
            this.props.navigation.goBack();
          }}
        />
        <View style={styles.container}>
            <AvenirHeavy style={styles.title}>
                Asistencia de Obreros{"\n"}en Tareas Activas
            </AvenirHeavy>
            { this.state.muestraBotonHoy == true
              ? <View style={{alignItems: 'flex-end'}}>
                  <TouchableOpacity 
                    style={styles.todayBotton}
                    onPress={ () => {
                        this.setState({
                          selectedDate : date,
                          isLoading: true
                        });
                        this.getListaAsistencia(date)
                      }
                    }
                  > 
                    <Text style={styles.todayText}>HOY</Text> 
                  </TouchableOpacity>
                </View>
              : null
            }
            <CalendarStrip         
                selectedDate={this.state.selectedDate}
                daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 2, borderHighlightColor: Colors.primary}}
                style={{height: 100, paddingBottom: 10}}
                calendarColor={Colors.background}
                calendarHeaderFormat={'MMMM YYYY'}
                disabledDateNameStyle={{color: 'grey'}}
                disabledDateNumberStyle={{color: 'grey'}}
                onDateSelected={(date) => {
                  this.setState({ 
                    selectedDate: date,
                    isLoading : true,
                  });
                  this.getListaAsistencia(date);
                }}
                setSelectedDate={new Date()}
              />
          <Divider style={styles.divisorStyle} />
          { this.state.isLoading == true ? <ActivityIndicator size="large" color={Colors.primary} /> 
          : <FlatList
              data = {this.state.obreros}
              ListHeaderComponent = { 
                <AvenirBook style={{
                    fontSize: 12,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    marginVertical: 15
                  }}
                >
                  Marque la asistencia o inasistencia del Obrero
                </AvenirBook>
              }
              ListFooterComponent={ <View>
              { this.state.obreros.length != 0 
                ? <CustomButton
                    style={{ margin: 20, marginRight: 80 }}
                    title='Enviar lista de asistencia'
                    fontSize={14}
                    loading={this.state.estaEnviando}
                    onPress={() => {
                      if(this.state.estaEnviando == false) {
                        this.setState({
                          estaEnviando: true
                        });
                        this.countAsitencia();
                      }
                    }} 
                  /> 
                : <View/> 
              } 
              </View>
              }
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            /> 
          }
        </View>
        <TouchableOpacity
          style={styles.addContainer}
          onPress={() => {
            this.props.navigation.navigate('AddAsistencia', { 
              idProyecto: idProyecto, 
              accessInfo: accessInfo,
              grupos: this.state.grupos,
              getListaAsistencia: this.getListaAsistencia.bind(this)
              });
          }}>
          <Icon
            name='plus'
            type='antdesign'
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
        <AwesomeAlert
          titleStyle={SharedStyles.titleStyle}
          messageStyle={SharedStyles.messageStyle}
          confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
          show={this.state.showAlert}
          title={'Modificar Personal'}
          message={'Seleccione la accion a realizar.'}
          closeOnTouchOutside={true}
          showConfirmButton={true}
          showCancelButton={true}
          confirmText='Eliminar'
          cancelText='Editar'
          closeOnHardwareBackPress={true}
          confirmButtonColor={Colors.primary}
          cancelButtonColor={Colors.title}
          onCancelPressed={() => {
            this.setState({
              showAlert: false
            });
            if(this.props.navigation.state.params.menu)
              this.props.navigation.navigate('EditarObrero', { item: this.state.obrero, getListaAsistencia: this.getListaAsistencia.bind(this), grupos: this.state.grupos, idProyecto: idProyecto })
            else
              this.props.navigation.navigate('EditObrero', { item: this.state.obrero, getListaAsistencia: this.getListaAsistencia.bind(this), grupos: this.state.grupos, idProyecto: idProyecto })
          }}
          onConfirmPressed={() => {
            this.deleteObrero();
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

const styles=StyleSheet.create({
  container: {
      flex: 1,
      paddingTop: 20,
  },
  title: { 
      fontSize: 16, 
      textAlign: 'center',
  },
  divisorStyle: {
    backgroundColor: Colors.divisor,
    marginHorizontal: 20
  },
  addContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.title
  },
  todayBotton:{
    alignItems:'center',
    justifyContent:'center',
    width:30,
    height:30,
    backgroundColor:Colors.primary,
    borderRadius:50,
    marginRight:10
  },
  todayText:{
    fontSize:10, 
    fontWeight: 'bold'
  }
})