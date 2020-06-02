import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Colors from '../constants/Colors';

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
         {...this.props}
            /> 
            <TouchableOpacity
                onPress={this.props.onClick}> 
                {this.props.secureTextEntry == true ? 
                <Icon
                    name='md-eye-off'
                    type='ionicon'
                    color={Colors.title}
                /> : 
                    <Icon
                        name='md-eye'
                        type='ionicon'
                        color={Colors.title}
                    />}
            </TouchableOpacity>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20
    }
});
export default PasswordInput;
