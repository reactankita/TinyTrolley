import React, { useEffect, useState } from "react";
import { View, FlatList, TextInput, StyleSheet } from "react-native";
import { Text, FAB, Card, Button } from "react-native-paper";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getProductInfo } from "../utils/productAPI"; // price API helper
import { useCart } from "../context/cartContext"; // ✅ import global cart

export default function Home({ navigation }) {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [prices, setPrices] = useState({});
  const { addToCart } = useCart(); // ✅ get addToCart from context

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "groceries"));
    const list = [];
    querySnapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    setItems(list);

    // ✅ Fetch prices
    const priceMap = {};
    for (const item of list) {
      const info = await getProductInfo(item.name);
      priceMap[item.name] = info.price || 0;
    }
    setPrices(priceMap);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchItems);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "groceries", id));
    fetchItems();
  };

  const handleAddToCart = (item) => {
  // Convert price to a clean number (remove ₹ or text)
  const rawPrice = prices[item.name];
  const price = parseFloat(String(rawPrice).replace(/[^\d.]/g, "")) || 0;

  addToCart({ ...item, price });
  alert(`${item.name} added to cart!`);
  };

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        🛒 My Grocery List 🛍️
      </Text>

      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search items..."
        placeholderTextColor="#666"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Grocery List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.name}
              subtitle={`Qty: ${item.quantity}`}
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardSubtitle}
            />
            <Card.Content>
              <Text style={styles.priceText}>
                Price: ₹{prices[item.name] || "Loading..."}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate("ItemDetails", { item })}
                textColor="#6A0DAD"
              >
                View
              </Button>
              <Button onPress={() => handleDelete(item.id)} textColor="red">
                Delete
              </Button>
              <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                Add to Cart
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      {/* Floating cart and add buttons */}
      <FAB
        icon="cart"
        style={styles.fabCart}
        onPress={() => navigation.navigate("Cart")}
      />
      <FAB
        icon="plus"
        style={styles.fabAdd}
        onPress={() => navigation.navigate("AddItem")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8F4FC",
  },
  title: {
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "bold",
    color: "#4B0082",
    fontSize: 24,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBA6F7",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    color: "#333",
  },
  card: {
    marginVertical: 8,
    backgroundColor: "#EFE4FB",
    borderRadius: 12,
    elevation: 0,
  },
  cardTitle: {
    color: "#2E0854",
    fontWeight: "600",
    fontSize: 16,
  },
  cardSubtitle: {
    color: "#4B0082",
    fontSize: 14,
  },
  priceText: {
    color: "#2E0854",
    marginTop: 5,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    marginLeft: 5,
  },
  fabAdd: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#8B5CF6",
  },
  fabCart: {
    position: "absolute",
    right: 16,
    bottom: 80,
    backgroundColor: "#6A0DAD",
  },
});
