import React from 'react';
import { View, AsyncStorage } from 'react-native';
import Colors from '../../constants/Colors';
import AwesomeAlert from 'react-native-awesome-alerts';
import SharedStyle from '../../constants/SharedStyles';

export default class LogOutScreen extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
  }
  state={
    showAlert: true
  }
  async logout() {
    try {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
  _signOutAsync = async () => {
    try {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  };
  static navigationOptions = {
    header: null
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <View style={{flex: 1, backgroundColor: Colors.background}}>
      <AwesomeAlert
        titleStyle={SharedStyle.titleStyle}
        messageStyle={SharedStyle.messageStyle}
        confirmButtonTextStyle={SharedStyle.confirmButtonTextStyle}
        show={this.state.showAlert}
        title={'Cerrar sesión'}
        message={'¿Estás seguro de salir de Control 3?'}
        closeOnTouchOutside={false}
        showConfirmButton={true}
        confirmText='Confirmar'
        closeOnHardwareBackPress={false}
        confirmButtonColor={Colors.primary}
        onConfirmPressed={() => {
          this.setState({
            showAlert: false
          });
        }}
        onDismiss={() => {
          this.props.screenProps.userLogOut();
        }}
      />
    </View>;
  }
}
