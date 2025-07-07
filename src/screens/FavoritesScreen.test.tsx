import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FavoritesScreen from "./FavoritesScreen";
import observationsReducer from "../redux/observationsSlice";

jest.mock("@hooks/useNavigation", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      observations: observationsReducer,
    },
    preloadedState,
  });

describe("FavoritesScreen", () => {

  it("renders loading state when status is 'loading'", () => {
    const store = createTestStore({
      observations: {
        observations: [],
        status: "loading",
        error: null,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <FavoritesScreen />
      </Provider>
    );

    expect(getByText("Carregando observações...")).toBeTruthy();
  });

  it("shows an error toast when status is 'failed' and there is an error", () => {
    const store = createTestStore({
      observations: {
        observations: [],
        status: "failed",
        error: "Some error",
      },
    });

    const Toast = require("react-native-toast-message");
    render(
      <Provider store={store}>
        <FavoritesScreen />
      </Provider>
    );

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "customError",
        text1: "❌ Erro",
      })
    );
  });
  
});
