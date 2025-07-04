import { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, Text, View, TouchableOpacity, FlatList, Modal, TextInput, TouchableWithoutFeedback, ActivityIndicator, Alert } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@redux/store';
import { fetchClasses, createClass } from '@redux/classesSlice';
import ClassItem from "@components/ClassItem";

export default function ClassesScreen() {
  const dispatch: AppDispatch = useDispatch()
  const { classes, status, error } = useSelector((state: RootState) => state.classes)

  const [isCreateClassVisible, setIsCreateClassVisible] = useState(false)
  const [classNameInput, setClassNameInput] = useState('')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClasses())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (status === 'failed' && error) {
      Alert.alert('Error', error)
    }
  }, [status, error])

  const toggleIsCreateClassVisible = () => {
    setIsCreateClassVisible(!isCreateClassVisible)
  }

  const handleCreateClass = async () => {
    if (classNameInput.trim() === '') {
      Alert.alert('Erro', 'O nome da turma não pode estar vazio.')
      return
    }
    
    const resultAction = await dispatch(createClass(classNameInput))
    
    if (createClass.fulfilled.match(resultAction)) {
      setClassNameInput('')
      toggleIsCreateClassVisible( )
    } else if (createClass.rejected.match(resultAction)) {
      Alert.alert('Erro', resultAction.payload as string || 'Não foi possível criar a turma.')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar backgroundColor={isCreateClassVisible ? "#00000080" : "#F9FAFB"} barStyle="dark-content" />
    
      {status === 'loading' ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#773DD3" />
          <Text className="mt-2 text-lg text-gray-600">Carregando turmas...</Text>
        </View>
      ) : classes.length > 0 ? (
        <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ClassItem name={item.name} />}
            className="px-4 mt-4"
        /> 
        ) : (
          <View className="justify-center items-center flex-1">
            <Text className="font-regular text-center text-2xl text-[#2B2D2F] px-4">
                Crie sua primeira turma e{'\n'}
                facilite o acompanhamento{'\n'}
                dos seus alunos!
            </Text>
          </View>
        )
      }

      <View className="mt-auto p-4 items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-6 max-w-[299px]"
            onPress={toggleIsCreateClassVisible}
            disabled={status === 'loading'}
          >
            {status === 'loading' && isCreateClassVisible ? (
              <ActivityIndicator color="#FAF9F9" />
            ) : (
              <Text className="text-3xl text-[#FAF9F9] font-regular">Criar turma</Text>
            )}
          </TouchableOpacity>
      </View>

      <Modal
        animationType="slide" 
        transparent={true}
        visible={isCreateClassVisible}
        onRequestClose={toggleIsCreateClassVisible} 
      >
        <TouchableOpacity
          activeOpacity={1}
          className="items-end justify-end bg-black/50 absolute inset-0"
          onPress={toggleIsCreateClassVisible}
        >
          <TouchableWithoutFeedback
            onPress={(e) => e.stopPropagation()}
          >
            <View
              className="bg-white rounded-t-3xl p-6 w-full shadow-lg"
            >
              <Text className="text-lg text-gray-700 mb-2">Nome da turma</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-lg mb-6 focus:border-[#773DD3]"
                placeholder="Digite o nome da turma"
                value={classNameInput}
                onChangeText={setClassNameInput}
                editable={status !== 'loading'}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-[#773DD3] rounded-lg w-full items-center justify-center py-6"
                onPress={handleCreateClass}
                disabled={status === 'loading'} 
              >
                {status === 'loading' ? (
                  <ActivityIndicator color="#FAF9F9" />
                ) : (
                  <Text className="text-3xl text-[#FAF9F9] font-regular">Criar turma</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}