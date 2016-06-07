import { showPointLabel } from './geocodingService';

function mapChangesWatcher() {
  const layerProvider = this.getBaseLayer().getProvider();
  const mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_;

  const mapState = {
    mapType,
    zoom: this.getZoom(),
    center: this.getCenter()
  };
  window.localStorage.setItem('HERE-MAP-STATE', JSON.stringify(mapState));

  // $location.search({
  //   map: utils.getMapString(this.getCenter(), mapType, this.getZoom())
  // });
  // $rootScope.$apply();
}

export function bindEvents(map) {
  const mapChanges = mapChangesWatcher.bind(map);
  map.addEventListener('mapviewchangeend', mapChanges);
  map.addEventListener('baselayerchange', mapChanges);
  map.addEventListener('tap', (event) => {
    showPointLabel(
      map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY)
    );
  })
}
