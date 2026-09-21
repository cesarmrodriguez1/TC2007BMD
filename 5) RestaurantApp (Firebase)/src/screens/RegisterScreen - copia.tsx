import React, {
  useState
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import {
  NativeStackScreenProps
} from "@react-navigation/native-stack";

import {
  AuthStackParamList,
  UserProfile
} from "../types";

import {
  registerUser
} from "../services/authService";

import {
  createUserProfile
} from "../services/userService";

type Props =
  NativeStackScreenProps<
    AuthStackParamList,
    "Register"
  >;

export default function RegisterScreen({
  navigation
}: Props) {

  const [name, setName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {

    if (
      !name ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {

      Alert.alert(
        "Datos incompletos",
        "Todos los campos son obligatorios."
      );

      return;
    }

    if (password.length < 6) {

      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {

      Alert.alert(
        "Contraseñas diferentes",
        "Las contraseñas no coinciden."
      );

      return;
    }

    try {

      setLoading(true);

      const user =
        await registerUser(
          email.trim(),
          password
        );

      const profile:
        UserProfile = {

        uid: user.uid,

        name: name.trim(),

        lastName:
          lastName.trim(),

        email:
          email.trim(),

        phone:
          phone.trim(),

        address:
          address.trim()

      };

      await createUserProfile(
        profile
      );

      Alert.alert(
        "Cuenta creada",
        "Tu cuenta fue registrada correctamente."
      );

    } catch (error: any) {

      console.error(error);

      let message =
        "No fue posible crear la cuenta.";

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        message =
          "Este correo ya está registrado.";

      } else if (
        error.code ===
        "auth/invalid-email"
      ) {

        message =
          "El correo electrónico no es válido.";

      } else if (
        error.code ===
        "auth/weak-password"
      ) {

        message =
          "La contraseña es demasiado débil.";

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

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >

        <Text style={styles.title}>
          Crear cuenta
        </Text>

        <Text style={styles.subtitle}>
          Regístrate para realizar pedidos
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={lastName}
          onChangeText={setLastName}
        />

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
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Dirección de entrega"
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={
            confirmPassword
          }
          onChangeText={
            setConfirmPassword
          }
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text
              style={
                styles.buttonText
              }
            >
              Crear cuenta
            </Text>

          )}

        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={() =>
            navigation.navigate(
              "Login"
            )
          }
        >

          <Text
            style={
              styles.backText
            }
          >
            Ya tengo una cuenta
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor: "#f6f6f6"

    },

    content: {

      padding: 25,

      paddingTop: 35,

      paddingBottom: 40

    },

    title: {

      fontSize: 30,

      fontWeight: "800",

      textAlign: "center"

    },

    subtitle: {

      textAlign: "center",

      color: "#777",

      marginTop: 8,

      marginBottom: 25

    },

    input: {

      height: 54,

      backgroundColor: "#fff",

      borderRadius: 14,

      paddingHorizontal: 18,

      marginBottom: 13,

      borderWidth: 1,

      borderColor: "#e2e2e2",

      fontSize: 16

    },

    button: {

      height: 54,

      backgroundColor: "#111",

      borderRadius: 27,

      alignItems: "center",

      justifyContent: "center",

      marginTop: 10

    },

    buttonText: {

      color: "#fff",

      fontSize: 17,

      fontWeight: "700"

    },

    backButton: {

      alignItems: "center",

      marginTop: 22

    },

    backText: {

      fontWeight: "700"

    }

  });