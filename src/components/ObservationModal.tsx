import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Switch,
} from "react-native";

import { Star } from "lucide-react-native";

interface ObservationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (value: {
    text: string;
    favorite: boolean;
    done: boolean;
  }) => void;
  onDelete?: () => void;
  action: "create" | "edit";
  actionText: string;
  loading?: boolean;
  initialTextValue?: string;
  isFavorite?: boolean;
  isDone?: boolean;
}

export default function ObservationModal({
  visible,
  onClose,
  onConfirm,
  onDelete,
  loading = false,
  actionText,
  initialTextValue = "",
  isFavorite = false,
  isDone = false,
  action = "create",
}: ObservationModalProps) {
  const [inputValue, setInputValue] = useState(initialTextValue);
  const [favorite, setFavorite] = useState(isFavorite);
  const [done, setDone] = useState(isDone);

  const handleFavoriteUpdate = () => {
    setFavorite((state) => !state);
  };

  const handleConfirm = () => {
    onConfirm({
      text: inputValue,
      favorite: favorite,
      done: done,
    });
  };

  useEffect(() => {
    setInputValue(initialTextValue);
    setFavorite(isFavorite);
    setDone(isDone);
  }, [visible]);

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
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xl font-bold text-[#31223E]">
                  Observação
                </Text>
                <TouchableOpacity
                  onPress={handleFavoriteUpdate}
                  activeOpacity={0.8}
                >
                  <Star color="#31223E" fill={favorite ? "#FACC15" : "none"} />
                </TouchableOpacity>
              </View>
              <TextInput
                className="border border-[#773DD3] caret-[#773DD3] rounded-lg p-4 text-lg mb-6 font-regular"
                placeholder="Digite a sua observação"
                value={inputValue}
                onChangeText={setInputValue}
                multiline
                numberOfLines={4}
                selectionColor="#773DD3"
                style={{ textAlignVertical: 'top' }}
                editable={!loading}
              />

              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-lg font-bold text-[#31223E]">
                  Concluído
                </Text>
                <Switch
                  value={done}
                  onValueChange={setDone}
                  trackColor={{ false: "#D1D5DB", true: "#773DD3" }}
                  thumbColor={done ? "#FAF9F9" : "#FAF9F9"}
                  disabled={loading}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-4"
                onPress={handleConfirm}
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

              {action === "edit" && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="bg-[#9a031e] rounded-lg w-full items-center justify-center py-4 mt-3"
                  onPress={onDelete}
                >
                  <Text className="text-2xl text-[#FAF9F9] font-regular">
                    Deletar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
