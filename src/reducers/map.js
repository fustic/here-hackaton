import { SET_MAP_STATE } from '../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SET_MAP_STATE:
      return {
        ...state,
        ['mapState']: action.payload.state,
      };
    default:
      return state;
  }
}
