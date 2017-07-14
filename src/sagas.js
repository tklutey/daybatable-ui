import { takeLatest, put, call } from 'redux-saga/effects';
import * as actions from './actionTypes';
import { init } from './api';

const rootSaga = function* rootSaga() {
  yield takeLatest(actions.INIT, initSaga);
}

function* initSaga() {
  try {
    const response = yield call(init);
    if (response.data.success) {
      yield put({ type: actions.INIT_SUCCESS, response });
    } else {
      throw response;
    }
  } catch (error) {
    yield put({ type: actions.INIT_FAIL, error });
  }
}

export default rootSaga;