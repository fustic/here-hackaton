import { APP_CREDENTIALS as credentials } from '../constants';
import fetch from '../core/fetch';

const buildUrl = (query) => {
  const base = 'https://places.sit.api.here.com/places/v1/discover/search/?';
  const q = Object.assign({}, { app_id: credentials.ID, app_code: credentials.CODE, size: 5}, query);
  const qs = Object.keys(q).map(key => `${key}=${q[key]}`).join('&');

  return `${base}${qs}`;
};

export async function search(query) {
  const response = await fetch(buildUrl(query), {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) throw new Error(response.error);

  const { results: { items } } = await response.json();

  return items;
}

export const transformBoundingBox = (boundingBox) => (boundingBox || []).join(',');
