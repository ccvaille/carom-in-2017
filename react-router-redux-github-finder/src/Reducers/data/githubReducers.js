import { handleActions } from 'redux-actions';
import { GithubState } from '../../constants/models'

import {
	GET_GITHUB_INITIAT,
	GET_GITHUB_SUCCESS,
	GET_GITHUB_FAIL,
	CHAGE_USER_ID,
} from '../../constants/actionTypes';

const githubReducers = handleActions({
  GET_GITHUB_SUCCESS: (state, { payload }) => (
    state.merge({
      data: payload.data,
    })
  ),
  CHAGE_USER_ID: (state, { payload }) => (
    state.merge({
      userId:
      payload.userId,
    })
  ),
}, GithubState);

export default githubReducers;