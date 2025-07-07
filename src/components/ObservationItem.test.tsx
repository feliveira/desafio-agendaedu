import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ObservationItem from "./ObservationItem";

describe("ObservationItem", () => {
  const mockItem = {
    id: "abc1",
    studentName: "John Doe",
    className: "3° Ano A",
    text: "Simples texto",
    createdAt: "2025-07-06T12:00:00Z",
    favorite: true,
    done: true,
    onPressStudent: jest.fn(),
    onPressClass: jest.fn(),
    onPressEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all basic information correctly", () => {
    const { getByText } = render(<ObservationItem {...mockItem} />);
    
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("3° Ano A")).toBeTruthy();
    expect(getByText("Simples texto")).toBeTruthy();
    expect(getByText("DONE")).toBeTruthy();

    const formattedDate = new Date(mockItem.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    expect(getByText(formattedDate)).toBeTruthy();
  });

  it("calls onPressStudent when student name is pressed", () => {
    const { getByText } = render(<ObservationItem {...mockItem} />);
    fireEvent.press(getByText("John Doe"));
    expect(mockItem.onPressStudent).toHaveBeenCalled();
  });

  it("calls onPressClass when class name is pressed", () => {
    const { getByText } = render(<ObservationItem {...mockItem} />);
    fireEvent.press(getByText("3° Ano A"));
    expect(mockItem.onPressClass).toHaveBeenCalled();
  });

  it("calls onPressEdit with correct id when edit button is pressed", () => {
    const { getByTestId } = render(<ObservationItem {...mockItem} />);
    const editButton = getByTestId("edit-button");
    fireEvent.press(editButton);
    expect(mockItem.onPressEdit).toHaveBeenCalledWith("abc1");
  });

  it("does not render edit button if onPressEdit is null", () => {
    const { queryByTestId } = render(<ObservationItem {...mockItem} onPressEdit={null} />);
    expect(queryByTestId("edit-button")).toBeNull();
  });

  it("does not render DONE badge if done is false", () => {
    const { queryByText } = render(<ObservationItem {...mockItem} done={false} />);
    expect(queryByText("DONE")).toBeNull();
  });

  it("student and class name are not pressable if handlers are null", () => {
    const { getByText } = render(<ObservationItem {...mockItem} onPressStudent={null} onPressClass={null} />);
    fireEvent.press(getByText("John Doe"));
    fireEvent.press(getByText("3° Ano A")); 
  });
});
