import { useNavigation } from "@hooks/useNavigation";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";

export default function StudentItem({ id, name, classId }: { id: string, name: string, classId: string }) {

    const { navigate } = useNavigation()

    return (
        <TouchableOpacity 
        onPress={() => navigate('student', { id: id, classId: classId, name: name })}
        activeOpacity={0.8} 
        className="flex-row justify-between items-center bg-[#F3F3F3]  border border-[#2B2D2F]/20 px-4 py-4 mb-4 rounded-lg shadow-sm">
            <Text className="text-2xl text-[#2B2D2F] font-regular">{name}</Text>
            <ChevronRight color={"#2B2D2F"} />
        </TouchableOpacity>
    )
}
