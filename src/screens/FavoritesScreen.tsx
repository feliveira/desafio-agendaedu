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
  fetchObservations,
} from "@redux/observationsSlice";

import { useNavigation } from "@hooks/useNavigation";

import Toast from "react-native-toast-message";

import ObservationItem from "@components/ObservationItem";

const OBSERVATIONS_PER_PAGE_LIMIT = 5;

export default function FavoritesScreen() {
  const { navigate } = useNavigation();

  const dispatch: AppDispatch = useDispatch();
  const { observations, status, error } = useSelector(
    (state: RootState) => state.observations
  );

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      const result = await dispatch(
        fetchObservations({
          page: 1,
          limit: OBSERVATIONS_PER_PAGE_LIMIT,
          favorite: true,
        })
      );
      if (fetchObservations.fulfilled.match(result)) {
        setHasMore(result.payload.hasMore);
        setPage(1);
      }
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    if (status === "failed" && error) {
      Toast.show({
        type: "customError",
        text1: "❌ Erro",
        text2: "Ocorreu um erro, por favor, tente novamente mais tarde.",
        visibilityTime: 1000,
      });
    }
  }, [status, error]);

  const loadMoreObservations = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    const result = await dispatch(
      fetchObservations({
        page: nextPage,
        limit: OBSERVATIONS_PER_PAGE_LIMIT,
        favorite: true,
      })
    );
    if (fetchObservations.fulfilled.match(result)) {
      setPage(nextPage);
      const { hasMore } = result.payload;
      setHasMore(hasMore);
    }

    setIsFetchingMore(false);
  };


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        backgroundColor="#F9FAFB"
        barStyle="dark-content"
      />

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
              className={item.className}
              done={item.done}
              createdAt={item.createdAt}
              onPressClass={() =>
                navigate("students", {
                  classId: item.classId,
                  name: item.className,
                })
              }
              onPressStudent={() =>
                navigate("student", {
                  classId: item.classId,
                  className: item.className,
                  id: item.studentId,
                  name: item.studentName,
                })
              }
              onPressEdit={null}
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
            Você ainda não tem favoritos!{"\n"}
            Marque observações importantes{"\n"}
            para acessá-las rápido.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
