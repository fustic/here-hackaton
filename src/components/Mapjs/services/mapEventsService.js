import { showPointLabel } from './geocodingService';
import setMapState from '../../../actions/map';

function mapChangesWatcher(store) {
  const layerProvider = this.getBaseLayer().getProvider();
  const mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_;

  const boundingBox = this.getViewBounds();
  const mapState = {
    mapType,
    zoom: this.getZoom(),
    center: this.getCenter(),
    boundingBoxPBAPI: [
      boundingBox.getTopLeft().lng.toFixed(4),
      boundingBox.getBottomRight().lat.toFixed(4),
      boundingBox.getBottomRight().lng.toFixed(4),
      boundingBox.getTopLeft().lat.toFixed(4)
    ]
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
