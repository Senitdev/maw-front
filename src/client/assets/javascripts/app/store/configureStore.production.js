import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducer';

const enhancer = compose(
  applyMiddleware(promiseMiddleware, thunkMiddleware)
)(createStore);

export default function configureStore(initialState) {
  return enhancer(rootReducer, initialState);
}
