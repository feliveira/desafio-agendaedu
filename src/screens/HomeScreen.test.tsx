import { fireEvent, render } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';

const mockNavigate = jest.fn()

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  }
})

describe('HomeScreen', () => {

  const getGreeting = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour >= 5 && hour < 12) {
      return "Bom dia"
    } else if (hour >= 12 && hour <= 18) {
      return "Boa tarde"
    } else {
      return "Boa noite"
    }
  }

  it('should render greeting "Bom dia" when time is morning', () => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 6, 3, 7))
    const greeting = getGreeting()

    expect(greeting).toBe("Bom dia")

  })

  it('should render greeting "Boa tarde" when time is afternoon', () => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 6, 3, 14))

    const greeting = getGreeting()
    expect(greeting).toBe("Boa tarde")
  })

  it('should render greeting "Boa noite" when time is night', () => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 6, 3, 19))

    const greeting = getGreeting()
    expect(greeting).toBe("Boa noite")

  })

  it('should navigate to "classes" when Turmas button is pressed', () => {
    const { getByText } = render(<HomeScreen />)
    fireEvent.press(getByText("Turmas"))
    expect(mockNavigate).toHaveBeenCalledWith("classes")
  })

  it('should navigate to "favorites" when Favoritos button is pressed', () => {
    const { getByText } = render(<HomeScreen />)
    fireEvent.press(getByText("Favoritos"))
    expect(mockNavigate).toHaveBeenCalledWith("favorites")
  })
})
