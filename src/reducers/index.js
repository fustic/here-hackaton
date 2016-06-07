import { combineReducers } from 'redux';
import runtime from './runtime';
import map from './map';

export default combineReducers({
  runtime,
  map,
});
