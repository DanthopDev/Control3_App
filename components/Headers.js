import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import Colors from '../constants/Colors';

/* {
                icon: 'left', type: 'antdesign', color: Colors.title, onPress: this.props.action, size: 26
            } */
class HeaderGrayBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Header
            backgroundColor={Colors.background}
            barStyle={'dark-content'}
            leftComponent={
              <TouchableOpacity onPress={this.props.action}>
                <Icon
                  name='left'
                  type='antdesign'
                  color={Colors.title}
                  size={26}
                />
              </TouchableOpacity>
            }
            centerComponent={{ text: this.props.title, style: { color: Colors.title, fontFamily: 'avenir-heavy', fontSize: 18 } }}
        />
    );
  }
}
/* { icon: 'menu', color: Colors.primary, onPress: this.props.action, size: 26 } */
class HeaderBlackMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header
        backgroundColor={Colors.title}
        barStyle={'light-content'}
        leftComponent={<TouchableOpacity onPress={this.props.action}>
          <Icon
            name='menu'
            color={Colors.primary}
            size={26}
          />
        </TouchableOpacity>}
        centerComponent={{ text: this.props.title, style: { color: Colors.white, fontFamily: 'avenir-heavy', fontSize: 18 } }}

      />
    );
  }
}
class HeaderBlack extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header
        backgroundColor={Colors.title}
        centerComponent={{ text: this.props.title, style: { color: Colors.white, fontFamily: 'avenir-heavy', fontSize: 18 } }}
        barStyle={'light-content'}
      />
    );
  }
}
/* { icon: 'menu', color: Colors.title, onPress: this.props.action, size: 26 } */
class HeaderGrayMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header
        backgroundColor={Colors.background}
        leftComponent={<TouchableOpacity onPress={this.props.action}>
            <Icon
              name='menu'
              color={Colors.title}
              size={26}
            />
          </TouchableOpacity>}
        centerComponent={{ text: this.props.title, style: { color: Colors.title, fontFamily: 'avenir-heavy', fontSize: 18 } }}
      />
    );
  }
}

class HeaderGrayBackDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
        leftComponent={<TouchableOpacity onPress={this.props.action}>
          <Icon
            name='left'
            type='antdesign'
            color={Colors.title}
            size={26}
          />
        </TouchableOpacity>}
        centerComponent={{ text: this.props.title, style: { color: Colors.title, fontFamily: 'avenir-heavy', fontSize: 18 } }}
        rightComponent={<TouchableOpacity onPress={this.props.onDelete}>
          <Icon
            name='trash-o'
            type='font-awesome'
            color={Colors.title}
            size={26}
          />
        </TouchableOpacity>}
      />
    );
  }
}
class HeaderGrayBackAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
        leftComponent={<TouchableOpacity onPress={this.props.action}>
          <Icon
            name='left'
            type='antdesign'
            color={Colors.title}
            size={26}
          />
        </TouchableOpacity>}
        centerComponent={{ text: this.props.title, style: { color: Colors.title, fontFamily: 'avenir-heavy', fontSize: 18 } }}
        rightComponent={<TouchableOpacity onPress={this.props.onAdd}>
          <Icon
            name='plus'
            type='feather'
            color={Colors.title}
            size={26}
          />
        </TouchableOpacity>}
      />
    );
  }
}

class HeaderGrayMenuAddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Header
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
        leftComponent={<TouchableOpacity onPress={this.props.action}>
          <Icon
            name='menu'
            color={Colors.title}
            size={26}
          />
        </TouchableOpacity>}
        centerComponent={{ text: this.props.title, style: { color: Colors.title, fontFamily: 'avenir-heavy', fontSize: 18 } }}
        rightComponent={<TouchableOpacity onPress={this.props.onAddUser}>
          <Icon
            name='person-add'
            type='material'
            color={Colors.title}
            size={26}
          />
        </TouchableOpacity>}
      />
    );
  }
}

export { HeaderGrayBack, HeaderBlackMenu, HeaderGrayMenu, HeaderBlack, HeaderGrayBackDelete, HeaderGrayBackAdd, HeaderGrayMenuAddUser};
