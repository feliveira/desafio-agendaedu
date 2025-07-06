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
  fetchClasses,
  createClass,
  editClass,
  deleteClass,
} from "@redux/classesSlice";

import ClassItem from "@components/ClassItem";
import GenericModal from "@components/GenericModal";

import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmDeleteModal from "@components/ConfirmDeleteModal";

type ModalAction = "create" | "edit"

const CLASS_PER_PAGE_LIMIT = 5

type ClassModalState = {
  visible: boolean
  action: ModalAction
}

export default function ClassesScreen() {
  const dispatch: AppDispatch = useDispatch()
  const { classes, status, error } = useSelector(
    (state: RootState) => state.classes
  )

  const [classModal, setClassModal] = useState<ClassModalState>({
    visible: false,
    action: "create",
  })

  const [page, setPage] = useState(1)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [classNameInput, setClassNameInput] = useState("")

  useEffect(() => {
    const showSwipeHint = async () => {
      if (classes.length <= 1) return

      const hasSeenHint = await AsyncStorage.getItem("seenSwipeHint")
      if (!hasSeenHint) {
        Toast.show({
          type: "customInfo",
          text1: "💡 Dica",
          text2:
            "Deslize para a esquerda para deletar ou para a direita para editar.",
          visibilityTime: 2000,
        })
        await AsyncStorage.setItem("seenSwipeHint", "true")
      }
    }

    showSwipeHint()
  }, [classes])

  useEffect(() => {
    const fetchInitial = async () => {
      const result = await dispatch(fetchClasses({ page: 1, limit: CLASS_PER_PAGE_LIMIT }))
      if (fetchClasses.fulfilled.match(result)) {
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

  const loadMoreClasses = async () => {
    if (isFetchingMore || !hasMore) return

    setIsFetchingMore(true)
    const nextPage = page + 1

    const result = await dispatch(fetchClasses({page: nextPage, limit: CLASS_PER_PAGE_LIMIT }))
    if (fetchClasses.fulfilled.match(result)) {
      setPage(nextPage)
      const { hasMore } = result.payload 
      setHasMore(hasMore)
    }

    setIsFetchingMore(false)
  }

  const toggleClassModalVisibility = () => {
    setClassModal((state) => ({
      ...state,
      action: "create",
      visible: !state.visible,
    }))
  }

  const handleCreateClass = async (className: string) => {
    if (className.trim() === "") {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "O nome da turma não pode estar vazio.",
        visibilityTime: 1000,
      })
      return
    }

    const resultAction = await dispatch(createClass(className))

    if (createClass.fulfilled.match(resultAction)) {
      setClassNameInput("")
      toggleClassModalVisibility()
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A turma foi criada com sucesso!",
        visibilityTime: 400,
      })
    } else if (createClass.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao criar a turma. Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const handleClassEdit = async (className: string) => {
    if (className.trim() === "") {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "O nome da turma não pode estar vazio.",
        visibilityTime: 1000,
      })
      return
    }

    const resultAction = await dispatch(
      editClass({ id: selectedClassId!, newName: className })
    )

    if (editClass.fulfilled.match(resultAction)) {
      setClassNameInput("")
      toggleClassModalVisibility()
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A turma foi editada com sucesso!",
        visibilityTime: 400,
      })

    } else if (editClass.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao editar a turma. Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const handleClassDelete = async () => {
    const resultAction = await dispatch(deleteClass(selectedClassId!))

    if (deleteClass.fulfilled.match(resultAction)) {
      setClassNameInput("")
      setIsDeleteModalVisible(false)

      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A turma foi deletada com sucesso!",
        visibilityTime: 400,
      })

    } else if (deleteClass.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao deletar a turma. Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const openEditModal = (classId: string) => {
    setSelectedClassId(classId)
    setClassNameInput(
      classes.find((classItem) => classItem.id === classId)!.name
    )
    setClassModal((state) => ({ ...state, visible: true, action: "edit" }))
  }

  const openDeleteModal = (classId: string) => {
    setSelectedClassId(classId)
    setIsDeleteModalVisible(true)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        backgroundColor={
          classModal.visible || isDeleteModalVisible ? "#00000080" : "#F9FAFB"
        }
        barStyle="dark-content"
      />

      {status === "loading" ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#773DD3" />
          <Text className="mt-2 text-lg text-gray-600">
            Carregando turmas...
          </Text>
        </View>
      ) : classes.length > 0 ? (
        <FlatList
          data={classes}
          className="px-4 mt-4"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClassItem
              id={item.id}
              name={item.name}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          )}
          ListFooterComponent={() =>
            hasMore ? (
              <View className="py-6 items-center">
                <TouchableOpacity
                  onPress={loadMoreClasses}
                  disabled={isFetchingMore}
                  className="bg-[#E8DDFF] rounded-lg w-full items-center justify-center py-6 max-w-[299px]"
                >
                  {isFetchingMore ? (
                    <ActivityIndicator color="#773DD3" size={24} />
                  ) : (
                    <Text className="text-lg text-[#773DD3] font-semibold">Carregar mais</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      ) : (
        <View className="justify-center items-center flex-1">
          <Text className="font-regular text-center text-2xl text-[#2B2D2F] px-4">
            Crie sua primeira turma e{"\n"}
            facilite o acompanhamento{"\n"}
            dos seus alunos!
          </Text>
        </View>
      )}

      <View className="mt-auto p-4 items-center">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-6 max-w-[299px]"
          onPress={toggleClassModalVisibility}
          disabled={status === "loading"}
        >
          {status === "loading" && classModal.visible ? (
            <ActivityIndicator color="#FAF9F9" />
          ) : (
            <Text className="text-3xl text-[#FAF9F9] font-regular">
              Criar turma
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <GenericModal
        visible={classModal.visible}
        onClose={toggleClassModalVisibility}
        onConfirm={
          classModal.action == "create" ? handleCreateClass : handleClassEdit
        }
        loading={status === "loading"}
        title="Nome da turma"
        actionText={
          classModal.action == "create" ? "Criar turma" : "Editar turma"
        }
        initialValue={classNameInput}
      />

      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleClassDelete}
        title="Deletar turma"
      />
    </SafeAreaView>
  )
}
