import { combineReducers } from 'redux';
import runtime from './runtime';
import map from './map';
import search from './search';

export default combineReducers({
  runtime,
  map,
  search,
});
