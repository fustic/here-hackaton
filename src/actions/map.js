import { SET_MAP_STATE } from '../constants';

export default function (mapState) {
  return {
    type: SET_MAP_STATE,
    payload: { state: mapState }
  };
}
