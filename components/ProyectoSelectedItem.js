import React, { Component } from 'react';
import { View, Alert, TextInput, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import { AvenirHeavy, AvenirBook } from '../components/StyledText';

export default class ProyectoSelectedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isSelected: false,
        importe: '',
        onPress: false
    };
  }

  render() {
      const { item }=this.props;
    return (
        <View style={styles.container}>
            <View>
                <AvenirHeavy style={{ fontSize: 12 }}>
                    {item.nombre}
                </AvenirHeavy>
                <TextInput
                    style={{ width: 60, borderBottomColor: 'gray', borderBottomWidth: 1, fontSize: 12, fontFamily: 'avenir-book' }}
                    onChangeText={(importe) => { 
                        let expresion = /^\d*\.?\d*$/;
                        if (expresion.test(importe)) {
                            this.setState({
                                importe
                            })
                        }
                    }}
                    placeholder='Importe'
                    keyboardType='numeric'
                    placeholderTextColor={Colors.subtitle}
                    value={this.state.importe}
                    editable={!this.state.isSelected}
                />
                { this.state.importe=='' && this.state.onPress ? <AvenirBook style={{color: 'red', fontSize: 12}}>Ingrese importe</AvenirBook> : null}
            </View>
                <TouchableOpacity 
                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}} 
                    onPress={() => {
                        this.setState({
                            onPress: true
                        })
                        if(this.state.importe!=''){
                            this.props.addProyectos(item.id, this.state.importe, !this.state.isSelected);
                            this.setState({ isSelected: !this.state.isSelected });
                        }
                    }}>
                    {
                        this.state.isSelected === true ? <Icon
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
        flex: 1, 
        flexDirection: 'row',
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