import { AppRegistry } from 'react-native';
import App from './App'; // Ensure the path is correct
import { name as appName } from './app.json'; // Adjust the path as necessary

AppRegistry.registerComponent(appName, () => App);
