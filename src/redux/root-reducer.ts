import { combineReducers } from "@reduxjs/toolkit";
import classesReducer from './classesSlice';

const rootReducer = combineReducers({
  classes: classesReducer,
})

export default rootReducer