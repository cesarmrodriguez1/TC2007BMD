import React, {
  useState
} from "react";

import {
  ActivityIndicator,
  Alert,
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
  loginUser
} from "../services/authService";

import {
  AuthStackParamList
} from "../navigation/AuthNavigator";


type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "Login"
  >;


const LoginScreen = ({
  navigation
}: Props) => {

  const [
    email,
    setEmail
  ] = useState("");


  const [
    password,
    setPassword
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(false);


  const handleLogin =
    async () => {

      const cleanEmail =
        email.trim();


      if (!cleanEmail) {

        Alert.alert(
          "Inicio de sesión",
          "Ingresa tu correo electrónico."
        );

        return;

      }


      if (!password) {

        Alert.alert(
          "Inicio de sesión",
          "Ingresa tu contraseña."
        );

        return;

      }


      try {

        setLoading(true);


        await loginUser(
          cleanEmail,
          password
        );


        /*
         * No necesitamos navegar manualmente.
         *
         * AppNavigator recibe el cambio de
         * autenticación mediante
         * onAuthStateChanged().
         */

      } catch (error: any) {

        console.log(
          "Error de inicio de sesión:",
          error
        );


        switch (
          error?.code
        ) {

          case "auth/invalid-email":

            Alert.alert(
              "Inicio de sesión",
              "El correo electrónico no es válido."
            );

            break;


          case "auth/invalid-credential":

            Alert.alert(
              "Inicio de sesión",
              "El correo electrónico o la contraseña son incorrectos."
            );

            break;


          case "auth/user-disabled":

            Alert.alert(
              "Inicio de sesión",
              "Esta cuenta está deshabilitada."
            );

            break;


          case "auth/network-request-failed":

            Alert.alert(
              "Inicio de sesión",
              "No se pudo conectar con Firebase."
            );

            break;


          default:

            Alert.alert(
              "Error",
              error?.message ||
              "No fue posible iniciar sesión."
            );

            break;

        }

      } finally {

        setLoading(false);

      }

    };


  return (

    <View
      style={styles.container}
    >

      <View
        style={styles.card}
      >

        <Text
          style={styles.title}
        >
          RestaurantApp
        </Text>


        <Text
          style={styles.subtitle}
        >
          Iniciar sesión
        </Text>


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
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />


        <TouchableOpacity
          style={[
            styles.loginButton,
            loading &&
              styles.disabledButton
          ]}
          onPress={handleLogin}
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
              Iniciar sesión
            </Text>

          )}

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.registerButton}
          onPress={() =>
            navigation.navigate(
              "Register"
            )
          }
          disabled={loading}
        >

          <Text
            style={styles.registerText}
          >
            Crear una cuenta
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};


const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#F4F6F8",
      justifyContent: "center",
      padding: 20
    },

    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 25,
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
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: "#222222",
      marginBottom: 8
    },

    subtitle: {
      fontSize: 18,
      textAlign: "center",
      color: "#666666",
      marginBottom: 25
    },

    input: {
      height: 52,
      borderWidth: 1,
      borderColor: "#D5D9DE",
      borderRadius: 12,
      paddingHorizontal: 15,
      marginBottom: 15,
      fontSize: 16,
      color: "#222222"
    },

    loginButton: {
      height: 52,
      borderRadius: 14,
      backgroundColor: "#E53935",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5
    },

    disabledButton: {
      opacity: 0.6
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "bold"
    },

    registerButton: {
      height: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#E53935",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 15
    },

    registerText: {
      color: "#E53935",
      fontSize: 16,
      fontWeight: "600"
    }

  });


export default LoginScreen;