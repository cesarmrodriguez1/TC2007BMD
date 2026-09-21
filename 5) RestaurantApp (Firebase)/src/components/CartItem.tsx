import React from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  CartItem as CartItemType
} from "../types";

import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove
}: CartItemProps) => {

  const subtotal =
    item.price *
    item.quantity;

  return (
    <View style={styles.container}>

      <Image
        source={{
          uri: item.image
        }}
        style={styles.image}
      />

      <View style={styles.info}>

        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.price}>
          ${item.price.toFixed(2)}
        </Text>

        <QuantitySelector
          quantity={item.quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />

        <Text style={styles.subtotal}>
          Subtotal: $
          {subtotal.toFixed(2)}
        </Text>

        <TouchableOpacity
          onPress={onRemove}
        >
          <Text style={styles.remove}>
            Eliminar
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12
  },

  info: {
    flex: 1,
    marginLeft: 12
  },

  name: {
    fontSize: 17,
    fontWeight: "700"
  },

  price: {
    marginVertical: 4,
    color: "#D35400"
  },

  subtotal: {
    marginTop: 7,
    fontWeight: "600"
  },

  remove: {
    color: "#C62828",
    marginTop: 8,
    fontWeight: "600"
  }

});

export default CartItem;