import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import Signup from "./src/screens/Signup";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import AddItem from "./src/screens/AddItem";
import ItemDetails from "./src/screens/ItemDetails";
import Cart from "./src/screens/Cart";
import { CartProvider } from "./src/context/cartContext"; // ✅ import

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <CartProvider> {/* ✅ Wrap everything inside this */}
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddItem" component={AddItem} />
            <Stack.Screen name="ItemDetails" component={ItemDetails} />
            <Stack.Screen name="Cart" component={Cart} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </PaperProvider>
  );
}
