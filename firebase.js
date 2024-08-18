// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBLY6xIjQmpg20y4JwCAne1ho-rojiwCk",
  authDomain: "flashcardsaas-130b2.firebaseapp.com",
  projectId: "flashcardsaas-130b2",
  storageBucket: "flashcardsaas-130b2.appspot.com",
  messagingSenderId: "128646413952",
  appId: "1:128646413952:web:67aacd04e59bf33c9a3065",
  measurementId: "G-ZV7KSX5Y9V",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }