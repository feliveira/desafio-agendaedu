import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

describe("Home Screen", () => {
  it("should display Home Screen as a Text", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Home Screen")).toBeTruthy();
  });
});
