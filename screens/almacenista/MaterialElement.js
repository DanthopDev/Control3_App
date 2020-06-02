//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TextInput, Alert } from 'react-native';
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import Icon from "react-native-animated-icons";
import * as Animatable from 'react-native-animatable';
import Colors from '../../constants/Colors';
import URLBase from '../../constants/URLBase';

const deviceWidth = Dimensions.get('screen').width;
const listWidth = deviceWidth - 140;

// create a component
class MaterialElement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listSize: new Animated.Value(0),
            borderBottom: new Animated.Value(10),
            expanded: false,
            cantidad: this.props.item.cant.toString(),
            editable: false,
        }
    }
    deleteMaterial = async () => {
        const { item, access_token } = this.props;
        var formData = new FormData();
        console.log('id', item);
        formData.append('editable', item.id);
        fetch(URLBase + '/alm/deleterMateriales', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('******************** DELETE  MATERIAL ***********');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                    this.props.quitMaterial(item.id);
                } else {
                    Alert.alert('Error al consultar la informacion')
                }
            })
            .catch((error) => {
                Alert.alert('Error', error);
                console.error(error);
            });
    }
    editMaterial = async () => {
        const { item, access_token } = this.props;
        var formData = new FormData();
        const { cantidad } = this.state;
        console.log('id', item);
        formData.append('editable', item.id);
        if(cantidad==''){
            formData.append('cantidad', '0');
            this.setState({
                cantidad: '0'
            })
        }else {
            formData.append('cantidad', cantidad);
        }
        fetch(URLBase + '/alm/updaterMateriales', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + access_token,
                Accept: 'application/json',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('******************** EDIT  MATERIAL ***********');
                console.log(responseJson);
                if (responseJson.success && responseJson.success == '200') {
                } else {
                    Alert.alert('Error al actualizar el material')
                }
            })
            .catch((error) => {
                Alert.alert('Error', error);
                console.error(error);
            });
    }
    render() {

        const { item } = this.props;

        return (
            <View style={styles.container}>
                <View>
                    <Animated.View style={[styles.listStyle, {
                        borderBottomLeftRadius: this.state.borderBottom,
                        borderBottomRightRadius: this.state.borderBottom,
                    }]}>
                        <TouchableOpacity
                            style={styles.listTouch}
                            onPress={this.openCloseList}
                        >
                            <Text>{item.name}</Text>
                            <Icon
                                name={!this.state.expanded ? "ios-arrow-down" : "ios-arrow-up"}
                                iconFamily="Ionicons"
                                fontSize={18}
                                color={Colors.title}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={[styles.itemContent, {height: this.state.listSize}]}>
                        {this.state.expanded &&
                            <Animatable.View animation="fadeInUp">
                               
                                <View style={[styles.itemStyle, {borderTopWidth: 1}]}>  
                                    <Text style={{ fontFamily: 'avenir-heavy' }}>Cantidad</Text>
                                    <TextInput 
                                        editable={this.state.editable}
                                        value={this.state.cantidad}
                                        style={{ fontFamily: 'avenir-book' }}
                                        onChange={this.handleChange}
                                        keyboardType={'numeric'}
                                    />
                                </View>
                            </Animatable.View>
                        }
                    </Animated.View>
                </View>
                {this.state.editable == true ? <TouchableOpacity 
                                                style={styles.button}
                                                onPress={() => {
                                                    this.editMaterial(); 
                                                    this.setState({ expanded: false, editable: false });
                                                    this.contentAnim();
                                                    }}>
                                                    <FontAwesome name="save" size={18} />
                                                </TouchableOpacity> : <TouchableOpacity
                                                    style={styles.button}
                                                    onPress={this.editAction}>
                                                        <SimpleLineIcons name="pencil" size={18} />
                                                </TouchableOpacity> }
                <TouchableOpacity
                    onPress={() => this.deleteMaterial()} 
                    style={styles.button}>
                    <FontAwesome name="trash-o" size={18} />
                </TouchableOpacity>
            </View>
        );
    }

    openCloseList = () => {
        this.contentAnim();
        this.setState({
            expanded: !this.state.expanded,
            editable: false,
        });
    }

    editAction = () => {
        if(!this.state.expanded && !this.state.editable){
            this.contentAnim();
            this.setState({expanded: true, editable: true});
        }else if(this.state.editable){
            this.contentAnim();
            this.setState({expanded: false, editable: false});
        }else{
            this.setState({editable: true});
        }
    }

    contentAnim = () => {
        Animated.timing(
            this.state.listSize,
            {
              toValue: this.state.expanded ? 0 : 50,
              duration: 500,
            }
        ).start();
        Animated.timing(
            this.state.borderBottom,
            {
              toValue: this.state.expanded ? 10 : 0,
              duration: 500,
            }
        ).start();
    }

    handleChange = event => {
        event.persist();
        this.setState({ cantidad: event.nativeEvent.text});
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginHorizontal: 20
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.white,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listStyle: {
        height: 40,
        width: listWidth,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: Colors.white,
        elevation: 2,
        paddingHorizontal: 15,
    },
    listTouch: {
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        fontFamily: 'avenir-medium',
        fontSize: 12,
    },
    itemContent: {
        width: listWidth,
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 2,
    },
    itemStyle: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.divisor,
    }
});

//make this component available to the app
export default MaterialElement;
