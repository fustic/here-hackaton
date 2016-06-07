import { showPointLabel } from './geocodingService';
import setMapState from '../../../actions/map';

function mapChangesWatcher(store) {
  const layerProvider = this.getBaseLayer().getProvider();
  const mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_;

  const mapState = {
    mapType,
    zoom: this.getZoom(),
    center: this.getCenter(),
    boundingBox: this.getViewBounds()
  };
  window.localStorage.setItem('HERE-MAP-STATE', JSON.stringify(mapState));
  store.dispatch(setMapState(mapState));
  // $location.search({
  //   map: utils.getMapString(this.getCenter(), mapType, this.getZoom())
  // });
  // $rootScope.$apply();
}

export function bindEvents(map, store) {
  const mapChanges = mapChangesWatcher.bind(map, store);
  map.addEventListener('mapviewchangeend', mapChanges);
  map.addEventListener('baselayerchange', mapChanges);
  map.addEventListener('tap', (event) => {
    showPointLabel(
      map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY)
    );
  })
}
