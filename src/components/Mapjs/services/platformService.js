import { APP_CREDENTIALS } from '../../../constants';

let platform;
let geocoder;

export function getPlatform() {
  if (!platform) {
    /*jshint camelcase: false */
    platform = new H.service.Platform({
      app_id: APP_CREDENTIALS.ID,
      app_code: APP_CREDENTIALS.CODE,
      useHTTPS: location.protocol === 'https:'
    });
  }
  return platform;
}

export function getGeocoder() {
  if (!geocoder) {
    geocoder = platform.getGeocodingService();
  }
  return geocoder;
}
