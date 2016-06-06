import { getPlatform } from './platformService';
import { bindEvents } from './mapEventsService';
import { setMap, setUI } from './markersService';

const Config = {
  types: ['normal', 'satellite', 'terrain'],
  colors: {
    currentPosition: 'rgb(64,196,255)'
  }
};
let map;
export function getMap() {
  if (!map) {
    throw new Error('Map is not initialised');
  }
  return map;
}

export default function initMap(element, devicePixelRation) {
  const platform = getPlatform();
  // Obtain the default map types from the platform object
  const defaultLayers = platform.createDefaultLayers();

  map = new H.Map(
    element,
    defaultLayers.normal.map,
    {
      zoom: 14,
      center: { lng: 13.4, lat: 52.51 },
      pixelRatio: devicePixelRation
    });

  // map.setBaseLayer(defaultLayers.normal.map);

  // Enable the event system on the map instance:
  const mapEvents = new H.mapevents.MapEvents(map);
  // Create the default UI:
  const ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
  // Instantiate the default behavior, providing the mapEvents object:
  new H.mapevents.Behavior(mapEvents);

  bindEvents(map);
  setMap(map);
  setUI(ui);
}

export function updateMap(mapUpdate) {
  if (!mapUpdate) {
    return;
  }
  if (mapUpdate.location) {
    map.setCenter(mapUpdate.location);
  }
  if (mapUpdate.type && Config.types.indexOf(mapUpdate.type) !== -1) {
    map.setBaseLayer(defaultLayers[mapUpdate.type].map);
  }
  if (mapUpdate.zoom) {
    map.setZoom(mapUpdate.zoom, true);
  }
}
