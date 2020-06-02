import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import Layout from '../../constants/Layout';
import { AvenirHeavy, AvenirBook } from '../../components/StyledText';
import { Header } from 'react-native-elements';
import URLImage from '../../constants/URLImage';

const margen=(Layout.window.width/2)- 60;

export default class PerfilScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
   
    const { accessInfo }=this.props.screenProps; 
    return (
      <View style={SharedStyles.container}>
        <Header
          backgroundColor={Colors.background}
          centerComponent={{ text:  'Perfil', style: { color: Colors.title, fontFamily: 'avenir-heavy', fontSize: 18 } }}
        />
        <View>
          <View style={styles.container}>
            <View style={styles.descripcionContainer}>
              <AvenirHeavy style={styles.text}>
                Nombre
              </AvenirHeavy>
              <AvenirBook style={styles.text}>
                { accessInfo.user.name } {accessInfo.user.last_name}
              </AvenirBook>
            </View>
              <View style={styles.descripcionContainer}>
                <AvenirHeavy style={styles.text}>
                  Correo
                </AvenirHeavy>
                <AvenirBook style={styles.text}>
                  {accessInfo.user.email} 
                </AvenirBook>
              </View>
              <View style={styles.descripcionContainer}>
                <AvenirHeavy style={styles.text}>
                  Empresa
                </AvenirHeavy>
                <AvenirBook style={styles.text}>
                  { accessInfo.user.empresa.name }
                </AvenirBook>
              </View>
              <View style={styles.descripcionContainer}>
                <AvenirHeavy style={styles.text}>
                  Rol
                </AvenirHeavy>
                <AvenirBook style={styles.text}>
                  Almacenista
                </AvenirBook>
              </View>
            </View>
          {accessInfo.user.foto == '' || accessInfo.user.foto == null || accessInfo.user.foto == 'default.jpg' ? <Image
            source={require('../../assets/images/profile.png')}
            style={styles.imageStyle} /> : <Image
              source={{
                uri: URLImage + accessInfo.user.foto,
              }}
              style={styles.imageStyle} /> }
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingTop: 90,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginTop: 100,
    backgroundColor: '#ffff',
    borderBottomWidth: 15,
    borderBottomColor: Colors.title,
    marginHorizontal: 20,
  },
  descripcionContainer: { 
    marginBottom: 20 
  },
  text: { 
    fontSize: 14 
  },
  imageStyle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 10,
    top: 40,
    right: margen
  }
});
