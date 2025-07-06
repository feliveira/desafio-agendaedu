import { combineReducers } from "@reduxjs/toolkit";
import classesReducer from './classesSlice';
import studentsReducer from './studentsSlice';
import observationsReducer from "./observationsSlice"

const rootReducer = combineReducers({
  classes: classesReducer,
  students: studentsReducer,
  observations: observationsReducer
})

export default rootReducer