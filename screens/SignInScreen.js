import React from 'react';
import {
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  AsyncStorage
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { AvenirBlack, AvenirMedium, AvenirHeavy, AvenirBook } from '../components/StyledText';
import Colors from '../constants/Colors';
import CustomInput from '../components/CustomInput';
import Layout from '../constants/Layout';
import URLBase  from '../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import SharedStyles from '../constants/SharedStyles';
import { Icon } from 'react-native-elements';
import PasswordInput from '../components/PasswordInput';

export default class SignInScreen extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        email: '',
        password: '',
        title: '',
        message: '',
        isLoading: false,
        errorEmail: false,
        errorPassword: false,
        showAlert: false,
        showPassword: true,
    }

    static navigationOptions = {
        header: null
    };

    validaCampos(){
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
       /* console.log('Email:',this.state.email);
        console.log('password:', this.state.password); */
        if(this.state.email === ''){
           this.setState({
               errorEmail: true,
               showAlert: true,
               title: 'Ingrese todos los campos',
               message: 'Email es necesario para iniciar sesión',
           });
        } /*else if(!regex.test(this.state.email)){
            this.setState({
                errorEmail: true,
                title: 'Formato de email incorrecto',
                message: 'Asegurese de haber ingresado correctamente su email.',
                showAlert: true,
            }); 
        } */ 
        else{ 
            if(this.state.password == ''){
                this.setState({
                    errorPassword: true,
                    errorEmail: false,
                    showAlert: true,
                    title: 'Ingrese todos los campos',
                    message: 'Para iniciar sesión debe ingresar la contraseña de su cuenta',
                });
            } else {
                this.setState({
                    isLoading: true
                }, function() {
                    this.userLogin();
                });
            }
        }
    }

    userLogin = async () => {
        var formData = new FormData();
        formData.append('email',this.state.email);
        formData.append('password',this.state.password);
        fetch(URLBase+'/auth/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('Servidor:', responseJson);
                if(responseJson.user){
                    if (responseJson.user.rol === '2'){
                        console.log('DIRECTOR');
                        const infoAcces = JSON.stringify(responseJson);
                        this._storeData(infoAcces);
                        this.setState({
                            isLoading: false
                        })
                        this.props.navigation.navigate('Director', { userInfo: responseJson });
                    } else {
                        if (responseJson.user.rol === '4'){
                            console.log('RESIDENTE');
                            const infoAcces = JSON.stringify(responseJson);
                            this._storeData(infoAcces);
                            this.setState({
                                isLoading: false
                            })
                            this.props.navigation.navigate('Residente', { userInfo: responseJson });
                        } else {
                            if (responseJson.user.rol === '5'){
                                console.log('ALMACENISTA');
                                const infoAcces = JSON.stringify(responseJson);
                                this._storeData(infoAcces);
                                this.setState({
                                    isLoading: false
                                })
                                this.props.navigation.navigate('Almacenista', { userInfo: responseJson });
                            } else {
                                this.setState({
                                    errorPassword: false,
                                    isLoading: false,
                                    showAlert: true,
                                    title: 'Lo sentimos',
                                    message: 'No tiene permitido el acceso a Control 3',
                                });
                            }
                        }
                    }
                } else {
                    if(responseJson.message){
                        if (responseJson.message =='Unauthorized'){
                            this.setState({
                                errorEmail: true,
                                title: 'Sin Acceso, usuario no autorizado.',
                                message: 'Verifica que ingresas el usuario correcto y que tienes alguno de los siguietes roles: Director o Residente o Almacenista',
                                showAlert: true,
                            });
                        } else {
                            if (responseJson.errors){
                                if (responseJson.errors.email && responseJson.errors.email =='The email must be a valid email address.'){
                                    this.setState({
                                        errorEmail: true,
                                        showAlert: true,
                                        title: 'Email Incorrecto',
                                        message: 'Ingrese un email valido',
                                    });
                                }
                            } else {
                                this.setState({
                                    errorPassword: true,
                                    errorEmail: true,
                                    showAlert: true,
                                    title: 'Sin acceso',
                                    message: 'Ingrese email y contraseña correctos',
                                });
                            }
                        }
                    } 
                }
            })
            .catch((error) => {
                Alert.alert('Error', JSON.stringify(error));
                console.error(error);
            });
    }

    _storeData = async (info) => {
        try {
            await AsyncStorage.setItem('userInfo', info);
        } catch (error) {
            console.log(error,'Error al guaradar la información en la Storage');
        }
    };

    render() {
      const offset = (Platform.OS === 'android') ? -500 : 0;

      return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                barStyle="dark-content"
            />
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
                <ScrollView style={styles.container}>
                    <View style={styles.logoContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require('../assets/images/logo_login.png')}
                                style={styles.image}
                                resizeMode='contain'
                            />
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <View>
                            <AvenirBlack style={{color: Colors.title, fontSize: 18}}>¡Bienvenido a Control 3!</AvenirBlack>
                            <AvenirMedium style={{color: Colors.subtitle, fontSize: 16 }}>Ingresa tu email y contraseña para continuar</AvenirMedium>
                        </View>
                        <View style={{marginVertical: 20}}>
                            <CustomInput
                                error={this.state.errorEmail}
                                label='Email'
                                value={this.state.email}
                                returnKeyType='done'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                textContentType='username'
                                onChangeText={email => this.setState({ email })}
                                underlineColor='transparent'
                            />
                            <View style={{height: 20}} />
                            <CustomInput
                                error={this.state.errorPassword}
                                label='Contraseña'
                                value={this.state.password}
                                render={props =>
                                    <PasswordInput
                                        {... props}
                                        onClick={() => this.setState({
                                            showPassword: !this.state.showPassword
                                        })}
                                    />
                                }
                                secureTextEntry={this.state.showPassword}
                                returnKeyType={'done'}
                                autoCapitalize='none'
                                textContentType='password'
                                onChangeText={password => this.setState({ password })}
                                underlineColor='transparent'
                            />  
                        </View>
                        <CustomButton
                            loading={this.state.isLoading}
                            contentStyle={{height: 45}}
                            title='Entrar'
                            fontSize={16}
                            onPress={() => {
                                console.log('ONPRESSME');
                                if(this.state.isLoading===false)
                                    this.validaCampos();
                            }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <AwesomeAlert
                titleStyle={SharedStyles.titleStyle}
                messageStyle={SharedStyles.messageStyle}
                confirmButtonStyle={SharedStyles.confirmButtonTextStyle}
                show={this.state.showAlert}
                title={this.state.title}
                message={this.state.message}
                showConfirmButton={true}
                confirmText='Ocultar'
                closeOnHardwareBackPress={false}
                confirmButtonColor={Colors.title}
                onConfirmPressed={() => {
                    this.setState({
                        showAlert: false,
                        isLoading: false
                    })
                }}
                onDismiss={() => { this.setState({
                        isLoading: false,
                        showAlert: false
                    }) 
                }}
            />
        </View>
      );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    image: {
        height: 135,
        width: 125,
    },
    imageContainer: {
        backgroundColor: 'white',
        height: 205,
        width: 195,
        padding: 35,
        borderRadius: 15,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowRadius: 3,
                shadowOffset: { height: 5 },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 5,
            },
        })
    },
    logoContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: (Layout.window.height*3/7)-20,
        width: Layout.window.width

    },
     formContainer: {
        height: Layout.window.height * 4 / 7,
        width: Layout.window.width,
        padding: 20,
    },
    showPasswordContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    showPasswordText: { 
        color: Colors.subtitle, 
        fontSize: 14, 
        marginRight: 10 
    },

  });


  // publicacion en iOS poner SafaAreaView y en android View. 
  /* 
   <TouchableOpacity
                        style={{alignItems: 'flex-end', marginTop: 10}}
                        onPress={() => this.setState({
                            showPassword: !this.state.showPassword
                        })}>
                                  { this.state.showPassword == true ? <View style={styles.showPasswordContainer}>
                                  <AvenirMedium style={styles.showPasswordText}>Ver contraseña</AvenirMedium>
                                  <Icon
                                      name='md-eye-off'
                                      type='ionicon'
                                      color={Colors.title}
                                      /></View> : <View style={styles.showPasswordContainer}>
                                          <AvenirMedium style={styles.showPasswordText}>Ocultar contraseña</AvenirMedium>
                                          <Icon
                                              name='md-eye'
                                              type='ionicon'
                                              color={Colors.title}
                                          /></View> }
                        </TouchableOpacity> */