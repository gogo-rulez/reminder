import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

console.log('firebase', firebase);

firebase.initializeApp({
    apiKey: 'AIzaSyCXb5gnml2RKPTBIoKTG8DHhpmIXndyxWc',
    authDomain: 'pill-reminder-ece9f.firebaseapp.com',
    databaseURL: 'https://pill-reminder-ece9f-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'pill-reminder-ece9f',
    storageBucket: 'pill-reminder-ece9f.appspot.com',
    messagingSenderId: '721441347394',
    appId: '1:721441347394:web:be41a5738df7d28f2b9adb'
});

// utils
const db = firebase.firestore();
const authSettings = firebase.auth;
const auth = firebase.auth();
const database = firebase.database();

// export utils/refs
export {
    db,
    auth,
    authSettings,
    database
};
