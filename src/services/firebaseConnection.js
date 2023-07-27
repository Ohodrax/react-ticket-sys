import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD21uCnLeZbBnmEw_U15S8KYGdxv_x30to",
    authDomain: "ticket-sys-35fa3.firebaseapp.com",
    projectId: "ticket-sys-35fa3",
    storageBucket: "ticket-sys-35fa3.appspot.com",
    messagingSenderId: "648683129586",
    appId: "1:648683129586:web:96fd820a12f2ac137d5e6b",
    measurementId: "G-7RCCP45MXX"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth        = getAuth(firebaseApp);
const db          = getFirestore(firebaseApp);
const storage     = getStorage(firebaseApp);

export { auth, db, storage };