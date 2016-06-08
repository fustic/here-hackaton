import { combineReducers } from 'redux';
import runtime from './runtime';
import map from './map';
import search from './search';
import lastAction from './lastAction';

export default combineReducers({
  runtime,
  map,
  search,

  lastAction
});
