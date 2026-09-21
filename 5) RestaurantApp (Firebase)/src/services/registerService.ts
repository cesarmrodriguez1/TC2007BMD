import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
  updateProfile
} from "@react-native-firebase/auth";

import {
  firebaseAuth
} from "../firebase";


/**
 * Registrar un nuevo usuario
 * en Firebase Authentication
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  /*
   * Crear usuario en
   * Firebase Authentication
   */
  const userCredential =
    await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

  /*
   * Obtener el usuario creado
   */
  const user =
    userCredential.user;

  /*
   * Guardar el nombre en el
   * perfil de Authentication
   */
  await updateProfile(
    user,
    {
      displayName: name
    }
  );

  /*
   * Regresar el usuario creado
   */
  return user;
};


/**
 * Iniciar sesión
 */
export const loginUser = async (
  email: string,
  password: string
) => {

  const userCredential =
    await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

  return userCredential.user;
};


/**
 * Cerrar sesión
 */
export const logoutUser = async () => {

  await signOut(auth);

};