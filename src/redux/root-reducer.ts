import { combineReducers } from "@reduxjs/toolkit";
import classesReducer from './classesSlice';
import studentsReducer from './studentsSlice';

const rootReducer = combineReducers({
  classes: classesReducer,
  students: studentsReducer
})

export default rootReducer