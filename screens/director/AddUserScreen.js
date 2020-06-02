import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { Dropdown } from 'react-native-material-dropdown';
import { AvenirBook, AvenirHeavy, AvenirMedium } from '../../components/StyledText';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayBack } from '../../components/Headers';
import { Avatar } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';

export default class AddUserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            emailEmpty: false,
            errorNombre: false,
            apellido: '',
            emailExist: false,
            howAlertChooseFoto: false,
            errorApellido: false,
            rol: '',
            errorRol: false,
            telefono: '',
            errorTelefono: false,
            correo: '',
            errorCorreo: false,
            password: '',
            confirmPassword: '',
            errorPassword: false,
            errorConfirmPassword: false,
            uriFoto: null,
            loading: false,
            usuarios: [{
                value: 'Residente',
                rol: 4
            }, {
                value: 'Almacenista',
                rol: 5
            }],
        };
    }
    componentWillUnmount(){
        this.props.navigation.state.params.getResAlm();
    }
    componentDidMount() {
        this._getPermisionsCamera();
    }

    createUser() {
        var formData = new FormData();
        const { accessInfo } = this.props.screenProps;
        const { nombre, apellido, rol, telefono, correo, password }=this.state;
        if (this.state.uriFoto != null && this.state.uriFoto != '') {
            const file = {
                uri: this.state.uriFoto,
                type: 'image/jpeg', // or photo.type
                name: 'photo.jpg'
            };
            formData.append('foto', file);
        } else {
            formData.append('foto', '');
        }

        formData.append('nombre', nombre);
        formData.append('apellido', apellido);
        formData.append('rol', rol);
        formData.append('telefono', telefono);
        formData.append('correo', correo);
        formData.append('password', password);
        fetch(URLBase + '/dir/createUser', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('************************* VALOR Crear USUARIO*********************');
                console.log(responseJson);
                if (responseJson.success=='200'){
                    this.setState({
                        showAlert: true,
                        title: 'Registro exitoso',
                        message: 'Se ha registrado el nuevo usuario de manera exitosa',
                        loading: false
                    });
                }else if (responseJson.fail){
                    this.setState({
                        loading: false,
                        errorCorreo: true,
                        emailExist: true
                    });
                }else {
                    Alert.alert('No fue posible registrar el usuario', responseJson.message);
                    this.setState({
                        loading: false
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async _getPermisionsCamera() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            Alert.alert('Permiso de camara denegado.');
        } else {
            this._getPermisionsGallery();
        }
    }
    async _getPermisionsGallery() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            Alert.alert('Permiso de galeria denegado.');
        }
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
                this.setState({ uriFoto: result.uri, showAlertChooseFoto: false });
            }
        } else {
            Alert.alert('Permisos denegados');
        }
    }
_pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status == 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 4],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ uriFoto: result.uri, showAlertChooseFoto: false });
        }
    } else {
        Alert.alert('Permisos denegados');
    }
};
    validaForm() {
        const { nombre, apellido, rol, telefono, correo, password, confirmPassword } = this.state;
        this.setState({
            loading: true
        });
        if (nombre == '') {
            this.setState({
                errorNombre: true,
                loading: false
            });
        } else if(apellido==''){
            this.setState({
                errorApellido: true,
                loading: false
            });
        } else if(rol==''){
            this.setState({
                errorRol: true,
                loading: false
            });
        } else if(telefono=='') {
            this.setState({
                errorTelefono: true,
                loading: false
            });
        } else if(correo=='') {
            this.setState({
                errorCorreo: true,
                emailEmpty: true,
                loading: false
            });
        } else if(password==''){
            this.setState({
                errorPassword: true,
                loading: false
            });
        } else if(password!=confirmPassword) {
            this.setState({
                errorConfirmPassword: true,
                loading: false
            });
        }else {
            this.createUser();
        }
    }
    render() {
        const offset = (Platform.OS === 'android') ? -500 : 0;
        return (
            <KeyboardAvoidingView
                style={styles.fatherContainer} behavior="padding" enabled
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
                <View style={SharedStyles.container}>
                    <HeaderGrayBack
                        title='Registrar Usuario'
                        action={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        style={styles.container}>
                        <View style={{alignItems: 'center'}}>
                            <Avatar
                                rounded
                                size="xlarge"
                                source={this.state.uriFoto == null ? require('../../assets/images/userIcon.png') : {
                                    uri: this.state.uriFoto
                                        }}
                                showEditButton
                                editButton={{ name: 'pencil', type: 'evilicon', color: '#fff' }}
                                onEditPress={() => this.setState({ showAlertChooseFoto: true })}
                            />
                        </View>
                        <View style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 20 }}>
                            <CustomInput
                                error={this.state.errorNombre}
                                label='Nombre'
                                selectionColor={Colors.primary}
                                value={this.state.nombre}
                                returnKeyType={'done'}
                                onChangeText={(nombre) => this.setState({ nombre, errorNombre: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorNombre == true ? <AvenirBook style={styles.error}>Ingrese un Nombre</AvenirBook> : null}
                        </View>
                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                            <CustomInput
                                error={this.state.errorApellido}
                                label='Apellido'
                                selectionColor={Colors.primary}
                                value={this.state.apellido}
                                returnKeyType={'done'}
                                onChangeText={(apellido) => this.setState({ apellido, errorApellido: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorApellido == true ? <AvenirBook style={styles.error}>Ingrese un Apellido</AvenirBook> : null}
                        </View>
                        <Dropdown
                            overlayStyle={{ margin: 0, padding: 0 }}
                            containerStyle={styles.dropdownContainer}
                            fontSize={14}
                            value={this.state.rol}
                            itemTextStyle={{ fontFamily: 'avenir-medium' }}
                            label='Rol'
                            baseColor={Colors.title}
                            textColor={Colors.title}
                            data={this.state.usuarios}
                            onChangeText={(value, index) => {
                               console.log('Valor del usario',this.state.usuarios[index]);
                               this.setState({
                                   rol: this.state.usuarios[index].rol,
                                   errorRol: false
                               })
                            }}
                        />
                        {this.state.errorRol == true ? <AvenirBook style={styles.errorRol}>Seleccione un Rol</AvenirBook> : null}
                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                            <CustomInput
                                error={this.state.errorTelefono}
                                label='Teléfono'
                                selectionColor={Colors.primary}
                                value={this.state.telefono}
                                keyboardType='number-pad'
                                returnKeyType={'done'}
                                onChangeText={(telefono) => this.setState({ telefono, errorTelefono: false })}
                                underlineColor='transparent'
                            />
                            { this.state.errorTelefono == true ? <AvenirBook style={styles.error}>Ingrese el Teléfono</AvenirBook> : null }
                        </View>
                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                            <CustomInput
                                error={this.state.errorCorreo}
                                label='Correo'
                                value={this.state.correo}
                                returnKeyType='done'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                onChangeText={correo => this.setState({ correo, emailEmpty: false, errorCorreo: false, emailExist: false })}
                                underlineColor='transparent'
                            />
                            {this.state.emailEmpty == true ? <AvenirBook style={styles.error}>Ingrese un correo electrónico</AvenirBook> : null}
                            {this.state.emailExist == true ? <AvenirBook style={styles.error}>Ingrese otro correo electrónico, ya que este correo ya se encuentra registrado</AvenirBook> : null}
                        </View>
                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                            <CustomInput
                                error={this.state.errorPassword}
                                label='Contraseña'
                                value={this.state.password}
                                secureTextEntry={true}
                                returnKeyType={'done'}
                                autoCapitalize='none'
                                textContentType='password'
                                onChangeText={password => this.setState({ password, errorPassword: false, errorConfirmPassword: false })}
                                underlineColor='transparent'
                            />
                            {this.state.errorPassword == true ? <AvenirBook style={styles.error}>Ingrese una Contraseña para el nuevo usuario</AvenirBook> : null}
                        </View>
                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                            <CustomInput
                                error={this.state.errorConfirmPassword}
                                label='Confirmar Contraseña'
                                value={this.state.confirmPassword}
                                secureTextEntry={true}
                                returnKeyType={'done'}
                                autoCapitalize='none'
                                textContentType='password'
                                onChangeText={confirmPassword => this.setState({ confirmPassword, errorConfirmPassword: false})}
                                underlineColor='transparent'
                            />
                            {this.state.errorConfirmPassword == true ? <AvenirBook style={styles.error}>Las contraseñas no coinciden</AvenirBook> : null}
                        </View>
                        <CustomButton
                            style={{ marginTop: 20, marginBottom: 40, marginHorizontal: 20 }}
                            loading={this.state.loading}
                            title='Registrar'
                            fontSize={14}
                            onPress={() => {
                                if (this.state.loading == false) {
                                    this.validaForm();
                                }
                            }} />

                    </ScrollView>
                </View>
                <AwesomeAlert
                    titleStyle={SharedStyles.titleStyle}
                    messageStyle={SharedStyles.messageStyle}
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlertChooseFoto}
                    title={this.state.title}
                    message={this.state.message}
                    closeOnTouchOutside={true}
                    showCancelButton={false}
                    cancelText='Cancelar'
                    closeOnHardwareBackPress={true}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    customView={<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={() => this._tomarFoto()}>
                            <Icon
                                reverse
                                name='camera'
                                type='entypo'
                                color={Colors.title}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._pickImage()}>
                            <Icon
                                reverse
                                name='md-photos'
                                type='ionicon'
                                color={Colors.title}
                            />
                        </TouchableOpacity>
                    </View>}
                    onCancelPressed={() => {
                      
                    }}
                    onConfirmPressed={() => {
                        
                    }}
                    onDismiss={() => {
                        this.setState({
                            showAlertChooseFoto: false,
                        });
                    }}
                />
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
                            showAlert: false,
                            nombre: '',
                            apellido: '',
                            rol: '',
                            telefono: '',
                            correo: '',
                            password: '',
                            confirmPassword: '',
                            uriFoto: null,
                        })
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    label: {
        color: Colors.title,
        fontSize: 12,
        marginTop: 10,
        marginLeft: 10
    },
    fatherContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 10,
    },
    errorRol: {
        fontSize: 12,
        color: 'red',
        marginHorizontal: 20, marginBottom: 20
    },
    dropdownContainer: {
        paddingTop: 0,
        marginTop: 0,
        marginBottom: 20,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        backgroundColor: '#ffff',
        borderRadius: 6,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            },
        })
    }
});