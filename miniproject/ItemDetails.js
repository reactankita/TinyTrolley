import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useCart } from "../context/cartContext";

export default function ItemDetails({ route, navigation }) {
  const { item } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={item.name} />
        <Card.Content>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Price: ₹{item.price || "N/A"}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleAddToCart}
            style={styles.cartButton}
          >
            Add to Cart
          </Button>
          <Button onPress={() => navigation.goBack()} textColor="#6A0DAD">
            Back
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  cartButton: { backgroundColor: "#8B5CF6" },
});
