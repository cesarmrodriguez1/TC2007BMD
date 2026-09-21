import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where
} from "@react-native-firebase/firestore";

import {
  firebaseAuth
} from "../firebase";

import {
  CartItem,
  Order,
  OrderItem
} from "../types";


const db =
  getFirestore();


export const createOrder =
  async (
    items: CartItem[]
  ): Promise<string> => {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        "El usuario debe iniciar sesión para crear una orden."
      );

    }


    if (items.length === 0) {

      throw new Error(
        "No se puede crear una orden con el carrito vacío."
      );

    }


    const orderItems:
      OrderItem[] =
      items.map(
        item => ({
          dishId:
            item.dishId,

          name:
            item.name,

          price:
            item.price,

          quantity:
            item.quantity,

          subtotal:
            item.price *
            item.quantity,

          image:
            item.image
        })
      );


    const total =
      orderItems.reduce(
        (sum, item) =>
          sum +
          item.subtotal,
        0
      );


    const order:
      Order = {

        userId:
          user.uid,

        status:
          "pending",

        total,

        createdAt:
          new Date().toISOString(),

        items:
          orderItems

      };


    const reference =
      await addDoc(
        collection(
          db,
          "orders"
        ),
        order
      );


    return reference.id;

  };


export const getUserOrders =
  async (): Promise<Order[]> => {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        "El usuario debe iniciar sesión."
      );

    }


    const ordersQuery =
      query(
        collection(
          db,
          "orders"
        ),
        where(
          "userId",
          "==",
          user.uid
        )
      );


    const snapshot =
      await getDocs(
        ordersQuery
      );


    return snapshot.docs.map(
      document => ({
        id:
          document.id,

        ...document.data()
      })
    ) as Order[];

  };