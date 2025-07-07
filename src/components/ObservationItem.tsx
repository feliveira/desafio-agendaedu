import { TouchableOpacity, View, Text } from "react-native";
import { Pen, Star } from "lucide-react-native";

interface ObservationItemProps {
  id: string
  studentName: string
  className: string
  text: string
  createdAt: string
  favorite: boolean
  done: boolean
  onPressStudent: (() => void) | null
  onPressClass: (() => void) | null
  onPressEdit: ((id: string) => void) | null
}

export default function ObservationItem({
  id,
  studentName,
  className,
  text,
  done,
  createdAt,
  favorite,
  onPressStudent,
  onPressClass,
  onPressEdit,
}: ObservationItemProps) {

  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <View className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm relative mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center flex-wrap flex-1">
          <TouchableOpacity onPress={onPressStudent != null ? onPressStudent : () => {}} activeOpacity={0.8}>
            <Text style={{color: onPressStudent != null ? "#773DD3" : "#31223E" }} className="font-bold text-base">
              {studentName}
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 mx-2">|</Text>

          <TouchableOpacity onPress={onPressClass != null ? onPressClass : () => {}} activeOpacity={0.8} className="mr-2">
            <Text  style={{color: onPressClass != null ? "#773DD3" : "#31223E" }} className="font-bold text-base">
              {className}
            </Text>
          </TouchableOpacity>

          <Star
            size={20}
            testID="star-icon"
            color={favorite ? "#FFC700" : "#A0A0A0"}
            fill={favorite ? "#FFC700" : "transparent"}
          />
        </View>

        <Text className="text-gray-500 font-regular text-sm ml-2">{formattedDate}</Text>
      </View>

      <View>
        <Text className="text-[#31223E] font-regular text-base leading-6">{text}</Text>
      </View>

      <View className="flex-row items-center justify-between mt-4">
        {
          done &&
          <View
          className="bg-[#588157] px-3 h-8 rounded shadow-lg items-center justify-center"
        >
          <Text className="text-white text-xs font-regular">DONE</Text>
        </View>
        }
        {
          onPressEdit != null &&
          <TouchableOpacity
          onPress={() => onPressEdit(id)}
          testID="edit-button"
          activeOpacity={0.8}
          className="bg-[#773DD3] w-8 h-8 rounded shadow-lg items-center self-end justify-center"
        >
          <Pen size={10} color="#FFFFFF" />
        </TouchableOpacity>
        }
      </View>
    </View>
  )
}
