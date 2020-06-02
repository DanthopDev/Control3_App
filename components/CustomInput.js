import * as React from 'react';
import { DefaultTheme, TextInput } from 'react-native-paper';
import Colors from '../constants/Colors';
import {
    Platform,
  } from 'react-native';
export default function CustomInput(props) {
  return <TextInput 
            selectionColor={Colors.primary}
            style={{
                        fontSize:14,
                        backgroundColor: '#ffff',
                        borderRadius: 6,
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
                        })}}
          theme={{ fonts: { regular: 'avenir-medium' },
          colors: {
                ...DefaultTheme.colors,
                primary: '#111111',
                text:'#b1b1b1',
                placeholder: '#111111',
                accent: '#ffce00',
            }, }} 
          {...props} />;
}
