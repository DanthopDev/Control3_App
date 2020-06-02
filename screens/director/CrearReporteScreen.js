import React, { Component } from 'react';
import { View, Alert, FlatList, StyleSheet, Platform, Linking,TouchableOpacity} from 'react-native';
import { AvenirMedium } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import { MultiPickerMaterialDialog } from 'react-native-material-dialog';
import URLBase from '../../constants/URLBase';
import { HeaderGrayMenu } from '../../components/Headers';
import ProyectoName from '../../components/ProyectoName';
const SHORT_LIST = ['Hitos Pendientes', 'Hitos Completados', 'Tareas', 'Solicitudes'];

export default class CrearReporteScreen extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.screenProps.proyectos)
    }
    state = {
        multiPickerVisible: false,
        multiPickerSelectedItems: [],
        selected: []
    }
    _keyExtractor = (item, index) => item.id.toString();

    _renderItem = ({ item }) => (
            <ProyectoName
                title={item.nombre}
                onPress={() => {
                    this.props.navigation.navigate('GenerarReporte', { idProyecto: item.id });
                }}
            />
        );
    render() {
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayMenu
                    title='Reportes'
                    action={() => this.props.navigation.openDrawer()}
                />
                {this.props.screenProps.proyectos.length == 0 ? <AvenirMedium style={styles.message}>
                    Sin proyectos activos
                    </AvenirMedium> : null
                }
                <FlatList
                    data={this.props.screenProps.proyectos}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    ListHeaderComponent={() => <View style={{ height: 20 }} />}
                    ListFooterComponent={() => <View style={{ height: 20 }} />}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        margin: 20,
        color: Colors.subtitle
    },
    itemReporteContainer: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        borderRadius: 5,
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
});