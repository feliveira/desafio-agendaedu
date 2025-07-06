import { View, Text } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  customInfo: ({ text1, text2 }: BaseToastProps) => (
    <View 
    className="p-4 rounded-md w-[90%] self-center shadow-md"
    style={{
        backgroundColor: "#F9FAFB",
        borderLeftWidth: 4,
        borderLeftColor: "#773DD3"
      }}
    >
      <Text style={{color: "#773DD3"}} className="text-xl font-semibold mb-1">{text1}</Text>
      {text2 ? (
        <Text className="text-[#2B2D2F] text-base font-regular">{text2}</Text>
      ) : null}
    </View>
  ),
  customError: ({text1, text2}: BaseToastProps) => (
    <View 
    className="p-4 rounded-md w-[90%] self-center shadow-md"
    style={{
        backgroundColor: "#F9FAFB",
        borderLeftWidth: 4,
        borderLeftColor: "#9a031e"
      }}
    >
      <Text style={{color: "#9a031e"}} className="text-xl font-semibold mb-1">{text1}</Text>
      {text2 ? (
        <Text className="text-[#2B2D2F] text-base font-regular">{text2}</Text>
      ) : null}
    </View>
  ),
  customSuccess: ({text1, text2}: BaseToastProps) => (
    <View 
    className="p-4 rounded-md w-[90%] self-center shadow-md"
    style={{
        backgroundColor: "#F9FAFB",
        borderLeftWidth: 4,
        borderLeftColor: "#588157"
      }}
    >
      <Text style={{color: "#588157"}} className="text-xl font-semibold mb-1">{text1}</Text>
      {text2 ? (
        <Text className="text-[#2B2D2F] text-base font-regular">{text2}</Text>
      ) : null}
    </View>
  ),
}
