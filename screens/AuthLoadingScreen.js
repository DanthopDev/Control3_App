import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Platform
} from 'react-native';
import Colors from '../constants/Colors';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const info = await AsyncStorage.getItem('userInfo');
    let userInfo= JSON.parse(info);
    
    if (userInfo != null) {
      if(userInfo.user.rol === '2') {
        console.log('DIRECTOR');
        this.props.navigation.navigate('Director', { userInfo: userInfo });
      } else if (userInfo.user.rol === '4') {
        console.log('RESIDENTE');
        //console.log(userInfo);
        this.props.navigation.navigate('Residente', { userInfo: userInfo });
      } else if (userInfo.user.rol === '5') {
        console.log('ALMACENISTA');
        this.props.navigation.navigate('Almacenista', { userInfo: userInfo });
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
}