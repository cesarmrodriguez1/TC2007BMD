import React, {
  useState
} from "react";

import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import {
  NativeStackScreenProps
} from "@react-navigation/native-stack";

import {
  registerUser
} from "../services/authService";

import {
  createUserProfile
} from "../services/userService";

import {
  AuthStackParamList
} from "../navigation/AuthNavigator";


type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "Register"
  >;


const RegisterScreen = ({
  navigation
}: Props) => {

  const [
    name,
    setName
  ] = useState("");


  const [
    lastName,
    setLastName
  ] = useState("");


  const [
    email,
    setEmail
  ] = useState("");


  const [
    phone,
    setPhone
  ] = useState("");


  const [
    address,
    setAddress
  ] = useState("");


  const [
    password,
    setPassword
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const handleRegister =
    async () => {

      const cleanName =
        name.trim();

      const cleanLastName =
        lastName.trim();

      const cleanEmail =
        email.trim();

      const cleanPhone =
        phone.trim();

      const cleanAddress =
        address.trim();


      if (!cleanName) {

        Alert.alert(
          "Registro",
          "Ingresa tu nombre."
        );

        return;

      }


      if (!cleanLastName) {

        Alert.alert(
          "Registro",
          "Ingresa tu apellido."
        );

        return;

      }


      if (!cleanEmail) {

        Alert.alert(
          "Registro",
          "Ingresa tu correo electrónico."
        );

        return;

      }


      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailRegex.test(cleanEmail)) {

        Alert.alert(
          "Registro",
          "Ingresa un correo electrónico válido."
        );

        return;

      }


      if (!password) {

        Alert.alert(
          "Registro",
          "Ingresa una contraseña."
        );

        return;

      }


      if (password.length < 6) {

        Alert.alert(
          "Registro",
          "La contraseña debe tener al menos 6 caracteres."
        );

        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        Alert.alert(
          "Registro",
          "Las contraseñas no coinciden."
        );

        return;

      }


      try {

        setLoading(true);


        /*
         * 1. Crear usuario en
         * Firebase Authentication.
         *
         * Firebase genera automáticamente
         * el UID.
         */

        const firebaseUser =
          await registerUser(
            cleanEmail,
            password
          );


        /*
         * 2. Guardar información adicional
         * en Firestore usando el mismo UID.
         *
         * NO guardamos la contraseña.
         */

        await createUserProfile(
          firebaseUser.uid,
          {
            name: cleanName,
            lastName: cleanLastName,
            email: cleanEmail,
            phone: cleanPhone,
            address: cleanAddress
          }
        );


        /*
         * 3. No hacemos navigation.navigate().
         *
         * Firebase Authentication ya dejó
         * al usuario autenticado.
         *
         * AppNavigator detectará el cambio
         * mediante onAuthStateChanged().
         */

        Alert.alert(
          "Registro exitoso",
          "Tu cuenta fue creada correctamente."
        );

      } catch (error: any) {

        console.log(
          "Error al registrar usuario:",
          error
        );


        switch (
          error?.code
        ) {

          case "auth/email-already-in-use":

            Alert.alert(
              "Registro",
              "Este correo electrónico ya está registrado."
            );

            break;


          case "auth/invalid-email":

            Alert.alert(
              "Registro",
              "El correo electrónico no es válido."
            );

            break;


          case "auth/weak-password":

            Alert.alert(
              "Registro",
              "La contraseña es demasiado débil. Utiliza al menos 6 caracteres."
            );

            break;


          case "auth/network-request-failed":

            Alert.alert(
              "Registro",
              "No se pudo conectar con Firebase. Verifica tu conexión a Internet."
            );

            break;


          case "auth/operation-not-allowed":

            Alert.alert(
              "Registro",
              "El acceso mediante correo y contraseña no está habilitado en Firebase Authentication."
            );

            break;


          default:

            Alert.alert(
              "Error de registro",
              error?.message ||
              "No fue posible crear la cuenta."
            );

            break;

        }

      } finally {

        setLoading(false);

      }

    };


  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollContainer
        }
        keyboardShouldPersistTaps="handled"
      >

        <View
          style={styles.card}
        >

          <Text
            style={styles.title}
          >
            Crear cuenta
          </Text>


          <Text
            style={styles.subtitle}
          >
            Regístrate para comenzar a realizar tus pedidos.
          </Text>


          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />


          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            editable={!loading}
          />


          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />


          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />


          <TextInput
            style={[
              styles.input,
              styles.multilineInput
            ]}
            placeholder="Dirección"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            editable={!loading}
          />


          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />


          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={
              setConfirmPassword
            }
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />


          <TouchableOpacity
            style={[
              styles.registerButton,
              loading &&
                styles.disabledButton
            ]}
            onPress={handleRegister}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <Text
                style={styles.buttonText}
              >
                Crear cuenta
              </Text>

            )}

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation.navigate(
                "Login"
              )
            }
            disabled={loading}
          >

            <Text
              style={styles.loginText}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>

  );

};


const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#F4F6F8"
    },

    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 20
    },

    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 24,
      elevation: 5,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowOpacity: 0.15,
      shadowRadius: 8
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#222222",
      textAlign: "center",
      marginBottom: 8
    },

    subtitle: {
      fontSize: 15,
      color: "#666666",
      textAlign: "center",
      marginBottom: 22
    },

    input: {
      height: 52,
      borderWidth: 1,
      borderColor: "#D5D9DE",
      borderRadius: 12,
      paddingHorizontal: 15,
      marginBottom: 13,
      backgroundColor: "#FFFFFF",
      fontSize: 16,
      color: "#222222"
    },

    multilineInput: {
      height: 85,
      textAlignVertical: "top",
      paddingTop: 14
    },

    registerButton: {
      height: 52,
      borderRadius: 14,
      backgroundColor: "#E53935",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8
    },

    disabledButton: {
      opacity: 0.6
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "bold"
    },

    loginButton: {
      marginTop: 20,
      alignItems: "center"
    },

    loginText: {
      color: "#E53935",
      fontSize: 15,
      fontWeight: "600"
    }

  });


export default RegisterScreen;