import React, { Component } from 'react';
import { View, Alert, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import Colors from '../../constants/Colors';
import SharedStyles from '../../constants/SharedStyles';
import URLBase from '../../constants/URLBase';
import { HeaderGrayMenu } from '../../components/Headers';
import ProyectoName from '../../components/ProyectoName';
import { AvenirMedium } from '../../components/StyledText';

export default class MenuDestajoScreen extends Component {
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
                this.props.navigation.navigate('DesgloseDestajo', { idProyecto: item.id, title: item.nombre});
            }}
        />
    );

    render() {
        return (
            <View style={SharedStyles.container}>
                <HeaderGrayMenu
                    title='Seleccione un proyecto'
                    action={() => {
                        this.props.navigation.openDrawer();
                    }}
                />
                {this.props.screenProps.avancesProyectos.length == 0 ? <AvenirMedium style={styles.message}>Sin proyectos asignados</AvenirMedium> : null}
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
    message: {
        margin: 20,
        color: Colors.subtitle
    },
});