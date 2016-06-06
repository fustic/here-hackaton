import { getGeocoder } from './platformService';
import { showPointLabel as markersShowPointLabel } from './markersService';

let geocoderInstance;

function geocoder() {
  if (!geocoderInstance) {
    geocoderInstance = getGeocoder();
  }
  return geocoderInstance;
}

export function reverseGeocode(point) {
  return new Promise((resolve, reject) => {
    geocoder().reverseGeocode(
      {
        prox: `${point.lat},${point.lng},500`,
        language: 'en-gb',
        mode: 'retrieveAddresses',
        maxresults: 1
      },
      function success(result) {
        if (result.Response && result.Response.View[0]) {
          return resolve(result.Response.View[0].Result[0]);
        }
        return reject();
      },
      function error(err) {
        reject();
        console.error('Unable to reverse Geocode', err);
      }
    );
  });
}

export function showPointLabel(point) {
  reverseGeocode(point).then((location) => {
    markersShowPointLabel(location);
  });
}
