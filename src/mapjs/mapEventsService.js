import { showPointLabel } from './geocodingService';
function mapChangesWatcher() {
  const layerProvider = this.getBaseLayer().getProvider();
  const mapType = layerProvider.copyrightKey_ === 'hybrid' ? 'satellite' : layerProvider.copyrightKey_;
  // $location.search({
  //   map: utils.getMapString(this.getCenter(), mapType, this.getZoom())
  // });
  // $rootScope.$apply();
}

export function bindEvents(map) {
  console.log(map);
  const mapChanges = mapChangesWatcher.bind(map);
  map.addEventListener('mapviewchangeend', mapChanges);
  map.addEventListener('baselayerchange', mapChanges);
  map.addEventListener('tap', (event) => {
    showPointLabel(
      map.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY)
    );
  })
}
