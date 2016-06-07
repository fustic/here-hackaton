/**
 * SERVICE WORKER HELPERS
 */
const helpers = {};
const maptilesLimit = 500;

helpers.isURLCacheable = function(url) {
  const isJSLAMapTile = url.indexOf('/maptile/') > -1;
  const isJSLAVenue = url.indexOf('/venues/signature') > -1;
  return isJSLAMapTile || isJSLAVenue;
};

helpers.cleanCache = function(cache) {
  /**
   * CLEAN CACHE AFTER THE LIMIT IS REACHED
   * ENABLE WHEN THE MAP POSITION IS KEPT
   *
   cache.keys().then(function(keys) {
      const mapTilesKeys = keys.filter(function(key) {
        return key.url.indexOf('/maptile/') > -1;
      });
      if (mapTilesKeys.length > maptilesLimit) {
        const toDelete = mapTilesKeys.slice(0, mapTilesKeys.length - maptilesLimit);
        toDelete.forEach(function(keyToDelete) {
          cache.delete(keyToDelete);
        });
      }
    })
   */
};


/**
 * EVENT LISTENERS FOR SERVICE WORKER
 */
const staticCacheName = 'jsla-static-v10';     // When making changes, please update the version


/**
 * Automatically download and store in cache the main libraries
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'http://js.api.here.com/v3/3.0/mapsjs-core.js',
        'http://js.api.here.com/v3/3.0/mapsjs-service.js',
        'http://js.api.here.com/v3/3.0/mapsjs-ui.js',
        'http://js.api.here.com/v3/3.0/mapsjs-mapevents.js',
        'http://js.api.here.com/v3/3.0/mapsjs-ui.css'
      ]);
    })
  );
});

/**
 * Clean the different cache repositories when a new version is created
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('jsla-static-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


/**
 * When a file is requested:
 * 1.  Check if the file is in the cache repository
 * 2.  If not, request to the network and if the file is to be cached add it to the cache
 */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function(response) {
        if (helpers.isURLCacheable(event.request.url)) {
          caches.open(staticCacheName).then(function(cache) {
            // Add new file to the cache
            cache.put(event.request.url, response.clone());
            helpers.cleanCache(cache);
          });
        }
        return response;
      });
    })
  );
});
