import { SEARCH_ACTION } from '../constants'
export const searchDataReceived = (data, query) => ({
  type: SEARCH_ACTION,
  data,
  query
});
