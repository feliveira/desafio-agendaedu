import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@redux/store";
import {
  fetchStudents,
  createStudent,
} from "@redux/studentsSlice";
import StudentItem from "@components/StudentItem";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RoutesParamList } from "../types/navigation";
import { Pen, X } from "lucide-react-native";

type StudentsScreenRouteProp = RouteProp<RoutesParamList, "students">

export default function StudentsScreen() {
  const route = useRoute<StudentsScreenRouteProp>()
  const { classId, name: className } = route.params

  const dispatch: AppDispatch = useDispatch()
  const { students, status, error } = useSelector(
    (state: RootState) => state.students
  )

  const [isCreateStudentVisible, setIsCreateStudentVisible] = useState(false)
  const [studentNameInput, setStudentNameInput] = useState("")

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStudents())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (status === "failed" && error) {
      Alert.alert("Error", error)
    }
  }, [status, error])

  const toggleIsCreateStudentVisible = () => {
    setIsCreateStudentVisible(!isCreateStudentVisible)
  }

  const handleCreateStudent = async () => {
    if (studentNameInput.trim() === "") {
      Alert.alert("Erro", "O nome do aluno não pode estar vazio.")
      return
    }

    const resultAction = await dispatch(
      createStudent({ name: studentNameInput, classId: classId })
    )

    if (createStudent.fulfilled.match(resultAction)) {
      setStudentNameInput("")
      toggleIsCreateStudentVisible()
    } else if (createStudent.rejected.match(resultAction)) {
      Alert.alert(
        "Erro",
        (resultAction.payload as string) || "Não foi possível criar o aluno."
      )
    }
  }

  const studentsInCurrentClass = students.filter(
    (student) => student.classId === classId
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        backgroundColor={isCreateStudentVisible ? "#00000080" : "#F9FAFB"}
        barStyle="dark-content"
      />
      <View
        className="w-full bg-[#E8DDFF] flex-row items-center justify-between py-3.5 px-4"
      >
        <TouchableOpacity
        activeOpacity={0.8}
        >
          <Pen width={20} color={"#2B2D2F"} />
        </TouchableOpacity>
        <Text className="font-semibold text-[#773DD3] text-2xl">
          turma: {className}
        </Text>
        <TouchableOpacity
        activeOpacity={0.8}
        >
          <X width={20} color={"#2B2D2F"} />
        </TouchableOpacity>
      </View>

      {status === "loading" ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#773DD3" />
          <Text className="mt-2 text-lg text-gray-600">
            Carregando alunos...
          </Text>
        </View>
      ) : studentsInCurrentClass.length > 0 ? (
        <FlatList
          data={studentsInCurrentClass}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentItem id={item.id} name={item.name} classId={item.classId} />
          )}
          className="px-4 mt-4"
        />
      ) : (
        <View className="justify-center items-center flex-1">
          <Text className="font-regular text-center text-2xl text-[#2B2D2F] px-4">
            Crie seu primeiro aluno e{"\n"}
            comece a registrar{"\n"}
            suas observações!
          </Text>
        </View>
      )}

      <View className="mt-auto p-4 items-center">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-6 max-w-[299px]"
          onPress={toggleIsCreateStudentVisible}
          disabled={status === "loading"}
        >
          {status === "loading" && isCreateStudentVisible ? (
            <ActivityIndicator color="#FAF9F9" />
          ) : (
            <Text className="text-3xl text-[#FAF9F9] font-regular">
              Criar aluno
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateStudentVisible}
        onRequestClose={toggleIsCreateStudentVisible}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="items-end justify-end bg-black/50 absolute inset-0"
          onPress={toggleIsCreateStudentVisible}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl p-6 w-full shadow-lg">
              <Text className="text-lg text-gray-700 mb-2">Nome do aluno</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-lg mb-6 focus:border-[#773DD3]"
                placeholder="Digite o nome do aluno"
                value={studentNameInput}
                onChangeText={setStudentNameInput}
                editable={status !== "loading"}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-6"
                onPress={handleCreateStudent}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <ActivityIndicator color="#FAF9F9" />
                ) : (
                  <Text className="text-3xl text-[#FAF9F9] font-regular">
                    Criar aluno
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}
