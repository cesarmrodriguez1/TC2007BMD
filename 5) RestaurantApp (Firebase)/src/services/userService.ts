import {
  doc,
  getDoc,
  setDoc
} from "@react-native-firebase/firestore";

import {
  db
} from "../firebase";

import {
  UserProfile
} from "../types";


export const createUserProfile =
  async (
    userId: string,
    profile: UserProfile
  ): Promise<void> => {

    if (!userId) {

      throw new Error(
        "No existe un UID de usuario."
      );

    }


    await setDoc(
      doc(
        db,
        "users",
        userId
      ),
      profile
    );

  };


export const getUserProfile =
  async (
    userId: string
  ): Promise<UserProfile | null> => {

    if (!userId) {

      return null;

    }


    const document =
      await getDoc(
        doc(
          db,
          "users",
          userId
        )
      );


    if (!document.exists()) {

      return null;

    }


    return document.data() as UserProfile;

  };