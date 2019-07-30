import firebase from 'react-native-firebase';

const androidConfig = {
    clientId: '',
    appId: '',
    apiKey: '',
    databaseURL: '',
    storageBucket: '',
    messagingSenderId: '',
    projectId: '',
  
    // enable persistence by adding the below flag
    persistence: true,
  };
  
  const firebaseApp = firebase.initializeApp(
    // use platform specific firebase config
    Platform.OS === 'ios' ? iosConfig : androidConfig,
    // name of this app
    'safeguard',
  );

  export default firebaseApp;
