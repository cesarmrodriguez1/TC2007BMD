import React, {
  useState
} from "react";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Dish } from "../types";

import {
  useCart
} from "../context/CartContext";

interface DishDetailScreenProps {
  route: {
    params: {
      dish: Dish;
    };
  };

  navigation: any;
}

const DishDetailScreen = ({
  route,
  navigation
}: DishDetailScreenProps) => {

  const {
    dish
  } = route.params;

  const {
    addItem,
    saving
  } = useCart();

  const [
    added,
    setAdded
  ] = useState(false);

  const handleAddToCart =
    async () => {

      try {

        /*
         * NUEVO:
         * Agregamos el producto al carrito.
         *
         * CartContext se encarga de
         * sincronizarlo inmediatamente
         * con Firebase.
         */
        await addItem({
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          image: dish.image
        });

        setAdded(true);

        Alert.alert(
          "Producto agregado",
          `${dish.name} fue agregado al carrito.`
        );

      } catch (error: any) {

        Alert.alert(
          "Error",
          error.message ||
            "No fue posible agregar el producto al carrito."
        );
      }
    };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >

      <Image
        source={{
          uri: dish.image
        }}
        style={styles.image}
      />

      <View style={styles.info}>

        <Text style={styles.name}>
          {dish.name}
        </Text>

        <Text style={styles.price}>
          ${dish.price.toFixed(2)}
        </Text>

        <Text style={styles.description}>
          {dish.description}
        </Text>

        <Text style={styles.status}>
          {dish.available
            ? "Disponible"
            : "No disponible"}
        </Text>

        {/*
         * NUEVO:
         * Botón para agregar el platillo.
         */}
        <TouchableOpacity
          style={[
            styles.button,
            (
              !dish.available ||
              saving
            ) &&
              styles.buttonDisabled
          ]}
          disabled={
            !dish.available ||
            saving
          }
          onPress={
            handleAddToCart
          }
          activeOpacity={0.8}
        >

          <Text style={styles.buttonText}>
            {saving
              ? "Guardando..."
              : added
                ? "Agregar otra unidad"
                : "Agregar al carrito"}
          </Text>

        </TouchableOpacity>

        {/*
         * NUEVO:
         * Acceso rápido al carrito.
         */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() =>
            navigation.navigate(
              "Cart"
            )
          }
        >

          <Text style={styles.cartButtonText}>
            Ver carrito
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },

  content: {
    paddingBottom: 30
  },

  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover"
  },

  info: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 18,
    elevation: 4
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222222"
  },

  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#D35400",
    marginVertical: 12
  },

  description: {
    fontSize: 17,
    lineHeight: 26,
    color: "#555555"
  },

  status: {
    marginTop: 20,
    color: "#2E7D32",
    fontWeight: "700"
  },

  /*
   * NUEVO:
   * Botón principal.
   */
  button: {
    marginTop: 25,
    backgroundColor: "#D35400",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center"
  },

  buttonDisabled: {
    opacity: 0.5
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700"
  },

  /*
   * NUEVO:
   * Botón para acceder al carrito.
   */
  cartButton: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#D35400",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center"
  },

  cartButtonText: {
    color: "#D35400",
    fontSize: 16,
    fontWeight: "700"
  }

});

export default DishDetailScreen;