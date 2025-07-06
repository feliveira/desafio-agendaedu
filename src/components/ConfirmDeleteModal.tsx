import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native"

interface ConfirmDeleteModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title: string
}

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
  title,
}: ConfirmDeleteModalProps) {
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
              <Text className="text-xl text-gray-700 font-semibold mb-4">{title}</Text>
              <Text className="text-lg font-regular text-gray-600 mb-6">
                Tem certeza de que deseja deletar? Essa ação não pode ser desfeita.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-[#9a031e] rounded-lg w-full items-center justify-center py-5 mb-4"
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-xl text-white font-regular">Deletar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full items-center justify-center py-4"
                onPress={onClose}
              >
                <Text className="text-base text-gray-500 font-regular">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
