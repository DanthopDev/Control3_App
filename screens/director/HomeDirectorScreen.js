import React, { Component } from 'react';
import { View, FlatList, ScrollView,TouchableOpacity, StatusBar, StyleSheet, ActivityIndicator, RefreshControl} from 'react-native';
import { Header, Divider, ListItem } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Layout from '../../constants/Layout';
import { AvenirHeavy, AvenirMedium, } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import { HeaderBlackMenu } from '../../components/Headers';
import ObteniendoInformacion from '../../components/ObteniendoInformacion';

export default class HomeDirectorScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    isLoading: true,
    progressAvancesGeneral: 0,
    progressCobrosGeneral: 0,
    progressGastosGeneral: 0,
    progressWithOnComplete: 0,
    progressCustomized: 0
  }

  componentDidMount() {
    /*console.log('***************** PROPIEDDADES DEL HOME *********');
    console.log(this.props); */
  }

  increase = (key, value) => {
    this.setState({
      [key]: this.state[key] + value,
    });
  } 
  
  _keyExtractor = (item, index) => item.id.toString();

  _renderItem = ({ item }) => (
    <ListItem
      rightElement={
      <TouchableOpacity onPress={() => {
        this.props.navigation.navigate('DetalleProyecto', {
          title: item.nombre,
          id: item.id,
          avance: item.progreso,
          accessInfo: this.props.screenProps.accessInfo})
        }}>
        <AvenirMedium style={{fontSize:13}}>Ver más</AvenirMedium>
      </TouchableOpacity>}
      containerStyle={SharedStyles.itemProyectoContainer}
      title={item.nombre}
      titleStyle={SharedStyles.itemDescriptionText}
      chevron={{ color: Colors.title }}
    />
  );

  _onRefresh = () => {
    this.props.screenProps.getInfoDirector();
  }

  render() {
    const barWidth=Layout.window.width -60;
    return (
        <View style={SharedStyles.container}>
        <HeaderBlackMenu
          action={ () => this.props.navigation.openDrawer()}
          title='Director'
        />
        { this.props.screenProps.isLoading == true ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ObteniendoInformacion/>
            </View> : <ScrollView 
            style={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={this.props.screenProps.refreshing}
                onRefresh={this._onRefresh}
              />
            } >
            <View style={styles.container}>
              <View style={SharedStyles.progresosContainer}>
                <View style={SharedStyles.progressBarContainer}>
                  <AvenirHeavy style={SharedStyles.progressTitle}>
                    Avances
                  </AvenirHeavy>
                  <View style={SharedStyles.progressBarBackground}>
                    <ProgressBarAnimated
                      height={10}
                      width={barWidth}
                      value={this.props.screenProps.progressAvancesGeneral > 100 ? 100 : this.props.screenProps.progressAvancesGeneral}
                      backgroundColor={Colors.progressBar1}
                      borderRadius={10}
                      borderWidth={0}
                    />
                  </View>
                  <AvenirMedium style={SharedStyles.textProgress}>
                     {this.props.screenProps.progressAvancesGeneral} %
                  </AvenirMedium>
                </View>
                <View style={SharedStyles.progressBarContainer}>
                  <AvenirHeavy style={SharedStyles.progressTitle}>
                    Gastos
                    </AvenirHeavy>
                  <View style={SharedStyles.progressBarBackground}>
                    <ProgressBarAnimated
                      height={10}
                      width={barWidth}
                      value={this.props.screenProps.progressGastosGeneral > 100 ? 100 : this.props.screenProps.progressGastosGeneral }
                      backgroundColor={Colors.progressBar3}
                      borderWidth={0}
                    />
                  </View>
                  <AvenirMedium style={SharedStyles.textProgress}>
                     {this.props.screenProps.progressGastosGeneral} %
                  </AvenirMedium>
                </View>
                <View style={SharedStyles.progressBarContainer}>
                  <AvenirHeavy style={SharedStyles.progressTitle}>
                    Cobros
                      </AvenirHeavy>
                  <View style={SharedStyles.progressBarBackground}>
                    <ProgressBarAnimated
                      height={10}
                      width={barWidth}
                      value={this.props.screenProps.progressCobrosGeneral > 100 ? 100 : this.props.screenProps.progressCobrosGeneral}
                      backgroundColor={Colors.progressBar2}
                      borderRadius={10}
                      borderWidth={0}
                    />
                  </View>
                  <AvenirMedium style={SharedStyles.textProgress}>
                   {this.props.screenProps.progressCobrosGeneral} %
                  </AvenirMedium>
                </View>
              </View>
              <CustomButton
                style={{ marginTop: 20 }}
                title='Crear Proyecto Nuevo  >'
                fontSize={14}
                onPress={() => {
                  this.props.navigation.navigate('CrearProyecto');
                }} />
              <CustomButton
                style={{ marginTop: 15 }}
                title='Generar Reporte  >'
                fontSize={14}
                onPress={() => {
                  this.props.navigation.navigate('CrearReporte');
                }} />
            </View>
            <Divider style={styles.divisorStyle} />
            <View style={styles.footerContainer}>
              <AvenirHeavy style={styles.titleProyectos}>
                Proyectos Activos
              </AvenirHeavy>
              {this.props.screenProps.proyectos.length == 0 ? <AvenirMedium style={styles.message}>
                Sin proyectos activos
                    </AvenirMedium> : null
              }
              <FlatList
                data={this.props.screenProps.proyectos}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListFooterComponent={() => <View style={{ height: 20 }} />}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
              />
            </View>
            </ScrollView>
          }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  divisorStyle: {
    backgroundColor: Colors.divisor
  },
  footerContainer: {
    flex: 1
  },
  titleProyectos: {
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 14
  },
  message: {
    margin: 20,
    color: Colors.subtitle
  },
});
