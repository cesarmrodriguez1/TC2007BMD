import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "@react-native-firebase/auth";

import {
  firebaseAuth
} from "../firebase";


export const registerUser =
  async (
    email: string,
    password: string
  ) => {

    const cleanEmail =
      email.trim();


    const result =
      await createUserWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password
      );


    return result.user;

  };


export const loginUser =
  async (
    email: string,
    password: string
  ) => {

    const cleanEmail =
      email.trim();


    const result =
      await signInWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password
      );


    return result.user;

  };


export const logoutUser =
  async () => {

    await signOut(
      firebaseAuth
    );

  };