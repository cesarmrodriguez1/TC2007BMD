import React, {
  useState
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  AuthStackParamList
} from "../types";

import {
  loginUser
} from "../services/authService";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "Login"
  >;

export default function LoginScreen({
  navigation
}: Props) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    if (!email || !password) {

      Alert.alert(
        "Datos incompletos",
        "Ingresa tu correo y contraseña."
      );

      return;
    }

    try {

      setLoading(true);

      await loginUser(
        email.trim(),
        password
      );

    } catch (error: any) {

      console.error(error);

      let message =
        "No fue posible iniciar sesión.";

      if (
        error.code ===
        "auth/invalid-email"
      ) {

        message =
          "El correo electrónico no es válido.";
      }

      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        message =
          "Correo o contraseña incorrectos.";
      }

      if (
        error.code ===
        "auth/user-disabled"
      ) {

        message =
          "Esta cuenta se encuentra deshabilitada.";
      }

      Alert.alert(
        "Error",
        message
      );

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

      <View style={styles.content}>

        <Text style={styles.logo}>
          🍽️
        </Text>

        <Text style={styles.title}>
          Restaurante
        </Text>

        <Text style={styles.subtitle}>
          Inicia sesión para realizar tu pedido
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text style={styles.loginText}>
              Iniciar sesión
            </Text>

          )}

        </TouchableOpacity>

        <View style={styles.registerContainer}>

          <Text style={styles.registerText}>
            ¿No tienes una cuenta?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "Register"
              )
            }
          >

            <Text style={styles.registerLink}>
              Registrarse
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 25
  },

  logo: {
    fontSize: 60,
    textAlign: "center"
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 8,
    marginBottom: 30
  },

  input: {
    height: 54,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e2e2"
  },

  loginButton: {
    height: 54,
    backgroundColor: "#111",
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },

  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700"
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25
  },

  registerText: {
    color: "#777"
  },

  registerLink: {
    marginLeft: 5,
    fontWeight: "800",
    color: "#111"
  }

});