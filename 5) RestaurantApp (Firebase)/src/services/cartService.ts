import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc
} from "@react-native-firebase/firestore";

import {
  CartItem
} from "../types";


const db =
  getFirestore();


/*
 * Obtiene la referencia al documento
 * del carrito del usuario.
 *
 * Ruta:
 *
 * users/{userId}/cart/current
 */
const cartDocument = (
  userId: string
) => {

  return doc(
    db,
    "users",
    userId,
    "cart",
    "current"
  );

};


/*
 * Guarda el carrito completo
 * en Cloud Firestore.
 */
export const saveCart = async (
  userId: string,
  items: CartItem[]
): Promise<void> => {

  if (!userId) {

    throw new Error(
      "No existe un usuario autenticado."
    );

  }


  /*
   * Calculamos el total del carrito.
   */
  const total =
    items.reduce(
      (sum, item) => {

        return (
          sum +
          item.price *
          item.quantity
        );

      },
      0
    );


  /*
   * Obtenemos la referencia al carrito.
   */
  const reference =
    cartDocument(
      userId
    );


  /*
   * Si el carrito está vacío,
   * eliminamos el documento de Firebase.
   */
  if (items.length === 0) {

    await deleteDoc(
      reference
    );

    return;
  }


  /*
   * Guardamos los productos y
   * el total en Firestore.
   */
  await setDoc(
    reference,
    {
      items: items,
      total: total
    }
  );

};


/*
 * Actualiza el carrito.
 *
 * Esta función utiliza saveCart()
 * para guardar la información.
 */
export const updateCart = async (
  userId: string,
  items: CartItem[]
): Promise<void> => {

  await saveCart(
    userId,
    items
  );

};


/*
 * Obtiene el carrito almacenado
 * en Firebase.
 */
export const getCart = async (
  userId: string
): Promise<CartItem[]> => {

  if (!userId) {

    throw new Error(
      "No existe un usuario autenticado."
    );

  }


  /*
   * Obtenemos el documento:
   *
   * users/{userId}/cart/current
   */
  const document =
    await getDoc(
      cartDocument(
        userId
      )
    );


  /*
   * Si el documento no existe,
   * regresamos un carrito vacío.
   */
  if (!document.exists()) {

    return [];

  }


  /*
   * Obtenemos los datos del documento.
   */
  const data =
    document.data();


  /*
   * Verificamos que exista el campo
   * items y que sea un arreglo.
   */
  if (
    !data ||
    !Array.isArray(
      data.items
    )
  ) {

    return [];

  }


  /*
   * IMPORTANTE:
   * La conversión de tipo se realiza
   * en la misma línea.
   */
  return data.items as CartItem[];

};


/*
 * Elimina completamente el carrito
 * del usuario en Firebase.
 */
export const clearCart = async (
  userId: string
): Promise<void> => {

  if (!userId) {

    throw new Error(
      "No existe un usuario autenticado."
    );

  }


  await deleteDoc(
    cartDocument(
      userId
    )
  );

};