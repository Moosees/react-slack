import { combineReducers } from 'redux';
import * as actionTypes from '../types';

const INITIAL_USER_STATE = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = INITIAL_USER_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false
      };

    case actionTypes.CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        isLoading: false
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer
});

export default rootReducer;
