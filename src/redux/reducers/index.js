import { combineReducers } from 'redux';
import * as actionTypes from '../types';

const INITIAL_USER_STATE = {
  currentUser: null,
  isLoading: true
};

const INITIAL_CHANNEL_STATE = {
  currentChannel: {
    id: '',
    name: '',
    details: '',
    createdBy: {
      name: '',
      avatar: ''
    }
  },
  isPrivateChannel: false,
  isChannelStarred: false,
  firstLoad: true,
  numUniqueUsers: 0,
  userPosts: null
};

const INITIAL_COLORS_STATE = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee'
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
        currentChannel: action.payload.channel,
        isPrivateChannel: action.payload.isPrivate,
        firstLoad: false
      };

    case actionTypes.SET_NUM_UNIQUE_USERS:
      return {
        ...state,
        numUniqueUsers: action.payload
      };

    case actionTypes.SET_CHANNEL_STAR:
      return {
        ...state,
        isChannelStarred: action.payload
      };

    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload
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

const colors_reducer = (state = INITIAL_COLORS_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  search: search_reducer,
  colors: colors_reducer
});

export default rootReducer;
