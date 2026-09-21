import React from "react";

import {
  firebaseAuth
} from "../firebase";

import {
  NavigationContainer
} from "@react-navigation/native";

import {
  createNativeStackNavigator
} from "@react-navigation/native-stack";

import {
  onAuthStateChanged
} from "@react-native-firebase/auth";

import {
  Dish
} from "../types";

import AuthNavigator
  from "./AuthNavigator";

import MenuScreen
  from "../screens/MenuScreen";

import DishDetailScreen
  from "../screens/DishDetailScreen";

import CartScreen
  from "../screens/CartScreen";

import OrderConfirmationScreen
  from "../screens/OrderConfirmationScreen";


export type RootStackParamList = {

  Menu: undefined;

  DishDetail: {
    dish: Dish;
  };

  Cart: undefined;

  OrderConfirmation: undefined;

};


const Stack =
  createNativeStackNavigator<
    RootStackParamList
  >();


const AppNavigator = () => {

  const [
    user,
    setUser
  ] = React.useState(
    firebaseAuth.currentUser
  );


  React.useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        firebaseAuth,
        currentUser => {

          setUser(
            currentUser
          );

        }
      );


    return unsubscribe;

  }, []);


  return (

    <NavigationContainer>

      {user ? (

        <Stack.Navigator>

          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              title: "Menú"
            }}
          />

          <Stack.Screen
            name="DishDetail"
            component={
              DishDetailScreen
            }
            options={{
              title: "Platillo"
            }}
          />

          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{
              title: "Carrito"
            }}
          />

          <Stack.Screen
            name="OrderConfirmation"
            component={
              OrderConfirmationScreen
            }
            options={{
              title: "Confirmar orden"
            }}
          />

        </Stack.Navigator>

      ) : (

        <AuthNavigator />

      )}

    </NavigationContainer>

  );

};


export default AppNavigator;