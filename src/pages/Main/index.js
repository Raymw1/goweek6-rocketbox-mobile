import React, {Component} from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/apiServices';

import styles from './styles';

import logo from '../../assets/logo.png';

export default class Main extends Component {
  state = {
    newBox: '',
  };

  async componentDidMount() {
    const box = await AsyncStorage.getItem('@RocketBox:box');
    if (box) {
      this.props.navigation.navigate('Box');
    }
  }

  handleSignIn = async () => {
    const {newBox: title} = this.state;
    if (!title.trim()) return;
    const {data} = await api.post('/boxes', {title});
    await AsyncStorage.setItem('@RocketBox:box', data._id);
    this.props.navigation.navigate('Box');
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput
          style={styles.input}
          placeholder="Create a box"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={this.state.newBox}
          onChangeText={text => this.setState({newBox: text})}
        />
        <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
