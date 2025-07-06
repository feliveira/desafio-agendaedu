import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

interface GenericModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  loading?: boolean
  title: string    
  actionText: string 
  initialValue?: string
}

export default function GenericModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
  title,
  actionText,
  initialValue = "",
}: GenericModalProps) {
  const [inputValue, setInputValue] = useState(initialValue)

  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue, visible])

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end z-[1000]">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl p-6 w-full shadow-lg">
              <Text className="text-xl font-bold text-gray-700 mb-2">{title}</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-lg mb-6 font-regular"
                placeholder={`Digite ${title.toLowerCase()}`}
                value={inputValue}
                onChangeText={setInputValue}
                editable={!loading}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-4"
                onPress={() => onConfirm(inputValue)}
                disabled={loading || inputValue.trim() === ""}
              >
                {loading ? (
                  <ActivityIndicator color="#FAF9F9" />
                ) : (
                  <Text className="text-2xl text-[#FAF9F9] font-regular">
                    {actionText}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
