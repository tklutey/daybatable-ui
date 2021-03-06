import ReactGA from 'react-ga';
import { takeLatest, put, call, select } from 'redux-saga/effects';
import * as actions from './actionTypes';
import { trackEvent } from './actions';
import { init, upvoteDebate, downvoteDebate } from './api';

const rootSaga = function* rootSaga() {
  yield takeLatest(actions.INIT, initSaga);
  yield takeLatest('DEBATE_UPVOTE', debateUpvoteSaga);
  yield takeLatest('DEBATE_UPVOTE_SUCCESS', debateUpvoteSuccessSaga);
  yield takeLatest('DEBATE_DOWNVOTE_SUCCESS', debateDownvoteSuccessSaga);
  yield takeLatest(actions.TRACK_EVENT, trackEventSaga);
}

function* initSaga() {
  const username = yield select(state => state.user.username);
  if (username) {
    ReactGA.set({ userId: username });
  }
  try {
    const response = yield call(init);
    if (response.data.success && response.data.debate) {
      yield put({ type: actions.INIT_SUCCESS, response });
    } else {
      throw response;
    }
  } catch (error) {
    yield put({ type: actions.INIT_FAIL, error });
  }

  yield put(trackEvent({
    category: 'Navigation',
    action: 'User visited home page'
  }));
}

function* debateUpvoteSaga({ userId, debateId, position }) {
  const payload = { userId, debateId, position };
  yield put(trackEvent({
    category: 'Debate',
    action: 'User upvoted a debate position'
  }));

  try {
    const response = yield call(upvoteDebate, payload);
    yield put({ type: 'DEBATE_UPVOTE_SUCCESS', response });
  } catch (error) {
    yield put({ type: 'DEBATE_UPVOTE_FAIL', error });
  }
}

function* debateDownvoteSaga({ userId, debateId, position }) {
  const payload = { userId, debateId, position };
  yield put(trackEvent({
    category: 'Debate',
    action: 'User downvoted a debate position'
  }));

  try {
    const response = yield call(downvoteDebate, payload);
    yield put({ type: 'DEBATE_DOWNVOTE_SUCCESS', response });
  } catch (error) {
    yield put({ type: 'DEBATE_DOWNVOTE_FAIL', error });
  }
}

function* debateUpvoteSuccessSaga() {
  yield put(trackEvent({
    category: 'Debate',
    action: 'Debate upvote debate successly recorded'
  }));
}

function* debateDownvoteSuccessSaga() {
  yield put(trackEvent({
    category: 'Debate',
    action: 'Debate downvote debate successly recorded'
  }));
}

function* trackEventSaga({ category, action, label, value }) {
  ReactGA.event(Object.assign({},
    category ? { category } : null,
    action   ? { action }   : null,
    label    ? { label }    : null,
    value    ? { value }    : null,
  ));
}

export default rootSaga;