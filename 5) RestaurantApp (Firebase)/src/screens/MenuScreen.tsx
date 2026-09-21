import React, {
  useEffect,
  useState
} from "react";

import {
  getDishes
} from "../services/menuService";

import {
  logoutUser
} from "../services/authService";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  NativeStackScreenProps
} from "@react-navigation/native-stack";

import {
  RootStackParamList,
  Dish
} from "../types";

import {
  useCart
} from "../context/CartContext";

import DishCard
  from "../components/DishCard";

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "Menu"
  >;

export default function MenuScreen({
  navigation
}: Props) {

  const [dishes, setDishes] =
    useState<Dish[]>([]);

  const [loading, setLoading] =
    useState(true);

  const {
    addItem,
    itemCount
  } = useCart();

  /*
   * Obtener los platillos desde Firestore.
   *
   * IMPORTANTE:
   * getDishes() devuelve una Promise<Dish[]>.
   * Por eso la función async está DENTRO
   * del useEffect.
   */
  useEffect(() => {

    const loadDishes = async () => {

      try {

        setLoading(true);

        const data =
          await getDishes();

        setDishes(data);

      } catch (error) {

        console.error(
          "Error al obtener el menú:",
          error
        );

        Alert.alert(
          "Error",
          "No fue posible obtener el menú."
        );

      } finally {

        setLoading(false);

      }
    };

    loadDishes();

  }, []);

  const handleLogout = () => {

    Alert.alert(
      "Cerrar sesión",
      "¿Deseas cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },

        {
          text: "Salir",
          style: "destructive",

          onPress: async () => {

            try {

              await logoutUser();

            } catch (error) {

              console.error(error);

              Alert.alert(
                "Error",
                "No fue posible cerrar sesión."
              );

            }

          }

        }

      ]
    );
  };

  const handleAdd = async (
    dish: Dish
  ) => {

    try {

      await addItem(dish);

      Alert.alert(
        "Producto agregado",
        `${dish.name} fue agregado al carrito.`
      );

    } catch (error) {

      console.error(error);

      Alert.alert(
        "Error",
        "No fue posible agregar el producto."
      );

    }

  };

  const renderDish = ({
    item
  }: {
    item: Dish
  }) => {

    return (
      <DishCard

        dish={item}

        onPress={() =>
          navigation.navigate(
            "DishDetail",
            {
              dish: item
            }
          )
        }

        onAdd={() =>
          handleAdd(item)
        }

      />
    );

  };

  if (loading) {

    return (
      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Cargando menú...
        </Text>

      </View>
    );

  }

  return (
    <View
      style={styles.container}
    >

      <View
        style={styles.header}
      >

        <View>

          <Text
            style={styles.welcome}
          >
            ¡Bienvenido!
          </Text>

          <Text
            style={styles.headerTitle}
          >
            Nuestro menú
          </Text>

        </View>

        <View
          style={
            styles.headerActions
          }
        >

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() =>
              navigation.navigate(
                "Cart"
              )
            }
          >

            <Text
              style={styles.cartText}
            >
              🛒 {itemCount}
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >

            <Text
              style={styles.logoutText}
            >
              Salir
            </Text>

          </TouchableOpacity>

        </View>

      </View>

      <FlatList

        data={dishes}

        keyExtractor={
          item => item.id
        }

        renderItem={
          renderDish
        }

        contentContainerStyle={
          styles.list
        }

        showsVerticalScrollIndicator={
          false
        }

      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5"
  },

  loadingText: {
    marginTop: 12,
    color: "#666"
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  welcome: {
    color: "#777",
    fontSize: 13
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    marginTop: 3
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center"
  },

  cartButton: {
    backgroundColor: "#111",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20
  },

  cartText: {
    color: "#fff",
    fontWeight: "700"
  },

  logoutButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },

  logoutText: {
    fontWeight: "700",
    color: "#b00020"
  },

  list: {
    padding: 15,
    paddingBottom: 30
  }

});

