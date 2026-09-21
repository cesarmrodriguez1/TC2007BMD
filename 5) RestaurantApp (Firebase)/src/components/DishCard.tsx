import React from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  Dish
} from "../types";

interface Props {
  dish: Dish;
  onPress: () => void;
  onAdd: () => void;
}

export default function DishCard({
  dish,
  onPress,
  onAdd
}: Props) {

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >

      <Image
        source={{
          uri: dish.image
        }}
        style={styles.image}
      />

      <View style={styles.content}>

        <View style={styles.info}>

          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {dish.name}
          </Text>

          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {dish.description}
          </Text>

          <Text style={styles.price}>
            ${dish.price.toFixed(2)}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={event => {

            event.stopPropagation();

            onAdd();

          }}
        >

          <Text style={styles.addText}>
            +
          </Text>

        </TouchableOpacity>

      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3
  },

  image: {
    width: "100%",
    height: 180
  },

  content: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center"
  },

  info: {
    flex: 1,
    paddingRight: 10
  },

  name: {
    fontSize: 19,
    fontWeight: "800"
  },

  description: {
    color: "#777",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5
  },

  price: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 8
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center"
  },

  addText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "400"
  }

});