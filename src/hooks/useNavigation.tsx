import { useNavigation as nativeUseNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoutesParamList } from "../types/navigation";

export const useNavigation = () =>
  nativeUseNavigation<NativeStackNavigationProp<RoutesParamList>>()
