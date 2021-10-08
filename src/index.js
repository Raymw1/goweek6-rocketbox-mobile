import React from 'react';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

import Routes from './routes';

const App = () => <Routes />;

export default App;
