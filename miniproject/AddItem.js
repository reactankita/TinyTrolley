import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function AddItem({ navigation }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !quantity.trim()) {
      alert("Please fill in both fields!");
      return;
    }

    try {
      await addDoc(collection(db, "groceries"), { 
        name: name.trim().toLowerCase(), 
        quantity: quantity.trim().toLowerCase() 
      });
      alert(`${name} added successfully!`);
      navigation.goBack();
    } catch (error) {
      alert("Error adding item: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Grocery Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Name (e.g., rice, milk, sugar)"
        placeholderTextColor="#7A5ACD"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity (e.g., 1kg, 500ml, 2pcs)"
        placeholderTextColor="#7A5ACD"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4FC",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#B88AF5",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 22,
    color: "#2E0854", // darker and sharper input text color
    shadowColor: "#CBA6F7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    width: "90%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cancelText: {
    color: "#4B0082",
    marginTop: 25,
    fontSize: 16,
    fontWeight: "500",
  },
});
