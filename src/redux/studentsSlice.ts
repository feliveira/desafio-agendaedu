import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BASE_URL } from '@services/api';

interface Student {
  id: string
  name: string
  classId: string
}

interface StudentsState {
  students: Student[] 
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  page: number,
  hasMore: boolean,
  error: string | null
}

const initialState: StudentsState = {
  students: [], 
  status: 'idle',
  page: 1,
  hasMore: true,
  error: null,
}


export const fetchStudents = createAsyncThunk('students/fetchStudents', async ({ page, limit, classId }: {page: number, limit: number, classId: string}) => {
  const response = await fetch(`${BASE_URL}/students?_page=${page}&_per_page=${limit}&classId=${classId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch students: ${response.statusText}`)
  }
  const data = await response.json()
  const hasMore = page != data.last
  return { students: data.data, hasMore }
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
      return rejectWithValue(error.message || 'An unknown error occurred during student creation')
    }
  }
)

interface EditStudentArgs {
  id: string
  newName: string
}

export const editStudent = createAsyncThunk(
  'students/editStudent',
  async ({ id, newName }: EditStudentArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      // If the response is not OK, handle potential non-JSON errors
      if (!response.ok) {
        // Get the error message as plain text first
        const errorText = await response.text(); 
        try {
          // Try to parse it as JSON
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Failed to edit student');
        } catch (e) {
          // If parsing fails, the error was plain text
          throw new Error(errorText || 'Failed to edit student');
        }
      }

      // Check if the successful response has content before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const updatedClass = await response.json();
        return updatedClass;
      } else {
        // Handle cases where the server returns no content on success (e.g., 204 No Content)
        return {}; // Or whatever is appropriate for your state
      }

    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred during student edit');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      const observationsRes = await fetch(`${BASE_URL}/observations?studentId=${id}`);
      const observations = await observationsRes.json();

      await Promise.all(
        observations.map((obs: any) =>
          fetch(`${BASE_URL}/observations/${obs.id}`, { method: 'DELETE' })
        )
      );

      const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete student')
      }

      return id 
    } catch (error: any) {
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
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        const page = action.meta.arg.page

        if (page === 1) {
          state.students = action.payload.students
        } else {
          state.students = [...state.students, ...action.payload.students]
        }

        state.hasMore = action.payload.hasMore
        state.status = 'succeeded'
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
      .addCase(editStudent.pending, (state) => {
        state.status = 'loading' 
      })
      .addCase(editStudent.fulfilled, (state, action: PayloadAction<Student>) => {
        state.status = 'succeeded'
        const index = state.students.findIndex(student => student.id === action.payload.id)
        if (index !== -1) {
          state.students[index] = action.payload 
        }
      })
      .addCase(editStudent.rejected, (state, action) => {
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