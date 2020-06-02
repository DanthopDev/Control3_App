import React, { Component } from 'react';
import { View, Alert, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import { AvenirHeavy, AvenirBook } from './StyledText';

export default class ReporteItemCheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { title } = this.props;
        return (
            <View style={styles.container}>
                    <AvenirHeavy style={{ fontSize: 14 }}>
                        {title}
                    </AvenirHeavy>
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}
                    onPress={this.props.onPress}>
                    {
                        this.props.checked === true ? <Icon
                            name='check-circle'
                            type='material-community'
                            color={Colors.primary}
                            size={22}
                        /> : <Icon
                                name='circle'
                                type='font-awesome'
                                color={Colors.subtitle}
                                size={22}
                            />
                    }
                </TouchableOpacity>
            </View>
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
        paddingVertical: 10,
        paddingHorizontal: 20,
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