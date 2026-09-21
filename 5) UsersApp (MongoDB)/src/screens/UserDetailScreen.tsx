import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
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

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  getUserById,
  updateUser,
} from "../services/userService";

import type {
  UpdateUserRequest,
} from "../types/User";

import type {
  RootStackParamList,
} from "../navigation/AppNavigator";


type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "UserDetail"
  >;


export default function UserDetailScreen({
  route,
  navigation,
}: Props) {
  const {
    userId,
  } = route.params;


  const [
    name,
    setName,
  ] = useState("");


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    phone,
    setPhone,
  ] = useState("");


  const [
    age,
    setAge,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  useEffect(() => {
    loadUser();
  }, [userId]);


  async function loadUser(): Promise<void> {
    try {
      setLoading(true);

      const user =
        await getUserById(userId);

      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAge(String(user.age));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible obtener el usuario";

      Alert.alert(
        "Error",
        message,
        [
          {
            text: "Aceptar",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleSave(): Promise<void> {
    if (!name.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Introduce el nombre del usuario."
      );

      return;
    }


    if (!email.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Introduce el correo electrónico."
      );

      return;
    }


    if (!phone.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Introduce el teléfono."
      );

      return;
    }


    const numericAge =
      Number(age);


    if (
      !Number.isInteger(numericAge) ||
      numericAge <= 0
    ) {
      Alert.alert(
        "Edad inválida",
        "Introduce una edad válida."
      );

      return;
    }


    const updatedUser:
      UpdateUserRequest = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: numericAge,
      };


    try {
      setSaving(true);

      await updateUser(
        userId,
        updatedUser
      );

      Alert.alert(
        "Usuario actualizado",
        "Los cambios se guardaron correctamente.",
        [
          {
            text: "Aceptar",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el usuario";

      Alert.alert(
        "Error",
        message
      );
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
        />

        <Text style={styles.loadingText}>
          Cargando usuario...
        </Text>
      </View>
    );
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
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Datos del usuario
        </Text>


        <Text style={styles.label}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre completo"
          autoCapitalize="words"
        />


        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />


        <Text style={styles.label}>
          Teléfono
        </Text>

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="3312345678"
          keyboardType="phone-pad"
        />


        <Text style={styles.label}>
          Edad
        </Text>

        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Edad"
          keyboardType="number-pad"
        />


        <Pressable
          style={[
            styles.button,
            saving &&
              styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.buttonText}>
              Guardar cambios
            </Text>
          )}
        </Pressable>


        <Pressable
          style={styles.cancelButton}
          onPress={() =>
            navigation.goBack()
          }
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>
            Cancelar
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 15,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5D9E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 12,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});