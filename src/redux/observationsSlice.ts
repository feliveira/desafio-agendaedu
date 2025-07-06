import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "@services/api";

interface Observation {
  id: string
  text: string
  classId: string
  className: string
  studentId: string
  favorite: boolean
  done: boolean
  createdAt: string
}

interface ObservationsState {
  observations: Observation[]
  status: "idle" | "loading" | "succeeded" | "failed"
  page: number
  hasMore: boolean
  error: string | null
}

const initialState: ObservationsState = {
  observations: [],
  status: "idle",
  page: 1,
  hasMore: true,
  error: null,
}

export const fetchObservations = createAsyncThunk(
  "observations/fetchObservations",
  async ({
    page,
    limit,
    studentId,
    favorite,
  }: {
    page: number
    limit: number
    studentId?: string
    favorite?: string
  }) => {
    const url = new URL(`${BASE_URL}/observations`)
    url.searchParams.append("_page", String(page))
    url.searchParams.append("_per_page", String(limit))

    if (studentId) {
      url.searchParams.append("studentId", studentId)
    }
    if (favorite) {
      url.searchParams.append("favorite", favorite)
    }

    url.searchParams.append("_sort", "createdAt")
    url.searchParams.append("_order", "desc")

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Failed to fetch observations: ${response.statusText}`)
    }
    const data = await response.json()
    const hasMore = page != data.last
    return { observations: data.data, hasMore }
  }
)

interface CreateObservationArgs {
  text: string
  classId: string
  className: string
  studentId: string
  favorite: boolean
  done: boolean
  createdAt: string
}

export const createObservation = createAsyncThunk(
  "observations/createObservation",
  async (
    {
      text,
      classId,
      className,
      studentId,
      favorite,
      done,
      createdAt,
    }: CreateObservationArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/observations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          classId,
          className,
          studentId,
          favorite,
          done,
          createdAt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create observation")
      }

      const newObservation = await response.json()
      return newObservation
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An unknown error occurred during observation creation"
      )
    }
  }
)

interface EditObservationArgs {
  id: string
  text: string
  favorite: boolean
  done: boolean
}

export const editObservation = createAsyncThunk(
  "observations/editObservation",
  async (
    { id, text, favorite, done }: EditObservationArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/observations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, favorite, done }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to edit observation")
      }

      const updatedClass = await response.json()
      return updatedClass
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An unknown error occurred during observation edit"
      )
    }
  }
)

export const deleteObservation = createAsyncThunk(
  "observations/deleteObservation",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/observations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete observation")
      }

      return id
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An unknown error occurred during observation deletion"
      )
    }
  }
)

const observationsSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchObservations.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchObservations.fulfilled, (state, action) => {
        const page = action.meta.arg.page

        if (page === 1) {
          state.observations = action.payload.observations
        } else {
          state.observations = [
            ...state.observations,
            ...action.payload.observations,
          ]
        }

        state.hasMore = action.payload.hasMore
        state.status = "succeeded"
      })
      .addCase(fetchObservations.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch observations"
      })
      .addCase(createObservation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        createObservation.fulfilled,
        (state, action: PayloadAction<Observation>) => {
          state.status = "succeeded"
          state.observations.push(action.payload)
        }
      )
      .addCase(createObservation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(editObservation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        editObservation.fulfilled,
        (state, action: PayloadAction<Observation>) => {
          state.status = "succeeded"
          const index = state.observations.findIndex(
            (observation) => observation.id === action.payload.id
          )
          if (index !== -1) {
            state.observations[index] = action.payload
          }
        }
      )
      .addCase(editObservation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(deleteObservation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(
        deleteObservation.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded"
          state.observations = state.observations.filter(
            (observation) => observation.id !== action.payload
          )
        }
      )
      .addCase(deleteObservation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export default observationsSlice.reducer
