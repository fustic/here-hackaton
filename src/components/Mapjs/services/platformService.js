let platform;
let geocoder;

export function getPlatform() {
  if (!platform) {
    /*jshint camelcase: false */
    platform = new H.service.Platform({
      app_id: 'inhesa7azejETefrudAC',
      app_code: 'UP6A4YcFEAgshQMhc-sYsA',
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
