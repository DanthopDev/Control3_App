import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import MainNavigator from './navigation/MainNavigator';
import Colors from './constants/Colors';
import FlashMessage from "react-native-flash-message";
 
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar 
          backgroundColor='rgba(0,0,0,0.3)'
          translucent={true} 
          barStyle="light-content" />
          <MainNavigator />
          <FlashMessage position="top" animated={true} />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/gastos.png'),
        require('./assets/images/hitos.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'avenir-black': require('./assets/fonts/AvenirLTStd-Black.otf'),
        'avenir-blackoblique': require('./assets/fonts/AvenirLTStd-BlackOblique.otf'),
        'avenir-book': require('./assets/fonts/AvenirLTStd-Book.otf'),
        'avenir-heavy': require('./assets/fonts/AvenirLTStd-Heavy.otf'),
        'avenir-medium': require('./assets/fonts/AvenirLTStd-Medium.otf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
});
