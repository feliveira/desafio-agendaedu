import { Swipeable } from "react-native-gesture-handler";
import { ChevronRight, Pen, X } from "lucide-react-native";
import { Text, TouchableOpacity, View, Animated } from "react-native";

interface ListItemProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPress: () => void;
}

type ActionButtonProps = {
  progress: Animated.AnimatedInterpolation<number>;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  onPress: () => void;
  direction: "left" | "right";
};

const AnimatedActionButton = ({
  progress,
  icon: Icon,
  color,
  onPress,
  direction,
}: ActionButtonProps) => {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [direction === "left" ? -20 : 20, 0],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="w-[60px] items-center justify-center rounded-lg"
      style={{ backgroundColor: color }}
    >
      <Animated.View
        style={{ opacity, transform: [{ scale }, { translateX }] }}
      >
        <Icon color="#fff" size={24} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ListItem({
  id,
  name,
  onDelete,
  onEdit,
  onPress,
}: ListItemProps) {
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _drag: Animated.AnimatedInterpolation<number>
  ) => (
    <AnimatedActionButton
      progress={progress}
      icon={X}
      color="#e11d48"
      onPress={() => onDelete(id)}
      direction="left"
    />
  );

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _drag: Animated.AnimatedInterpolation<number>
  ) => (
    <AnimatedActionButton
      progress={progress}
      icon={Pen}
      color="#2563eb"
      onPress={() => onEdit(id)}
      direction="right"
    />
  );

  return (
    <View className="mb-4 rounded-lg overflow-hidden shadow-sm">
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        overshootFriction={8}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          className="flex-row items-center justify-between bg-[#F3F3F3] border border-[#2B2D2F]/20 px-4 py-4 rounded-lg"
        >
          <Text className="text-2xl text-[#2B2D2F] font-regular">{name}</Text>
          <ChevronRight color="#2B2D2F" />
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
}
