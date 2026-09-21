import React, {
  useState,
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  RootStackParamList,
} from "../navigation/AppNavigator";

import {
  createUser,
} from "../services/userService";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen({
  navigation,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim()) {
      Alert.alert("Error", "Ingresa el nombre");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Ingresa el correo electrónico");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Ingresa el teléfono");
      return;
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge) || numericAge <= 0) {
      Alert.alert("Error", "Ingresa una edad válida");
      return;
    }

    try {
      setLoading(true);

      await createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        age: numericAge,
      });

      Alert.alert(
        "Registro exitoso",
        "El usuario fue registrado correctamente.",
        [
          {
            text: "Continuar",
            onPress: () => navigation.navigate("Users"),
          },
        ]
      );

      setName("");
      setEmail("");
      setPhone("");
      setAge("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

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
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            Registro de usuario
          </Text>

          <Text style={styles.subtitle}>
            Ingresa los datos del usuario
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={3}
          />

          <Pressable
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Registrando..."
                : "Registrar usuario"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Users")}
          >
            <Text style={styles.secondaryButtonText}>
              Ver usuarios
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#667085",
    textAlign: "center",
    marginBottom: 24,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "700",
  },
});