import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import Colors from '../../constants/Colors';
import { AvenirBlack, AvenirMedium, AvenirHeavy, AvenirBook } from '../../components/StyledText';
import CustomButton from '../../components/CustomButton';
import { HeaderGrayBack } from '../../components/Headers';
import URLBase from '../../constants/URLBase';
import { Title } from 'react-native-paper';

export default class DetalleAlmacenScreen extends React.Component {
  constructor(props){
    super(props);

    const { title } = this.props.navigation.state.params;

    this.state={
      isLoading: true,
      title: title,
    }
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount(){
    this.getAlmacenes();
  }

  getAlmacenes = async () => {
    this.setState({
      isLoading: true
    });
    var formData = new FormData();
    const { idProyecto } = this.props.navigation.state.params;
    const { accessInfo } = this.props.screenProps;
    
    formData.append('id', idProyecto);
    fetch(URLBase + '/alm/getAlmacenes', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessInfo.access_token,
        Accept: 'application/json',
      },
      body: formData
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('************************* VALOR DEL JSON Traer almacenes *********************');
        console.log(responseJson);
        if (responseJson.success && responseJson.success == '200') {
          this.setState({
            isLoading: false,
            herramientas: responseJson.herramientas,
            materiales: responseJson.materiales,
            vehiculos: responseJson.vehiculos,
          });
        } else {
          Alert.alert('Error', 'No se han podido crear el nuevo Obrero');
        }
      })
      .catch((error) => {
        Alert.alert('Error ', JSON.stringify(error));
        console.error(error);
      });
  }

  _keyExtractor = (item, index) => item.id.toString();

  _renderItemMaterial = ({ item }) => (
    <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
        <AvenirMedium style={styles.textGrayName}>
          { item.name }
        </AvenirMedium>
        <AvenirMedium style={styles.textGray}>
          { item.cantidad }
        </AvenirMedium>
        <AvenirMedium style={styles.textGray}>
          { item.unidad }
        </AvenirMedium>
    </View>
  );

  _renderItemHerramienta = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('DetalleHerramienta', { 
        getAlmacenes:  this.getAlmacenes.bind(this), 
        title: item.name,
        idProyecto: this.props.navigation.state.params.idProyecto, 
        idHerramienta: item.id, 
        cantidad: item.cantidad })} 
      style={{ flexDirection: 'row', paddingVertical: 3 }}>
      <AvenirMedium style={styles.textGrayName}>
        {item.name}
      </AvenirMedium>
      <AvenirMedium style={styles.textGray}>
        {item.marca}
      </AvenirMedium>
      <AvenirMedium style={styles.textGray}>
        {item.cantidad}
      </AvenirMedium>
    </TouchableOpacity>
  );

  _renderItemVehiculo = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('DetalleVehiculo', {
        getAlmacenes: this.getAlmacenes.bind(this), 
        title: item.name,
        cantidad: item.cantidad,
        idProyecto: this.props.navigation.state.params.idProyecto, 
        idVehiculo: item.id 
        })} 
      style={{ flexDirection: 'row', paddingVertical: 3 }}>
      <AvenirMedium style={styles.textGrayName}>
        {item.name}
      </AvenirMedium>
      <AvenirMedium style={styles.textGray}>
        {item.marca}
      </AvenirMedium>
      <AvenirMedium style={styles.textGray}>
        {item.placas == null ? '-----': item.placas}
      </AvenirMedium>
    </TouchableOpacity>
  );

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={styles.container}>
          <HeaderGrayBack
            title={'Almacén ' + this.state.title}
            action={() => {
              this.props.navigation.goBack();
            }}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </View>
      );
    } else {
        return (
          <View style={styles.container}>
            <HeaderGrayBack
              title={'Almacén ' + this.state.title}
              action={() => {
                this.props.navigation.goBack();
              }}
            />
            <View style={styles.box1}>
              <AvenirHeavy style={{textAlign: 'center', fontSize: 16,marginBottom: 10}}>
                Materiales
              </AvenirHeavy>
              <ScrollView style={styles.table1}>
                  <FlatList
                    ListHeaderComponent={
                      <View>
                        <View style={styles.tableHeader}>
                          <AvenirHeavy style={styles.textName}>Material</AvenirHeavy>
                          <AvenirHeavy style={styles.text}>Cantidad</AvenirHeavy>
                          <AvenirHeavy style={styles.text}>Unidad</AvenirHeavy>
                        </View>
                        <View style={{ height: 1, backgroundColor: Colors.divisor }}></View>
                      </View>
                    }
                    ListFooterComponent={<View style={{height: 15}}/>}
                    data={this.state.materiales}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.divisor }}></View> }
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItemMaterial}
                  />
                { this.state.materiales.length==0 ? <AvenirBook style={{textAlign: 'center'}}>
                  Sin materiales
                </AvenirBook> : null }
              </ScrollView>
                <CustomButton
                  title='Recibir material  >'
                  fontSize={16}
                  onPress={() => this.props.navigation.navigate('AddMaterial', {
                    idProyecto: this.props.navigation.state.params.idProyecto,
                    getAlmacenes: this.getAlmacenes.bind(this)})} />
            </View>
            <View style={styles.box2}>
              <AvenirHeavy style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                Herramientas de uso
              </AvenirHeavy>
              <ScrollView style={styles.table2}>
                <FlatList
                  ListHeaderComponent={
                    <View>
                      <View style={styles.tableHeader}>
                        <AvenirHeavy style={styles.textName}>Herramienta</AvenirHeavy>
                        <AvenirHeavy style={styles.text}>Marca</AvenirHeavy>
                        <AvenirHeavy style={styles.text}>Cantidad</AvenirHeavy>
                      </View>
                      <View style={{ height: 1, backgroundColor: Colors.divisor }}></View>
                    </View>
                  }
                  ListFooterComponent={<View style={{ height: 15 }} />}
                  data={this.state.herramientas}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.divisor }}></View>}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItemHerramienta}
                />
                {this.state.herramientas.length == 0 ? <AvenirBook style={{ textAlign: 'center' }}>
                  Sin herramientas
                </AvenirBook> : null}
              </ScrollView>
            </View>
            <View style={styles.box3}>
              <AvenirHeavy style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
                Vehículos de uso
              </AvenirHeavy>
              <ScrollView style={styles.table3}>
                <FlatList
                  ListHeaderComponent={
                    <View>
                      <View style={styles.tableHeader}>
                        <AvenirHeavy style={styles.textName}>Vehículo</AvenirHeavy>
                        <AvenirHeavy style={styles.text}>Marca</AvenirHeavy>
                        <AvenirHeavy style={styles.text}>Número</AvenirHeavy>
                      </View>
                      <View style={{ height: 1, backgroundColor: Colors.divisor }}></View>
                    </View>
                  }
                  ListFooterComponent={<View style={{ height: 15 }} />}
                  data={this.state.vehiculos}
                  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.divisor }}></View>}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItemVehiculo}
                />
                {this.state.vehiculos.length == 0 ? <AvenirBook style={{ textAlign: 'center' }}>
                  Sin vehículos
                </AvenirBook> : null}
              </ScrollView>
            </View>
          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 12,
    width: '30%',
    textAlign: 'center'
  },
  textName: {
    fontSize: 12,
    width: '40%',
  },
  textGrayName: {
    fontSize: 12,
    color: Colors.subtitle,
    width: '40%'
  },
  textGray: {
    fontSize: 12,
    color: Colors.subtitle,
    width: '30%',
    textAlign: 'center'
  },
  tableHeader: { 
    flexDirection: 'row', 
    paddingVertical: 3 
  },
  table1: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    height: 80,
    marginBottom: 15,
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
  table2: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginBottom: 15,
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
  box1: {
    flex: 3,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: Colors.divisor,
    borderBottomWidth: 1
  },
  box2: {
    flex: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: Colors.divisor,
    borderBottomWidth: 1
  },
  box3: {
    flex: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  table3: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginBottom: 15,
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
  }
});
