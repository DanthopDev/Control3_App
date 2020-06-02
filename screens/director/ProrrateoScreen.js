import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { AvenirBook } from '../../components/StyledText';
import ProyectoSelectedItem from '../../components/ProyectoSelectedItem';
import URLBase from '../../constants/URLBase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { HeaderGrayMenu } from '../../components/Headers';

export default class ProrrateoScreen extends Component {
    constructor(props) {
        super(props);
        console.log('PROPIEDADES DE PRORRATEO: **************');
        console.log(this.props.screenProps.proyectos);
        this.state = {
            categoria: '',
            errorCategoria: false,
            clear: false,
            showAlert: false,
            proyectos: this.props.screenProps.proyectos,
            selectedProyects: []
        };
    }
    _addProyectos= (id, importe, selected) => {
        const {selectedProyects}=this.state;
       // console.log('id: ', id);
        if(selected==true){
                selectedProyects.push({ id: id, importe: importe});
                this.setState({
                    selectedProyects: selectedProyects
                })
        }else {
            let index = selectedProyects.findIndex( element => element.id==id);
            //console.log('Index: ', index);
            if(index!=-1){
             let newArrayProyects= selectedProyects.filter(proyecto => proyecto.id != selectedProyects[index].id);
             this.setState({
                 selectedProyects: newArrayProyects
             });
            } else {
                this.setState({
                    selectedProyects: selectedProyects
                })
            }
        }
    }
    createProrrateo = async () => {
        const { accessInfo }=this.props.screenProps;
        console.log('Acces Info: ', accessInfo);
        console.log('URLBase: ', URLBase);
        var formData = new FormData();
        formData.append('categoria', this.state.categoria);
        formData.append('proyectos', JSON.stringify(this.state.selectedProyects));
        fetch(URLBase + '/dir/createProrrateo', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessInfo.access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.success && responseJson.success=='200'){
                    this.setState({
                        showAlert: true,
                        title: 'Prorrateo',
                        message: 'El prorrateo ha sido repartido correctamente',
                        categoria: '',
                        clear: true
                    })
                }else {
                    Alert.alert('Error de acceso', 'Cierra sesión y vuelve a ingresar');
                }
                
            })
            .catch((error) => {
                Alert.alert('Error', error);
                console.error(error);
            });
    }
    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({ item }) => (
       <ProyectoSelectedItem item={item} addProyectos={this._addProyectos.bind(this)} />
    );
    render() {
        return (
            <View style={SharedStyles.container}>
                <KeyboardAvoidingView 
                    style={SharedStyles.container} 
                    behavior={Platform.OS === "ios" ? "padding" : null} enabled
                >
                    <HeaderGrayMenu
                        title='Prorrateo'
                        action={() => this.props.navigation.openDrawer()}
                    />
                    <View style={styles.container}>
                        <View style={{ marginBottom: 20, paddingHorizontal: 20, paddingTop: 20 }}>
                            <CustomInput
                                error={this.state.errorCategoria}
                                label='Categoría'
                                value={this.state.categoria}
                                returnKeyType={'done'}
                                onChangeText={categoria => {
                                    if(categoria!=''){
                                        this.setState({
                                            categoria,
                                            errorCategoria: false
                                        })
                                    } else {
                                        this.setState({ categoria });
                                    }
                                    }}
                                underlineColor='transparent'
                            />
                            {this.state.categoria == '' && this.state.errorCategoria==true ? <AvenirBook style={{ color: 'red', fontSize: 12 }}>Ingrese categoria</AvenirBook> : null}
                        </View>
                        <Divider style={styles.divisorStyle} />
                        <View style={styles.footerContainer}>
                            {this.state.clear == false ? <FlatList
                                data={this.props.screenProps.proyectos}
                                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                ListFooterComponent={() => <View style={{ height: 20 }} />}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                            /> : null
                        }
                            
                        </View>
                        <View style={{ padding: 20 }}>
                            <CustomButton
                                title='Registrar'
                                fontSize={14}
                                onPress={() => {
                                    if(this.state.categoria==''){
                                        this.setState({errorCategoria: true});
                                    }else {
                                        if(this.state.selectedProyects.length==0){
                                            this.setState({
                                                showAlert: true,
                                                errorCategoria: false,
                                                title: 'Seleccione Proyectos',
                                                message: 'Seleccione los proyectos a los que se les aplicara la categoría'
                                            });
                                        } else {
                                            this.setState({ errorCategoria: false });
                                            this.createProrrateo();
                                        }
                                        
                                    } 
                                }} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
                    closeOnHardwareBackPress={false}
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.title}
                    onCancelPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onConfirmPressed={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}
                    onDismiss={() => {
                        this.setState({
                            clear: false
                        })
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    divisorStyle: {
        backgroundColor: Colors.divisor
    },
    footerContainer: {
        flex: 1,
        marginTop: 20
    },
    titleProyectos: {
        marginBottom: 10,
        marginTop: 20,
        marginHorizontal: 20,
        fontSize: 14
    },
});