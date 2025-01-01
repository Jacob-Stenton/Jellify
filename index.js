import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { PlaybackService } from './player/service'
import TrackPlayer from 'react-native-track-player';

TrackPlayer.registerPlaybackService(() => PlaybackService());
AppRegistry.registerComponent(appName, () => App);
