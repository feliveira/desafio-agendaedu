import { useState, useEffect } from "react";

import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native"

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@redux/store";
import {
  fetchObservations,
  createObservation,
  editObservation,
  deleteObservation,
} from "@redux/observationsSlice";

import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@hooks/useNavigation";
import { RoutesParamList } from "../types/navigation";

import Toast from "react-native-toast-message";

import ConfirmDeleteModal from "@components/ConfirmDeleteModal";
import ObservationItem from "@components/ObservationItem";
import ObservationModal from "@components/ObservationModal";

type StudentsScreenRouteProp = RouteProp<RoutesParamList, "student">

const OBSERVATIONS_PER_PAGE_LIMIT = 5

type ModalAction = "create" | "edit"

type ObservationModalState = {
  visible: boolean
  action: ModalAction
}

export default function StudentObservationsScreen() {
  const route = useRoute<StudentsScreenRouteProp>()
  const { classId, className, id: studentId, name: studentName } = route.params

  const { navigate } = useNavigation()

  const dispatch: AppDispatch = useDispatch()
  const { observations, status, error } = useSelector(
    (state: RootState) => state.observations
  )

  const [observationModal, setObservationModal] =
    useState<ObservationModalState>({
      visible: false,
      action: "create",
    })

  const [page, setPage] = useState(1)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [selectedObservation, setSelectedObservation] = useState<{
    id: string
    text?: string
    favorite?: boolean
    done?: boolean
  } | null>(null)

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      const result = await dispatch(
        fetchObservations({
          page: 1,
          limit: OBSERVATIONS_PER_PAGE_LIMIT,
          studentId,
        })
      )
      if (fetchObservations.fulfilled.match(result)) {
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

  const loadMoreObservations = async () => {
    if (isFetchingMore || !hasMore) return

    setIsFetchingMore(true)
    const nextPage = page + 1

    const result = await dispatch(
      fetchObservations({
        page: nextPage,
        limit: OBSERVATIONS_PER_PAGE_LIMIT,
        studentId,
      })
    )
    if (fetchObservations.fulfilled.match(result)) {
      setPage(nextPage)
      const { hasMore } = result.payload
      setHasMore(hasMore)
    }

    setIsFetchingMore(false)
  }

  const toggleObservationModalVisibility = () => {
    setObservationModal((state) => ({
      ...state,
      action: "create",
      visible: !state.visible,
    }))
  }

  const handleCreateObservation = async ({
    text,
    favorite,
    done,
  }: {
    text: string
    favorite: boolean
    done: boolean
  }) => {
    if (text.trim() === "") {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "A observação não pode estar vazia.",
        visibilityTime: 1000,
      })
      return
    }

    const resultAction = await dispatch(
      createObservation({
        classId: classId,
        className: className,
        text: text,
        studentId: studentId,
        studentName: studentName,
        done: done,
        favorite: favorite,
        createdAt: new Date().toISOString(),
      })
    )

    if (createObservation.fulfilled.match(resultAction)) {
      toggleObservationModalVisibility()
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A observação foi criada com sucesso!",
        visibilityTime: 400,
      })
    } else if (createObservation.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao criar a observação. Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const handleEditObservation = async ({
    text,
    favorite,
    done,
  }: {
    text: string
    favorite: boolean
    done: boolean
  }) => {
    if (studentName.trim() === "") {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "A observação não pode estar vazia.",
        visibilityTime: 1000,
      })
      return
    }
    const resultAction = await dispatch(
      editObservation({
        id: selectedObservation!.id,
        text: text,
        favorite: favorite,
        done: done,
      })
    )
    if (editObservation.fulfilled.match(resultAction)) {
      toggleObservationModalVisibility()
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A observação foi editada com sucesso!",
        visibilityTime: 400,
      })
    } else if (editObservation.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao editar a observação. Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const handleDeleteObservation = async () => {
    const resultAction = await dispatch(
      deleteObservation(selectedObservation!.id)
    )
    if (deleteObservation.fulfilled.match(resultAction)) {
      setSelectedObservation(null)
      setIsDeleteModalVisible(false)
      Toast.show({
        type: "customSuccess",
        text1: "✅ Sucesso",
        text2: "A observação foi deletada com sucesso!",
        visibilityTime: 400,
      })
    } else if (deleteObservation.rejected.match(resultAction)) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2:
          "Ocorreu um erro ao deletar a observação. Por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      })
    }
  }

  const openEditModal = (observationId: string) => {
    const observation = observations.find(
      (observation) => observation.id === observationId
    )
    setSelectedObservation({
      id: observationId,
      text: observation!.text,
      done: observation!.done,
      favorite: observation!.favorite,
    })
    setObservationModal((state) => ({
      ...state,
      visible: true,
      action: "edit",
    }))
  }

  const openDeleteModal = () => {
    setIsDeleteModalVisible(true)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        backgroundColor={observationModal.visible ? "#00000080" : "#F9FAFB"}
        barStyle="dark-content"
      />
      <View className="w-full bg-[#E8DDFF] py-3.5 px-4">
        <Text className="font-semibold text-[#773DD3] text-2xl text-center">
          {studentName}
        </Text>
      </View>

      {status === "loading" ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#773DD3" />
          <Text className="mt-2 text-lg text-gray-600">
            Carregando observações...
          </Text>
        </View>
      ) : observations.length > 0 ? (
        <FlatList
          data={observations}
          keyExtractor={(item) => item.id}
          className="px-4 mt-4"
          renderItem={({ item }) => (
            <ObservationItem
              id={item.id}
              text={item.text}
              favorite={item.favorite}
              studentName={item.studentName}
              className={className}
              done={item.done}
              createdAt={item.createdAt}
              onPressClass={() =>
                navigate("students", { classId: classId, name: className })
              }
              onPressStudent={null}
              onPressEdit={openEditModal}
            />
          )}
          ListFooterComponent={() =>
            hasMore ? (
              <View className="py-6 items-center">
                <TouchableOpacity
                  onPress={loadMoreObservations}
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
            Crie sua primeira{"\n"}
            observação sobre{"\n"}
            {studentName}!
          </Text>
        </View>
      )}

      <View className="mt-auto p-4 items-center">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-4 max-w-[299px]"
          onPress={toggleObservationModalVisibility}
          disabled={status === "loading"}
        >
          {status === "loading" && observationModal.visible ? (
            <ActivityIndicator color="#FAF9F9" />
          ) : (
            <Text className="text-2xl text-[#FAF9F9] font-regular">
              Criar observação
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ObservationModal
        visible={observationModal.visible}
        action={observationModal.action}
        actionText={
          observationModal.action == "create"
            ? "Criar observação"
            : "Editar observação"
        }
        onClose={toggleObservationModalVisibility}
        initialTextValue={
          selectedObservation != null ? selectedObservation.text : ""
        }
        isDone={selectedObservation != null && selectedObservation.done}
        isFavorite={selectedObservation != null && selectedObservation.favorite}
        onConfirm={
          selectedObservation != null
            ? handleEditObservation
            : handleCreateObservation
        }
        onDelete={openDeleteModal}
      />

      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteObservation}
        title="Deletar observação"
      />
    </SafeAreaView>
  )
}
