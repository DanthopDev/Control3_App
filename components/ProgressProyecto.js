import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { AvenirHeavy, AvenirMedium} from '../components/StyledText';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../constants/Layout';

export default class ProgressProyecto extends Component {
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
        const barWidth = Layout.window.width - 60;
        return (
            <TouchableOpacity
            onPress={() => {
                this.props.navigation.navigate('DetalleProyecto',{ title: item.nombre, id: item.id, avance: item.progreso, foto: item.foto, update: () => this.props.updateProyectos()})
            }} 
            style={styles.container}
            >
                <AvenirHeavy style={{ fontSize: 14, marginBottom: 10}}> {item.nombre} ></AvenirHeavy>
                <View style={SharedStyles.progressBarBackground}>
                    <ProgressBarAnimated
                        height={10}
                        width={barWidth}
                        value={parseFloat(item.progreso)> 100 ? 100 : parseFloat(item.progreso)}
                        backgroundColor={Colors.primary}
                        borderRadius={10}
                        borderWidth={0}
                    />
                </View>
                <AvenirMedium style={SharedStyles.textProgress}> {parseFloat(item.progreso).toFixed(2)} % </AvenirMedium>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        margin: 20,
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