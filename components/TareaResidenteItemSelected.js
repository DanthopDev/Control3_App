import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import { AvenirHeavy, AvenirMedium } from '../components/StyledText';
import Layout from '../constants/Layout';

export default class TareaResidenteItemSelected extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            isSelected: false,
            importe: '',
            onPress: false
        };
    }

    render() {
        const { item } = this.props;
        return (
                <View style={styles.container}>
                    <View style={{width: '90%'}}>
                        <AvenirHeavy style={{ fontSize: 14 }}>
                            {item.name}
                        </AvenirHeavy>
                        <AvenirMedium style={{ fontSize: 12, color: Colors.subtitle}}>
                            {item.descripcion}               
                        </AvenirMedium>
                    </View>
                    <TouchableOpacity
                        style={{ width: '10%', justifyContent: 'center', alignItems: 'flex-end' }}
                        onPress={() => {
                            this.props.finalizarTarea(true, 'Confirmación', '¿Estas seguro de que quieres finalizar la tarea?',item.id);
                        }}>
                            <Icon
                                name='check-circle'
                                type='font-awesome'
                                color={Colors.subtitle}
                                size={22}
                                />
                    </TouchableOpacity>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Layout.window.width-40,
        margin: 20,
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 10,
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
})