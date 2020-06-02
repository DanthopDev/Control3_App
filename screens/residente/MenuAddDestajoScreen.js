import React, { Component } from 'react';
import { View, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Header, Icon} from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy } from '../../components/StyledText';
import { HeaderGrayBack } from '../../components/Headers';

export default class MenuDestajoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            lista : [
                {key:0, nombre:"Destajos"}, 
                {key:1, nombre:"Otros gastos"},
            ],  
        };
    }

    componentDidMount() {
    }

    render() {
        const {idProyecto, accessInfo, getGastos} = this.props.navigation.state.params; 
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title = "Selecciona uno"
                    action = {() => {
                        this.props.navigation.goBack();
                    }}
                />
                <View style={{height:'15%'}}/>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.optionCantainer}
                        onPress={() => {
                            this.props.navigation.navigate('AddDestajo', {
                                idProyecto: idProyecto, 
                                accessInfo: accessInfo,
                                getGastos: getGastos,
                                categoria: 'Destajos',
                            });
                        }}
                    > 
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imageStyle}
                                source={require('../../assets/images/gastos.png')}
                                resizeMode='contain'
                            />
                            <AvenirHeavy style={styles.textStyle}>
                                {this.state.lista[0].nombre}
                            </AvenirHeavy>
                        </View>
                    </TouchableOpacity>
                    <View style={{height:'5%'}}/>
                    <TouchableOpacity
                        style={styles.optionCantainer}
                        onPress={() => {
                            this.props.navigation.navigate('AddDestajo', {
                                idProyecto: idProyecto, 
                                accessInfo: accessInfo,
                                getGastos: getGastos,
                                categoria: 'Otros gastos',
                            });
                        }}
                    >
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.imageStyle}
                                source={require('../../assets/images/gastos.png')}
                                resizeMode='contain'
                            />
                            <AvenirHeavy style={styles.textStyle}>
                                {this.state.lista[1].nombre}
                            </AvenirHeavy>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        padding: 20 
    },
    imageContainer: {
        width: 130, 
        height: 130, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    imageStyle: { 
        width: 45, 
        height: 45, 
        marginBottom: 10 
    },
    optionCantainer: { 
        backgroundColor: Colors.primary, 
        borderRadius: 10,
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
    },
    textStyle: { 
        fontSize: 14, 
        textAlign: 'center'
    }
});