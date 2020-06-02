import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoadingDataDirectorScreen from '../screens/director/LoadingDataDirectorScreen';
import LoadingDataResidenteScreen from '../screens/residente/LoadingDataResidenteScreen';
import LoadingDataAlmScreen from '../screens/almacenista/LoadingDataAlmScreen';
 
const AuthStack = createStackNavigator({ SignIn: SignInScreen});
 
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Almacenista: LoadingDataAlmScreen,
    Director: LoadingDataDirectorScreen,
    Residente: LoadingDataResidenteScreen
  },
  {
    initialRouteName: 'AuthLoading',
  }
));