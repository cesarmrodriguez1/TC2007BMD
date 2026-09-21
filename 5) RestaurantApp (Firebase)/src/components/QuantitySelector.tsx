import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease
}: Props) {

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.button}
        onPress={onDecrease}
      >

        <Text style={styles.buttonText}>
          −
        </Text>

      </TouchableOpacity>

      <Text style={styles.quantity}>
        {quantity}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onIncrease}
      >

        <Text style={styles.buttonText}>
          +
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 22,
    height: 42,
    overflow: "hidden"
  },

  button: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center"
  },

  buttonText: {
    fontSize: 23,
    fontWeight: "600"
  },

  quantity: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800"
  }

});