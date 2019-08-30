import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage;';

var firebaseConfig = {
  apiKey: 'AIzaSyDshdtLeQhETiEsv3rQkf4y6-er1cUk6GI',
  authDomain: 'reslact-db.firebaseapp.com',
  databaseURL: 'https://reslact-db.firebaseio.com',
  projectId: 'reslact-db',
  storageBucket: 'reslact-db.appspot.com',
  messagingSenderId: '199110978481',
  appId: '1:199110978481:web:632eafd440562f82'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
