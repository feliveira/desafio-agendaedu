import { combineReducers } from "@reduxjs/toolkit";

const placeholderReducer = (state = {}, action: {type: string, payload: string}) => {
  return state;
};

const rootReducer = combineReducers({
  placeholder: placeholderReducer,
});

export default rootReducer;