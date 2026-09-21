import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged
} from "@react-native-firebase/auth";

import {
  firebaseAuth
} from "../firebase";

import {
  CartItem
} from "../types";

import {
  getCart,
  saveCart,
  clearCart as clearFirebaseCart
} from "../services/cartService";


interface CartContextType {

  items: CartItem[];

  total: number;

  saving: boolean;

  addItem:
    (item: CartItem) =>
      Promise<void>;

  removeItem:
    (dishId: string) =>
      Promise<void>;

  updateQuantity:
    (
      dishId: string,
      quantity: number
    ) =>
      Promise<void>;

  clearCart:
    () =>
      Promise<void>;
}


const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);


export const CartProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {

  const [
    items,
    setItems
  ] = useState<CartItem[]>([]);


  const [
    saving,
    setSaving
  ] = useState(false);


  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        firebaseAuth,
        async user => {

          if (!user) {

            setItems([]);

            return;
          }


          try {

            const savedItems =
              await getCart(
                user.uid
              );

            setItems(
              savedItems
            );

          } catch (error) {

            console.log(
              "Error cargando carrito desde Firebase:",
              error
            );

            setItems([]);

          }

        }
      );


    return unsubscribe;

  }, []);


  const addItem =
    async (
      item: CartItem
    ) => {

      const user =
        firebaseAuth.currentUser;


      if (!user) {

        throw new Error(
          "Debes iniciar sesión para utilizar el carrito."
        );

      }


      const existingItem =
        items.find(
          current =>
            current.dishId ===
            item.dishId
        );


      let newItems: CartItem[];


      if (existingItem) {

        newItems =
          items.map(
            current =>
              current.dishId ===
              item.dishId
                ? {
                    ...current,
                    quantity:
                      current.quantity +
                      item.quantity
                  }
                : current
          );

      } else {

        newItems = [
          ...items,
          item
        ];

      }


      setItems(
        newItems
      );


      try {

        setSaving(true);

        await saveCart(
          user.uid,
          newItems
        );

      } catch (error) {

        console.log(
          "Error sincronizando carrito después de agregar:",
          error
        );

        throw error;

      } finally {

        setSaving(false);

      }

    };


  const removeItem =
    async (
      dishId: string
    ) => {

      const user =
        firebaseAuth.currentUser;


      if (!user) {

        throw new Error(
          "Debes iniciar sesión."
        );

      }


      const newItems =
        items.filter(
          item =>
            item.dishId !==
            dishId
        );


      setItems(
        newItems
      );


      try {

        setSaving(true);

        await saveCart(
          user.uid,
          newItems
        );

      } catch (error) {

        console.log(
          "Error sincronizando carrito después de eliminar:",
          error
        );

        throw error;

      } finally {

        setSaving(false);

      }

    };


  const updateQuantity =
    async (
      dishId: string,
      quantity: number
    ) => {

      if (quantity <= 0) {

        await removeItem(
          dishId
        );

        return;
      }


      const user =
        firebaseAuth.currentUser;


      if (!user) {

        throw new Error(
          "Debes iniciar sesión."
        );

      }


      const newItems =
        items.map(
          item =>
            item.dishId === dishId
              ? {
                  ...item,
                  quantity
                }
              : item
        );


      setItems(
        newItems
      );


      try {

        setSaving(true);

        await saveCart(
          user.uid,
          newItems
        );

      } catch (error) {

        console.log(
          "Error sincronizando cantidad:",
          error
        );

        throw error;

      } finally {

        setSaving(false);

      }

    };


  const clearCart =
    async () => {

      const user =
        firebaseAuth.currentUser;


      setItems([]);


      if (!user) {

        return;
      }


      try {

        setSaving(true);

        await clearFirebaseCart(
          user.uid
        );

      } catch (error) {

        console.log(
          "Error eliminando carrito de Firebase:",
          error
        );

        throw error;

      } finally {

        setSaving(false);

      }

    };


  const total =
    items.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  return (

    <CartContext.Provider
      value={{
        items,
        total,
        saving,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>

  );

};


export const useCart = () => {

  const context =
    useContext(
      CartContext
    );


  if (!context) {

    throw new Error(
      "useCart debe utilizarse dentro de CartProvider."
    );

  }


  return context;

};