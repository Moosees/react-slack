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

export const setNumUniqueUsers = numUniqueUsers => {
  return {
    type: actionTypes.SET_NUM_UNIQUE_USERS,
    payload: numUniqueUsers
  };
};
