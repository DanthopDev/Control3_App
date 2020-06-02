import React, { Component } from 'react';
import { View, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Header, Icon} from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { AvenirHeavy } from '../../components/StyledText';
import { HeaderGrayBack } from '../../components/Headers';

export default class CraerPlaneacionScreen extends Component {
  constructor(props) {
    super(props);
      const { params } = this.props.navigation.state;
    this.state = {
        hitos: params.hitos
    };
  }

    componentWillUnmount() {
        this.props.navigation.state.params.getProyectoInfo();
    }
    
  updateHitos(hitos) {
      this.setState({
          hitos
      });
  }
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={SharedStyles.container}>
            <HeaderGrayBack
                title='Planeación'
                action={() => {
                    this.props.navigation.state.params.getProyectoInfo();
                    this.props.navigation.goBack();
        }}
    />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.optionCantainer}
                    onPress={() => {
                        this.props.navigation.navigate('PlanearGastos', {
                            presupuesto: params.presupuesto,
                            categorias: params.categorias,
                            idProyecto: params.idProyecto
                        });
                    }}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../assets/images/gastos.png')}
                            resizeMode='contain'
                        />
                        <AvenirHeavy style={styles.textStyle}>
                            Gastos
                        </AvenirHeavy>
                    </View>
                </TouchableOpacity>
                <View style={{height: '5%'}}/>
                <TouchableOpacity
                    style={styles.optionCantainer}
                    onPress={() => {
                        this.props.navigation.navigate('Hitos', {
                        idProyecto: params.idProyecto,
                        hitos: params.hitos,
                        updateHitos: this.updateHitos.bind(this),
                        progressAvance: params.progressAvance,
                        terminoReal: params.terminoReal
                    });
                    }} >
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../assets/images/hitos.png')}
                            resizeMode='contain'
                        />
                        <AvenirHeavy style={styles.textStyle}>
                            Hitos
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