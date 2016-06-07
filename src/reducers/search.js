import { SEARCH_ACTION } from '../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SEARCH_ACTION :

      return {
        ...state,
        results: action.data,
      };
    default:
      return state;
  }
}
