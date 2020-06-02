import * as React from 'react';
import { Button } from 'react-native-paper';
import Colors from '../constants/Colors';
import { AvenirHeavy } from '../components/StyledText';

export default function CustomButton(props) {
    return <Button
    uppercase={false}
        children={<AvenirHeavy style={{ fontSize: props.fontSize, color: Colors.title, letterSpacing:0 }}>
            {props.title}
    </AvenirHeavy>}
    color={Colors.primary}
    mode="contained"  
    {...props} />;
}