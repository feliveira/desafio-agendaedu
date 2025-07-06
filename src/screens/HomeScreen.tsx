import Button from "@components/ui/Button";
import { useNavigation } from "@hooks/useNavigation";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const navigation = useNavigation()

  const getGreeting = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour >= 5 && hour < 12) {
      return "Bom dia"
    } else if (hour >= 12 && hour <= 18) {
      return "Boa tarde"
    } else {
      return "Boa noite"
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F9" }}>
      <ScrollView
        className="flex-1 pt-5 pb-[60px]"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center" style={{ alignItems: "center" }}>
          <Text className="text-4xl text-[#2B2D2F] mt-16 font-regular">Olá</Text>
          <Text className="text-5xl font-semibold color-[#31223E]">
            {getGreeting()}
          </Text>
        </View>

        <Text className="font-regular text-center text-2xl text-[#2B2D2F] px-4">
          Gerencie suas observações{"\n"} 
          sobre os alunos de forma{"\n"} 
          simples e eficiente
        </Text>

        <View className="gap-y-6 w-full items-center">
          <Button
            title="Turmas"
            variant="primary"
            onPress={() => navigation.navigate("classes")}
          />

          <Button
            title="Favoritos"
            variant="secondary"
            onPress={() => navigation.navigate("favorites")}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#FAF9F9" barStyle="dark-content" />
    </SafeAreaView>
  )
}
