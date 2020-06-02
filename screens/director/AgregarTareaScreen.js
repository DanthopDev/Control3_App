import React, { Component } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';

export default class AgregarTareaScreen extends Component {
    constructor(props) {
        super(props);
        console.log('PROPIEDADES DE AGREGAR TAREA');
        console.log(props.navigation.state.params);
        if (props.navigation.state.params.tarea) {
            const { tarea } = props.navigation.state.params;
            this.state={
                nombre: tarea.name,
                loading: false,
                showAlert: false,
                descripcion: '',
                errorNombre: false,
                errorDescripcion: false,
                title: '',
                descripcion: tarea.descripcion
            }
        }else {
            this.state = {
                nombre: '',
                loading: false,
                showAlert: false,
                descripcion: '',
                errorNombre: false,
                errorDescripcion: false,
                title: '',
                descripcion: ''
            }
        }
    }
    
   
    addTarea = async () => {
        var formData = new FormData();
        const { params } = this.props.navigation.state;
        const { accessInfo } = this.props.screenProps;
        const { nombre, descripcion } = this.state;
        formData.append('id', params.idProyecto);
        formData.append('name', nombre);
        formData.append('descripcion', descripcion);
        fetch(URLBase + '/dir/createTarea', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Agreagar Tarea *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        title: 'Tarea agregada',
                        message: 'La nueva tarea ha sido asignada exitosamente',
                        loading: false
                    });
                    this.props.navigation.state.params.getProyectoInfo();
                } else {
                    Alert.alert('Error', 'No se han podido asignar la tarea');
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
    
    updateTarea = async () => {
        var formData = new FormData();
        const { tarea } = this.props.navigation.state.params;
        const { accessInfo } = this.props.screenProps;
        const { nombre, descripcion } = this.state;
        formData.append('id', tarea.id);
        formData.append('name', nombre);
        formData.append('descripcion', descripcion);
        fetch(URLBase + '/dir/updateTarea', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR DEL JSON Agreagar Tarea *********************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.setState({
                        showAlert: true,
                        title: 'Tarea actualizada',
                        message: 'La nueva tarea ha sido actualizada exitosamente',
                        loading: false
                    });
                    this.props.navigation.state.params.getProyectoInfo();
                } else {
                    Alert.alert('No se han podido actualizar la tarea', responseJson.message);
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
    
    validaForm(){
        const { nombre , descripcion }=this.state;
        const { tarea } = this.props.navigation.state.params;
        if(nombre==''){
            this.setState({
                errorNombre: true,
                loading: false
            });
        }else {
            if(tarea){
                this.updateTarea();
            }else {
                this.addTarea();
            }
        }
    }
    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        const { tarea } = this.props.navigation.state.params;
        return (
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: Colors.background }} 
                behavior={Platform.OS === "ios" ? "padding" : null} enabled
            >
                <ScrollView style={SharedStyles.container}>
                    <HeaderGrayBack
                        title={ tarea ? 'Editar Tarea' : 'Agregar Tarea' }
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                        <View style={styles.container}>
                            <CustomInput
                                error={this.state.errorNombre}
                                label='Nombre'
                                selectionColor={Colors.primary}
                                value={this.state.nombre}
                                returnKeyType={'done'}
                                onChangeText={nombre => this.setState({ nombre, errorNombre: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorNombre == true ? <AvenirBook style={styles.error}>Ingrese un Nombre</AvenirBook> : null}
                            <View style={{ height: 20 }} />
                            <CustomInput
                                error={this.state.errorDescripcion}
                                label='Descripción'
                                selectionColor={Colors.primary}
                                value={this.state.descripcion}
                                multiline={true}
                                onChangeText={descripcion => this.setState({ descripcion, errorDescripcion: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorDescripcion == true ? <AvenirBook style={styles.error}>Ingrese una Descripción</AvenirBook> : null}
                            { tarea ? 
                                <CustomButton
                                    style={{ marginTop: 20 }}
                                    title='Actualizar Tarea'
                                    fontSize={14}
                                    loading={this.state.loading}
                                    onPress={() => {
                                        if (this.state.loading == false) {
                                            this.setState({
                                                loading: true
                                            });
                                            this.validaForm();
                                        }
                                    }} /> : <CustomButton
                                style={{ marginTop: 20 }}
                                title='Asignar Tarea'
                                fontSize={14}
                                loading={this.state.loading}
                                onPress={() => {
                                    if (this.state.loading == false) {
                                        this.setState({
                                            loading: true
                                        });
                                        this.validaForm();
                                    }
                                }} />
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
                    confirmText='Aceptar'
                    closeOnHardwareBackPress={true}
                    confirmButtonColor={Colors.primary}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onDismiss={() => {
                        this.setState({
                            nombre: '',
                            descripcion: ''
                        })
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 10
    },
});