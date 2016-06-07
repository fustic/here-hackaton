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

export default function initMap(element, devicePixelRation, store) {
  const platform = getPlatform();
  // Obtain the default map types from the platform object
  const defaultLayers = platform.createDefaultLayers();

  const mapState = store.getState().map.mapState || {};

  map = new H.Map(
    element,
    defaultLayers.normal.map,
    {
      zoom: mapState.zoom || 14,
      center: mapState.center || { lng: 13.4, lat: 52.51 },
      pixelRatio: devicePixelRation
    });

  const mapPadding = map.getViewPort().padding;
  map
    .getViewPort()
    .setPadding(
      mapPadding.top - 20,
      mapPadding.right + 20,
      mapPadding.bottom + 20,
      mapPadding.left - 20
    );
  // map.setBaseLayer(defaultLayers.normal.map);

  // Enable the event system on the map instance:
  const mapEvents = new H.mapevents.MapEvents(map);
  // Create the default UI:
  const ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
  // Instantiate the default behavior, providing the mapEvents object:
  new H.mapevents.Behavior(mapEvents);

  bindEvents(map, store);
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
