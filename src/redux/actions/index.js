import * as actionTypes from '../types';

// User Actions
export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: user
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
};

// CHannel Actions
export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: channel
  };
};

export const setPrivateChannel = isPrivate => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: isPrivate
  };
};

export const setNumUniqueUsers = numUniqueUsers => {
  return {
    type: actionTypes.SET_NUM_UNIQUE_USERS,
    payload: numUniqueUsers
  };
};

// Search Action
export const setSearchTerm = searchTerm => {
  return {
    type: actionTypes.SET_SEARCH_TERM,
    payload: searchTerm
  };
};
