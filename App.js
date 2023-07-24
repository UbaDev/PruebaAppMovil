import * as React from "react";
import { PaperProvider } from "react-native-paper";
import Main from "./Main";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Main />
    </NavigationContainer>
      
    </PaperProvider>
  );
}
