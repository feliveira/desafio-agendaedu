import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@redux/store";
import {
  fetchStudents,
  createStudent,
  editStudent,
  deleteStudent,
} from "@redux/studentsSlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RoutesParamList } from "../types/navigation";
import Toast from "react-native-toast-message";
import GenericModal from "@components/ClassStudentModal";
import ConfirmDeleteModal from "@components/ConfirmDeleteModal";
import ListItem from "@components/ListItem";
import { useNavigation } from "@hooks/useNavigation";

type StudentsScreenRouteProp = RouteProp<RoutesParamList, "students">

const STUDENTS_PER_PAGE_LIMIT = 5

type ModalAction = "create" | "edit"

type StudentModalState = {
  visible: boolean
  action: ModalAction
}

export default function StudentsListScreen() {
  const route = useRoute<StudentsScreenRouteProp>()
  const { classId, name: className } = route.params

  const { navigate } = useNavigation()

  const dispatch: AppDispatch = useDispatch()
  const { students, status, error } = useSelector(
    (state: RootState) => state.students
  )

  const [studentModal, setStudentModal] = useState<StudentModalState>({
    visible: false,
    action: "create",
  })

  const [studentNameInput, setStudentNameInput] = useState("")

  const [page, setPage] = useState(1)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      const result = await dispatch(
        fetchStudents({ page: 1, limit: STUDENTS_PER_PAGE_LIMIT, classId })
      )
      if (fetchStudents.fulfilled.match(result)) {
        setHasMore(result.payload.hasMore)
        setPage(1)
      }
    }

    fetchInitial()
  }, [])

  useEffect(() => {
    if (status === "failed" && error) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "Ocorreu um erro, por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }, [status, error])

  const loadMoreStudents = async () => {
    if (isFetchingMore || !hasMore) return

    setIsFetchingMore(true)
    const nextPage = page + 1

    const result = await dispatch(
      fetchStudents({ page: nextPage, limit: STUDENTS_PER_PAGE_LIMIT, classId })
    )
    if (fetchStudents.fulfilled.match(result)) {
      setPage(nextPage)
      const { hasMore } = result.payload
      setHasMore(hasMore)
    }

    setIsFetchingMore(false)
  }

  const toggleStudentModalVisibility = () => {
    setStudentModal((state) => ({
      ...state,
      action: "create",
      visible: !state.visible,
    }))
  }

  const handleCreateStudent = async (studentName: string) => {
    if (studentName.trim() === "") {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "O nome do(a) aluno(a) não pode estar vazio.",
        visibilityTime: 1000,
      })
      return
    }

    const resultAction = await dispatch(
      createStudent({ classId: classId, name: studentName })
    )

    if (createStudent.fulfilled.match(resultAction)) {
      setStudentNameInput("")
      toggleStudentModalVisibility()
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A turma foi criada com sucesso!",
        visibilityTime: 400,
      })
    } else if (createStudent.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao criar o(a) aluno(a). Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const handleEditStudent = async (studentName: string) => {
    if (studentName.trim() === "") {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "O nome do(a) aluno(a) não pode estar vazio.",
        visibilityTime: 1000,
      })
      return
    }

    const resultAction = await dispatch(
      editStudent({ id: classId, newName: studentName })
    )

    if (editStudent.fulfilled.match(resultAction)) {
      setStudentNameInput("")
      toggleStudentModalVisibility()
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "O(A) aluno(a) foi editado(a) com sucesso!",
        visibilityTime: 400,
      })
    } else if (editStudent.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao editar o(a) aluno(a). Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const handleStudentDelete = async () => {
    const resultAction = await dispatch(deleteStudent(selectedStudentId!))

    if (deleteStudent.fulfilled.match(resultAction)) {
      setStudentNameInput("")
      setSelectedStudentId(null)
      setIsDeleteModalVisible(false)

      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "O(a) aluno(a) foi deletado(a) com sucesso!",
        visibilityTime: 400,
      })
    } else if (deleteStudent.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao deletar o(a) aluno(a). Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const openEditModal = (classId: string) => {
    setSelectedStudentId(classId)
    setStudentNameInput(
      students.find((student) => student.id === selectedStudentId)!.name
    )
    setStudentModal((state) => ({ ...state, visible: true, action: "edit" }))
  }

  const openDeleteModal = (classId: string) => {
    setSelectedStudentId(classId)
    setIsDeleteModalVisible(true)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        backgroundColor={studentModal.visible ? "#00000080" : "#F9FAFB"}
        barStyle="dark-content"
      />
      <View className="w-full bg-[#E8DDFF] py-3.5 px-4">
        <Text className="font-semibold text-[#773DD3] text-2xl text-center">
          turma: {className}
        </Text>
      </View>

      {status === "loading" ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#773DD3" />
          <Text className="mt-2 text-lg text-gray-600">
            Carregando alunos...
          </Text>
        </View>
      ) : students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          className="px-4 mt-4"
          renderItem={({ item }) => (
            <ListItem
              id={item.id}
              name={item.name}
              onDelete={openDeleteModal}
              onEdit={openEditModal}
              onPress={() =>
                navigate("student", {
                  id: item.id,
                  classId: classId,
                  className: className,
                  name: item.name,
                })
              }
            />
          )}
          ListFooterComponent={() =>
            hasMore ? (
              <View className="py-6 items-center">
                <TouchableOpacity
                  onPress={loadMoreStudents}
                  disabled={isFetchingMore}
                  className="bg-[#E8DDFF] rounded-lg w-full items-center justify-center py-4 max-w-[299px]"
                >
                  {isFetchingMore ? (
                    <ActivityIndicator color="#773DD3" size={24} />
                  ) : (
                    <Text className="text-lg text-[#773DD3] font-semibold">
                      Carregar mais
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null
          }
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
          className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-4 max-w-[299px]"
          onPress={toggleStudentModalVisibility}
          disabled={status === "loading"}
        >
          {status === "loading" && studentModal.visible ? (
            <ActivityIndicator color="#FAF9F9" />
          ) : (
            <Text className="text-2xl text-[#FAF9F9] font-regular">
              Criar aluno
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <GenericModal
        visible={studentModal.visible}
        onClose={toggleStudentModalVisibility}
        onConfirm={
          studentModal.action == "create"
            ? handleCreateStudent
            : handleEditStudent
        }
        loading={status === "loading"}
        title="Nome do(a) aluno(a)"
        actionText={
          studentModal.action == "create" ? "Criar aluno(a)" : "Editar aluno(a)"
        }
        initialValue={studentNameInput}
      />

      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleStudentDelete}
        title="Deletar turma"
      />
    </SafeAreaView>
  )
}
