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
export const setCurrentChannel = (channel, isPrivate = false) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: { channel, isPrivate }
  };
};

export const setNumUniqueUsers = numUniqueUsers => {
  return {
    type: actionTypes.SET_NUM_UNIQUE_USERS,
    payload: numUniqueUsers
  };
};

export const setChannelStar = isChannelStarred => {
  return {
    type: actionTypes.SET_CHANNEL_STAR,
    payload: isChannelStarred
  };
};

// Search Action
export const setSearchTerm = searchTerm => {
  return {
    type: actionTypes.SET_SEARCH_TERM,
    payload: searchTerm
  };
};
