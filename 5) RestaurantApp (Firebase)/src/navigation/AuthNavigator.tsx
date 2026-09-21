import React from "react";

import {
  createNativeStackNavigator
} from "@react-navigation/native-stack";

import LoginScreen
  from "../screens/LoginScreen";

import RegisterScreen
  from "../screens/RegisterScreen";


export type AuthStackParamList = {

  Login: undefined;

  Register: undefined;

};


const Stack =
  createNativeStackNavigator<
    AuthStackParamList
  >();


const AuthNavigator = () => {

  return (

    <Stack.Navigator>

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Iniciar sesión"
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Crear cuenta"
        }}
      />

    </Stack.Navigator>

  );

};


export default AuthNavigator;