import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/apiServices';
import {API_URL} from '@env';
import socket from 'socket.io-client';

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
    this.subscribeToNewFiles();
  }

  subscribeToNewFiles = () => {
    const io = socket(API_URL);
    io.emit('connectRoom', this.state.box._id);
    io.on('file', data => {
      this.setState({
        box: {...this.state.box, files: [data, ...this.state.box.files]},
      });
    });
  };

  saveBox = box => this.setState({box});

  openFile = async file => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath,
      });
      await FileViewer.open(filePath);
    } catch (error) {
      console.error('File not supported');
    }
  };

  handleUpload = () => {
    function generateName() {
      let name = 'File_';
      for (let i = 0; i < 4; i++) {
        name += `${Math.round(Math.random() * 9)}`;
      }
      return name;
    }

    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('Image Picker error');
      } else if (upload.didCancel) {
        console.log('Canceled by user');
      } else {
        const data = new FormData();
        const filesPromise = upload.assets.map(file => {
          const [prefix, sufix] = file.fileName.split('.');
          const ext = sufix.toLowerCase() === 'heic' ? 'jpg' : sufix;
          data.append('file', {
            uri: file.uri,
            type: file.type,
            name: `${prefix}.${ext}`,
          });
          return api.post(`/boxes/${this.state.box._id}/files`, data);
        });
        await Promise.all(filesPromise);
      }
    });
  };

  renderItem = ({item}) => (
    <TouchableOpacity style={styles.file} onPress={() => this.openFile(item)}>
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
        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="cloud-upload" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }
}
