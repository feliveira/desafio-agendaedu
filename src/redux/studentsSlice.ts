import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from '@services/api';

// --- Interfaces ---
interface Student {
  id: string
  name: string
  classId: string
}

interface StudentsState {
  students: Student[] 
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: StudentsState = {
  students: [], 
  status: 'idle',
  error: null,
}


export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await fetch(`${BASE_URL}/students`)
  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }
  const data = await response.json()
  return data
})

interface CreateStudentArgs {
  name: string
  classId: string
}

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async ({ name, classId }: CreateStudentArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, classId }), 
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create student')
      }

      const newStudent = await response.json()
      return newStudent
    } catch (error: any) {
      console.error('Error creating student:', error)
      return rejectWithValue(error.message || 'An unknown error occurred during student creation')
    }
  }
)

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete student')
      }

      return id 
    } catch (error: any) {
      console.error('Error deleting student:', error)
      return rejectWithValue(error.message || 'An unknown error occurred during student deletion')
    }
  }
)

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.status = 'succeeded'
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch students'
      })
      .addCase(createStudent.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.status = 'succeeded'
        state.students.push(action.payload) 
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      .addCase(deleteStudent.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteStudent.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded'
        state.students = state.students.filter((student) => student.id !== action.payload)
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  },
})

export default studentsSlice.reducer