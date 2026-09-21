import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import RegisterScreen from "../screens/RegisterScreen";
import UsersScreen from "../screens/UsersScreen";
import UserDetailScreen from "../screens/UserDetailScreen";

export type RootStackParamList = {
  Register: undefined;
  Users: undefined;
  UserDetail: {
    userId: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Registro",
        }}
      />

      <Stack.Screen
        name="Users"
        component={UsersScreen}
        options={{
          title: "Usuarios",
        }}
      />

      <Stack.Screen
        name="UserDetail"
        component={UserDetailScreen}
        options={{
          title: "Detalle del usuario",
        }}
      />
    </Stack.Navigator>
  );
}