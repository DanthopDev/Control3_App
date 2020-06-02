import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { AvenirMedium } from './StyledText';

export default class ObteniendoInformacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AvenirMedium
                style={{
                    color: Colors.subtitle,
                    fontSize: 16,
                    marginBottom: 20,
                }}> Obteniendo información...</AvenirMedium>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
  }
}
