import {
  doc,
  getDoc,
  getFirestore,
  setDoc
} from "@react-native-firebase/firestore";

import {
  UserProfile
} from "../types";


const db =
  getFirestore();


export const createUserProfile =
  async (
    userId: string,
    profile: UserProfile
  ) => {

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