import React from "react";

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
  useCart
} from "../context/CartContext";

import CartItem from "../components/CartItem";

interface CartScreenProps {
  navigation: any;
}

const CartScreen = ({
  navigation
}: CartScreenProps) => {

  const {
    items,
    total,
    saving,
    removeItem,
    updateQuantity
  } = useCart();

  const handleConfirmOrder =
    () => {

      if (items.length === 0) {

        Alert.alert(
          "Carrito vacío",
          "Agrega al menos un platillo."
        );

        return;
      }

      navigation.navigate(
        "OrderConfirmation"
      );
    };

  /*
   * NUEVO:
   * Cambiar cantidad y esperar
   * la sincronización con Firebase.
   */
  const handleIncrease =
    async (
      dishId: string,
      quantity: number
    ) => {

      try {

        await updateQuantity(
          dishId,
          quantity + 1
        );

      } catch (error: any) {

        Alert.alert(
          "Error",
          error.message ||
            "No se pudo actualizar el carrito."
        );
      }
    };

  const handleDecrease =
    async (
      dishId: string,
      quantity: number
    ) => {

      try {

        await updateQuantity(
          dishId,
          quantity - 1
        );

      } catch (error: any) {

        Alert.alert(
          "Error",
          error.message ||
            "No se pudo actualizar el carrito."
        );
      }
    };

  const handleRemove =
    async (
      dishId: string
    ) => {

      try {

        await removeItem(
          dishId
        );

      } catch (error: any) {

        Alert.alert(
          "Error",
          error.message ||
            "No se pudo eliminar el producto."
        );
      }
    };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Mi carrito
      </Text>

      {/*
       * NUEVO:
       * Indicador de sincronización.
       */}
      {saving && (

        <View style={styles.syncContainer}>

          <ActivityIndicator
            size="small"
          />

          <Text style={styles.syncText}>
            Sincronizando carrito...
          </Text>

        </View>
      )}

      {items.length === 0 ? (

        <View style={styles.empty}>

          <Text style={styles.emptyText}>
            Tu carrito está vacío.
          </Text>

        </View>

      ) : (

        <>

          <FlatList
            data={items}
            keyExtractor={
              item => item.dishId
            }
            renderItem={({
              item
            }) => (

              <CartItem
                item={item}

                onIncrease={() =>
                  handleIncrease(
                    item.dishId,
                    item.quantity
                  )
                }

                onDecrease={() =>
                  handleDecrease(
                    item.dishId,
                    item.quantity
                  )
                }

                onRemove={() =>
                  handleRemove(
                    item.dishId
                  )
                }
              />

            )}
          />

          <View style={styles.footer}>

            <View style={styles.totalRow}>

              <Text style={styles.totalLabel}>
                Total:
              </Text>

              <Text style={styles.total}>
                ${total.toFixed(2)}
              </Text>

            </View>

            <TouchableOpacity
              style={[
                styles.button,
                saving &&
                  styles.buttonDisabled
              ]}
              onPress={
                handleConfirmOrder
              }
              disabled={saving}
              activeOpacity={0.8}
            >

              <Text style={styles.buttonText}>
                Confirmar orden
              </Text>

            </TouchableOpacity>

          </View>

        </>
      )}

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
    marginBottom: 10
  },

  /*
   * NUEVO:
   * Estado de sincronización.
   */
  syncContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  syncText: {
    marginLeft: 8,
    color: "#666666",
    fontSize: 13
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  emptyText: {
    fontSize: 18,
    color: "#666666"
  },

  footer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginTop: 10,
    elevation: 5
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
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
  }

});

export default CartScreen;