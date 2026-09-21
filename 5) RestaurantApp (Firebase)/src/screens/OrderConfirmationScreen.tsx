import React, {
  useState
} from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  useCart
} from "../context/CartContext";

import {
  createOrder
} from "../services/orderService";

interface OrderConfirmationScreenProps {
  navigation: any;
}

const OrderConfirmationScreen = ({
  navigation
}: OrderConfirmationScreenProps) => {

  const {
    items,
    total,
    clearCart
  } = useCart();

  const [
    loading,
    setLoading
  ] = useState(false);

  const handleCreateOrder =
    async () => {

      if (items.length === 0) {

        Alert.alert(
          "Carrito vacío",
          "No hay platillos para ordenar."
        );

        return;
      }

      try {

        setLoading(true);

        const orderId =
          await createOrder(
            items
          );

        /*
         * NUEVO:
         * Al confirmar la orden,
         * también se elimina inmediatamente
         * users/{uid}/cart/current.
         */
        await clearCart();

        Alert.alert(
          "Orden realizada",
          `Tu orden fue registrada correctamente.\n\nNúmero de orden: ${orderId}`,
          [
            {
              text: "Aceptar",
              onPress: () =>
                navigation.navigate(
                  "Menu"
                )
            }
          ]
        );

      } catch (error: any) {

        console.log(
          "Error creando orden:",
          error
        );

        Alert.alert(
          "Error",
          error.message ||
            "No fue posible guardar la orden."
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Confirmar orden
      </Text>

      <View style={styles.card}>

        <Text style={styles.subtitle}>
          Resumen de la orden
        </Text>

        {items.map(item => (

          <View
            key={item.dishId}
            style={styles.item}
          >

            <View style={styles.itemInfo}>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.quantity}>
                Cantidad: {item.quantity}
              </Text>

            </View>

            <Text style={styles.subtotal}>
              $
              {(
                item.price *
                item.quantity
              ).toFixed(2)}
            </Text>

          </View>

        ))}

        <View style={styles.separator} />

        <View style={styles.totalRow}>

          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.total}>
            ${total.toFixed(2)}
          </Text>

        </View>

      </View>

      <TouchableOpacity
        style={[
          styles.button,
          loading &&
            styles.buttonDisabled
        ]}
        onPress={
          handleCreateOrder
        }
        disabled={loading}
        activeOpacity={0.8}
      >

        {loading ? (

          <ActivityIndicator
            color="#FFFFFF"
          />

        ) : (

          <Text style={styles.buttonText}>
            Confirmar y guardar orden
          </Text>

        )}

      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    elevation: 4
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },

  itemInfo: {
    flex: 1
  },

  name: {
    fontSize: 16,
    fontWeight: "700"
  },

  quantity: {
    color: "#666666",
    marginTop: 4
  },

  subtotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D35400"
  },

  separator: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "700"
  },

  total: {
    fontSize: 24,
    fontWeight: "800",
    color: "#D35400"
  },

  button: {
    marginTop: 25,
    backgroundColor: "#D35400",
    borderRadius: 16,
    padding: 17,
    alignItems: "center"
  },

  buttonDisabled: {
    opacity: 0.6
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700"
  }

});

export default OrderConfirmationScreen;