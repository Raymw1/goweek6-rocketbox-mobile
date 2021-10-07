import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

import {formatDistance} from 'date-fns';
import pt from 'date-fns/locale/pt';

export default class Box extends Component {
  state = {box: {}};

  async componentDidMount() {
    const boxId = await AsyncStorage.getItem('@RocketBox:box');
    const {data} = await api.get(`/boxes/${boxId}`);
    this.saveBox(data);
  }

  saveBox = box => this.setState({box});

  renderItem = ({item}) => (
    <TouchableOpacity style={styles.file} onPress={() => {}}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#A5CFFF" />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>
      <Text style={styles.fileDate}>
        há{' '}
        {formatDistance(new Date(item.createdAt), new Date(), {
          locale: pt,
        })}
      </Text>
    </TouchableOpacity>
  );

  render() {
    const {box} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{box.title}</Text>
        <FlatList
          style={styles.list}
          data={box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
