import React, { Component } from 'react';
import { View, Alert, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import URLBase from '../../constants/URLBase';
import { HeaderGrayBack } from '../../components/Headers';
import ProyectoName from '../../components/ProyectoName';

const SHORT_LIST = ['Hitos Pendientes', 'Hitos Completados', 'Tareas', 'Solicitudes'];

export default class ReportesScreen extends Component {
    constructor(props) {
        super(props);
    }
    state = {
    }
    _keyExtractor = (item, index) => item.id.toString();


    _renderItem = ({ item }) => (
        <ProyectoName
            title={item.nombre}
            onPress={() => {
                this.props.navigation.navigate('GenerarReporte', {idProyecto: item.id});
            }}
        />
    );
    render() {
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayBack
                    title='Reportes'
                    action={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <FlatList
                    data={this.props.screenProps.avancesProyectos}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    ListFooterComponent={() => <View style={{ height: 20 }} />}
                    ListHeaderComponent={() => <View style={{ height: 20 }} />}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});