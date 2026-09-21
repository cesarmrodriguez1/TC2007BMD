import {
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from "@react-native-firebase/firestore";

import {
  Category,
  Dish
} from "../types";


const db =
  getFirestore();


export const getDishes =
  async (): Promise<Dish[]> => {

    const dishesReference =
      collection(
        db,
        "dishes"
      );


    const dishesQuery =
      query(
        dishesReference,
        where(
          "available",
          "==",
          true
        )
      );


    const snapshot =
      await getDocs(
        dishesQuery
      );


    return snapshot.docs.map(
      document => ({
        id: document.id,
        ...document.data()
      })
    ) as Dish[];

  };


export const getCategories =
  async (): Promise<Category[]> => {

    const snapshot =
      await getDocs(
        collection(
          db,
          "categories"
        )
      );


    return snapshot.docs.map(
      document => ({
        id: document.id,
        ...document.data()
      })
    ) as Category[];

  };