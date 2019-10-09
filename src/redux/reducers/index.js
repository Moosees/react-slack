import { combineReducers } from 'redux';
import * as actionTypes from '../types';

const INITIAL_USER_STATE = {
  currentUser: null,
  isLoading: true
};

const INITIAL_CHANNEL_STATE = {
  currentChannel: null,
  isPrivateChannel: false,
  firstLoad: true,
  numUniqueUsers: 0
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

    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload
      };

    case actionTypes.SET_NUM_UNIQUE_USERS:
      return {
        ...state,
        numUniqueUsers: action.payload
      };

    default:
      return state;
  }
};

const search_reducer = (state = { searchTerm: '' }, action) => {
  switch (action.type) {
    case actionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  search: search_reducer
});

export default rootReducer;
