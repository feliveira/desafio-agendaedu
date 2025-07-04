import React from "react";
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import HomeScreen from "@screens/HomeScreen"; 
import ClassesScreen from "@screens/ClassesScreen";
import StudentsScreen from "@screens/StudentsScreens";

const Stack = createNativeStackNavigator();

const headerStyles: NativeStackNavigationOptions = {
  headerTitleAlign: "left",
  headerTintColor: "#31223E",
  headerTitleStyle: {
    fontSize: 28,
    fontFamily: "Poppins_600SemiBold",
  },
  headerStyle: {
    backgroundColor: "#FAF9F9",
  },
  headerShadowVisible: false,
}


export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="classes"
        component={ClassesScreen}
        options={{ title: "Turmas", ...headerStyles }}
      />
      <Stack.Screen
        name="students"
        component={StudentsScreen}
        options={{ title: "Alunos", ...headerStyles }}
      />
    </Stack.Navigator>
  )
}
