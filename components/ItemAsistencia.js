import React, { Component } from 'react';
import { View, Alert, Image, StyleSheet, TouchableOpacity, Vibration} from 'react-native';
import Colors from '../constants/Colors';
import SharedStyles from '../constants/SharedStyles';
import { AvenirHeavy, AvenirMedium } from './StyledText';
import Layout from '../constants/Layout';
import { Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import URLBase from '../constants/URLBase';

/* Componente de asistencia, contiene el nombre del obrero, su foto y su check para marcar la asistencia o inasistencia de este*/
export default class ItemAsistencia extends Component {
  constructor(props) {
    super(props);
    this.state = {
        asistencia: this.props.item.asistencia == 'asistencia' ? true : this.props.item.asistencia =='falta' ? false : null ,
        image: this.props.item.uri == "http://control3.pruebasdanthop.com/public/img/default.jpg" ? null : this.props.item.uri ,
        touchable: false,
    };
    console.log(this.props.index);
  }
    _tomarFoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status == 'granted') {
            console.log('Status Camara: ', status);
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [4, 4],
                quality: 0.5,
            });
            console.log(result);
            if (!result.cancelled) {
                if(this.state.asistencia!=null){
                    this.setState({ image: result.uri, touchable: false });
                    if(this.state.asistencia==true)
                        this.registrarAsistencia('asistencia');
                    else
                        this.registrarAsistencia('falta');
                }else
                    this.setState({ image: result.uri, touchable: false });            
            }
        } else 
            Alert.alert('Permisos denegados');
    }
    
    _rotate90andFlip = async (uri) => {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ rotate: 90 }, { flip: { vertical: true } }],
            { format: 'png' }
        );
        console.log(manipResult);
        //this.setState({ image: manipResult });
    }

    registrarAsistencia = async (asistencia) => {
        var formData = new FormData();
        const { accessInfo } = this.props;
        const { item, date } = this.props;

        if(this.state.image != null && this.state.image != ''){
           const file = {
                uri: this.state.image,
                type: 'image/jpeg', // or photo.type
                name: 'photo.jpg'
            };
            formData.append('foto', file);
        } else
            formData.append('foto', '');
        
        formData.append('id', item.id);
        formData.append('asistencia', asistencia);
        formData.append('fecha', date);

        fetch(URLBase + '/res/registarAsistencia', {
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
                if (responseJson.success && responseJson.success == '200') {
                    if(asistencia == 'asistencia'){
                        this.setState({ asistencia: true });
                        //Alert.alert('Registro de Asistencia', 'Se registro la asistencia del obrero');
                        this.props.updateObreros(asistencia, this.props.index);
                    }else {
                        this.setState({ asistencia: false });
                        //Alert.alert('Registro de Inasistencia', 'Se registro falta al obrero');
                        this.props.updateObreros(asistencia, this.props.index);
                    }                
                    Vibration.vibrate(100);
                } else {
                    Alert.alert('Error', 'No se pudo consultar los obreros');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
  render() {
      const { item }=this.props;
    return (
      <View style={styles.contain}>
      <TouchableOpacity onPress={() => {
              this._tomarFoto();
          }}>
                { this.state.image == null ? <View style={styles.iconCameraContainer}>
                    <Icon
                        name='camera'
                        type='entypo'
                        size={36}
                        color='gray'
                    />
                </View> : <Image
                        style={styles.imageContainer}
                        resizeMode='cover'
                        source={{ uri: this.state.image, }}
                    />
                }
      </TouchableOpacity>
        <View style={SharedStyles.categoriaContainer}>
            <View style={styles.descripcionCantainer}>
                <View
                style={{ width:Layout.window.width - 190 }}>
                    <AvenirHeavy>
                        Nombre
                    </AvenirHeavy>
                    <TouchableOpacity    
                    onPress={() => this.props.onShowAlert(item)}
                    style={{marginRight: 10}}
                    >
                        <AvenirMedium >
                            {item.nombre}
                        </AvenirMedium>
                    </TouchableOpacity> 
                </View>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => {
                        if(this.props.foto == 1){
                            if(this.state.image === null)
                                Alert.alert('Aviso', 'Este proyecto requiere que se le tome fotografía al obrero para registrar la asistencia');
                            else
                                this.registrarAsistencia('asistencia');
                        } else 
                            this.registrarAsistencia('asistencia');
                        }}>
                        <Icon
                            name='check-circle'
                            type='font-awesome'
                            size={28}
                            color={this.state.asistencia == null ? Colors.subtitle : this.state.asistencia == true ?  Colors.primary : Colors.subtitle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.registrarAsistencia('falta');
                        //this.setState({ asistencia: false });
                        }}>
                        <Icon
                            name='times-circle'
                            type='font-awesome'
                            size={28}
                            color={this.state.asistencia == null ? Colors.subtitle :  this.state.asistencia == false ? Colors.primary : Colors.subtitle}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    contain: {
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    iconCameraContainer: {
        backgroundColor: Colors.divisor, borderRadius: 5,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    imageContainer: {
        borderRadius: 5,
        width: 60,
        height: 60,
        marginRight: 20
    },
    descripcionCantainer: {
        flexDirection: 'row',
        width: Layout.window.width - 140,
        alignItems: 'center'
    },
    iconsContainer: {
        flexDirection: 'row',
        width: 55,
        justifyContent: 'space-between'
    }
});