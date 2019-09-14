import { combineReducers } from 'redux';
import * as actionTypes from '../types';

const INITIAL_USER_STATE = {
  currentUser: null,
  isLoading: true
};

const INITIAL_CHANNEL_STATE = {
  currentChannel: null,
  firstLoad: true
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

const channel_reducer = (state = INITIAL_CHANNEL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
        firstLoad: false
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer
});

export default rootReducer;
