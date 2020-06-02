//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, FlatList, KeyboardAvoidingView, Alert} from 'react-native';
import Colors from '../../constants/Colors';
import { HeaderGrayBack } from '../../components/Headers';
import { AvenirBook, AvenirHeavy } from '../../components/StyledText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import MaterialElement from './MaterialElement';
import { List } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';
import SharedStyles from '../../constants/SharedStyles';
import { Dropdown } from 'react-native-material-dropdown';
import URLBase from '../../constants/URLBase';
// create a component
class AddMaterialScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            showAlert: false,
            errorCantidad: false,
            materialesList: [],
            cantidad: '',
            categoria: '', 
            errorCategoria: false,
            materiales: []
        }
    }
    static navigationOptions = () => ({
        header: null,
    });
    componentDidMount() {
        this.getMateriales();
    }
    quitMaterial(id){
        console.log('ID DE MATERIAL', id);
        let filterMateriales=this.state.materialesList;
        let nuevosMateriales=filterMateriales.filter((element) => element.id!=id);
        this.setState({
            materialesList: nuevosMateriales
        });
    }
    addMaterial = async () => {
        const { accessInfo } = this.props.screenProps;
        var formData = new FormData();
        const { categoria, cantidad } = this.state;
        const { idProyecto } = this.props.navigation.state.params
        formData.append('id', categoria);
        formData.append('proyecto', idProyecto);
        formData.append('cantidad', cantidad);
        fetch(URLBase + '/alm/agregarMateriales', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('******************** ADD MATERIAL ***********');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    let agregado=responseJson.materiales;
                    const { materialesList } = this.state;
                    materialesList.push({ id: agregado.id, name: agregado.name, cant: agregado.cantidad })
                    this.setState({
                        showAlert: false,
                        categoria:'',
                        cantidad: '',
                        materialesList: materialesList
                    })
                } else {
                    Alert.alert('Error al consultar la informacion')
                }
            })
            .catch((error) => {
                Alert.alert('Error', error);
                console.error(error);
            });
    }
    getMateriales = async () => {
        const { accessInfo } = this.props.screenProps;
        console.log('Token', accessInfo);
        fetch(URLBase + '/alm/getMateriales', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('**************GET Materiales******************');
                console.log(responseJson);
                if (responseJson.success && responseJson.success=='200') {
                   let materiales= responseJson.materiales;
                   let newMateriales=[]
                   materiales.forEach(element => {
                       newMateriales.push({ id: element.id, value: element.name })
                   });
                   this.setState({
                       materiales: newMateriales
                   });
                } else {
                }
            })
            .catch((error) => {
                Alert.alert('Error al consultar los datos');
                console.error(error);
            });
    }

    validaForm() {
        const { cantidad, categoria }=this.state;
        if(categoria==''){
            this.setState({
                errorCategoria: true
            });
        }else if(cantidad ==''){
            this.setState({
                errorCantidad: true
            })
        }else {
            this.addMaterial();
        }
    }
    _keyExtractor = (item, index) => item.id.toString();
    render() {
        const { accessInfo } = this.props.screenProps;
        return (
            <View style={SharedStyles.container}>
                <View style={SharedStyles.container}>
                    <HeaderGrayBack
                        title={'Materiales'}
                        action={() => {
                            this.props.navigation.goBack();
                            this.props.navigation.state.params.getAlmacenes();
                        }}
                    />
                    <View style={{ flex: 1, width: '100%' }}>
                        <List.Section>
                            <FlatList
                                data={this.state.materialesList}
                                style={{ height: '100%', width: '100%' }}
                                renderItem={({item}) => <MaterialElement quitMaterial={this.quitMaterial.bind(this)} item={item} access_token={accessInfo.access_token}/>}
                                keyExtractor={this._keyExtractor}
                                ListFooterComponent={<View style={{height: 130}}></View>}
                            />
                        </List.Section>
                    </View>
                    <CustomButton
                        title='Añadir'
                        onPress={() => this.setState({ showAlert: true })}
                        style={{ marginHorizontal: 20, marginBottom: 30 }} />
                </View>
                <AwesomeAlert
                    confirmButtonTextStyle={SharedStyles.confirmButtonTextStyle}
                    show={this.state.showAlert}
                    closeOnTouchOutside={false}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText='Confirmar'
                    cancelText='Cancelar'
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onConfirmPressed={() => {
                        this.validaForm();
                    }}
                    onDismiss={() => {
                    }}
                    customView={<View>
                        <Dropdown
                            overlayStyle={{ margin: 0, padding: 0 }}
                            fontSize={14}
                            value={this.state.categoria}
                            itemTextStyle={{ fontFamily: 'avenir-medium' }}
                            label='Material'
                            baseColor={Colors.title}
                            textColor={Colors.title}
                            data={this.state.materiales}
                            onChangeText={(value, index) => {
                                this.setState({
                                    categoria: this.state.materiales[index].id,
                                    errorCategoria: false,
                                });
                            }}

                        />
                        {this.state.errorCategoria == true ? <AvenirBook style={styles.error}>Ingrese un Material</AvenirBook> : null}
                        <View style={{height: 20}}></View>
                        <CustomInput
                            style={{ fontFamily: 'avenir-book', borderRadius: 0, backgroundColor: Colors.white, height: 55, width: 250}}
                            error={this.state.errorCantidad}
                            label='Cantidad'
                            keyboardType={'numeric'}
                            value={this.state.cantidad}
                            returnKeyType={'done'}
                            onChangeText={cantidad => {
                                let expresion = /^\d*\.?\d*$/;
                                if (expresion.test(cantidad)) {
                                    this.setState({
                                        cantidad,
                                        errorCantidad: false
                                    })
                                }
                            }}
                            underlineColor={Colors.divisor}
                        />
                        {this.state.errorCantidad == true ? <AvenirBook style={styles.error}>Ingrese una cantidad</AvenirBook> : null}
                    </View>}
                />
            </View>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 10
    },
});

//make this component available to the app
export default AddMaterialScreen;
