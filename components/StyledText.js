import React from 'react';
import { Text } from 'react-native';

export class AvenirBlack extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'avenir-black' }]} />;
  }
}
export class AvenirBlackOblique extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'avenir-blackoblique' }]} />;
  }
}
export class AvenirBook extends React.Component {
    render() {
      return <Text {...this.props} style={[this.props.style, { fontFamily: 'avenir-book' }]} />;
    }
  }
export class AvenirHeavy extends React.Component {
    render() {
      return <Text {...this.props} style={[this.props.style, { fontFamily: 'avenir-heavy' }]} />;
    }
  
}
export class AvenirMedium extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'avenir-medium' }]} />;
  }

}