import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: "primary" | "secondary"
}

export default function Button({ title, variant = "primary", className, ...props }: ButtonProps) {
  const isPrimary = variant === "primary"

  const containerStyles = `
    rounded-lg w-full items-center justify-center py-4 max-w-[299px]
    ${isPrimary ? "bg-[#773DD3]" : "bg-[#E8DDFF]"}
    ${className || ""}
  `

  const textStyles = `
    text-2xl font-regular
    ${isPrimary ? "text-[#FAF9F9]" : "text-[#773DD3]"}
  `

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={containerStyles}
      {...props}
    >
      <Text className={textStyles}>{title}</Text>
    </TouchableOpacity>
  )
}
