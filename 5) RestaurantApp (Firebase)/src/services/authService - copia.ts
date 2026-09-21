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

    const result =
      await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

    return result.user;
  };


export const loginUser =
  async (
    email: string,
    password: string
  ) => {

    const result =
      await signInWithEmailAndPassword(
        firebaseAuth,
        email,
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