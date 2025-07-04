import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { BASE_URL } from '@services/api' 

interface Class {
  id: string
  name: string
}

interface ClassesState {
  classes: Class[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ClassesState = {
  classes: [],
  status: 'idle',
  error: null,
}

export const fetchClasses = createAsyncThunk('classes/fetchClasses', async () => {
  const response = await fetch(`${BASE_URL}/classes`)
  if (!response.ok) {
    throw new Error('Failed to fetch classes')
  }
  const data = await response.json()
  return data
})

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (className: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: className }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create class')
      }

      const newClass = await response.json()
      return newClass
    } catch (error: any) {
      console.error("Error creating class:", error)
      return rejectWithValue(error.message || 'An unknown error occurred during class creation')
    }
  }
)

interface EditClassArgs {
  id: string
  newName: string
}

export const editClass = createAsyncThunk(
  'classes/editClass',
  async ({ id, newName }: EditClassArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/classes/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to edit class')
      }

      const updatedClass = await response.json()
      return updatedClass
    } catch (error: any) {
      console.error("Error editing class:", error)
      return rejectWithValue(error.message || 'An unknown error occurred during class edit')
    }
  }
)

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/classes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete class')
      }

      return id 
    } catch (error: any) {
      console.error("Error deleting class:", error)
      return rejectWithValue(error.message || 'An unknown error occurred during class deletion')
    }
  }
)


const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchClasses.fulfilled, (state, action: PayloadAction<Class[]>) => {
        state.status = 'succeeded'
        state.classes = action.payload
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch classes'
      })
      .addCase(createClass.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createClass.fulfilled, (state, action: PayloadAction<Class>) => {
        state.status = 'succeeded'
        state.classes.push(action.payload)
      })
      .addCase(createClass.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(editClass.pending, (state) => {
        state.status = 'loading' 
      })
      .addCase(editClass.fulfilled, (state, action: PayloadAction<Class>) => {
        state.status = 'succeeded'
        const index = state.classes.findIndex(cls => cls.id === action.payload.id)
        if (index !== -1) {
          state.classes[index] = action.payload 
        }
      })
      .addCase(editClass.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(deleteClass.pending, (state) => {
        state.status = 'loading' 
      })
      .addCase(deleteClass.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.classes = state.classes.filter(cls => cls.id !== action.payload)
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  },
})

export default classesSlice.reducer