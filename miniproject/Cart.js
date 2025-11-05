import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useCart } from "../context/cartContext";

export default function Cart({ navigation }) {
  const { cart, removeFromCart, clearCart } = useCart();

  // ✅ Convert "1kg", "500g", "2L" → numeric multipliers
  const parseQuantity = (q) => {
    if (!q) return 1;
    const str = String(q).toLowerCase().trim();
    const num = parseFloat(str.match(/\d+(\.\d+)?/)) || 1;

    if (str.includes("kg")) return num; // price is per kg
    if (str.includes("g")) return num / 1000; // 500g = 0.5 kg
    if (str.includes("l")) return num; // liters
    if (str.includes("ml")) return num / 1000; // 250ml = 0.25 L
    if (str.includes("pcs") || str.includes("piece")) return num;
    return num;
  };

  // ✅ Calculate total safely
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/[^\d.]/g, "")) || 0;
    const qty = parseQuantity(item.quantity);
    return sum + price * qty;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍️ My Cart 🛒</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title
                  title={item.name}
                  subtitle={`Qty: ${item.quantity || 1} | ₹${Number(item.price).toFixed(2)}`}
                  titleStyle={styles.cardTitle}
                  subtitleStyle={styles.cardSubtitle}
                />
                <Card.Actions>
                  <Button
                    onPress={() => removeFromCart(item.id)}
                    textColor="red"
                  >
                    Remove
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />

          {/* ✅ Total amount */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ₹{total.toFixed(2)}</Text>
            <Button
              mode="contained"
              style={styles.checkoutButton}
              onPress={() => {
                alert("Checkout successful!");
                clearCart();
              }}
            >
              Checkout
            </Button>
          </View>
        </>
      )}

      {/* Go back button */}
      <Button
        mode="outlined"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4FC",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4B0082",
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#EFE4FB",
    borderRadius: 12,
    marginVertical: 6,
  },
  cardTitle: {
    color: "#2E0854",
    fontWeight: "600",
  },
  cardSubtitle: {
    color: "#4B0082",
  },
  totalContainer: {
    marginTop: 20,
    backgroundColor: "#E9D5FF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B0764",
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: "#8B5CF6",
  },
  backButton: {
    marginTop: 20,
    borderColor: "#8B5CF6",
  },
});
