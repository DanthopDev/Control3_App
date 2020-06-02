import React, { Component } from 'react';
import { View, Alert, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import { AvenirHeavy, AvenirBook } from './StyledText';

export default class ProyectoName extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { title } = this.props;
        return (
            <TouchableOpacity
            onPress = { this.props.onPress }
            style={styles.container}>
                <AvenirHeavy style={{ fontSize: 16 }}>
                    {title}
                </AvenirHeavy>
                <Icon
                    name='right'
                    type='antdesign'
                    color={Colors.primary}
                    size={22}
            />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        borderRadius: 5,
        padding: 15,
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