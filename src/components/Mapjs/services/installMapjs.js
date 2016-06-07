const js = [
  'js.api.here.com/v3/3.0/mapsjs-core.js',
  'js.api.here.com/v3/3.0/mapsjs-service.js',
  'js.api.here.com/v3/3.0/mapsjs-mapevents.js',
  'js.api.here.com/v3/3.0/mapsjs-ui.js',
  // 'js.api.here.com/v3/3.0/mapsjs-places.js'
];
const css = [
  'js.api.here.com/v3/3.0/mapsjs-ui.css'
];
const INIT_STATUSES = {
  LOADING: 'loading',
  LOADED: 'loaded'
};
let initStatus;
let here;

function loadScript(url) {
  return new Promise((resolve) => {
    const src = `${window.location.protocol}://${url}`;
    const script = $document[0].createElement('script');

    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };

    script.src = src;

    document.querySelector('head').appendChild(script);
  });
}

function init() {
  const scripts = js;
  const promises = [];

  if (initStatus === Enums.INIT_STATUSES.LOADING) {
    return initPromise;
  }

  scripts.forEach((s) => {
    promises.push(loadScript(s));
  });

  initStatus = INIT_STATUSES.LOADING;

  return Promise.all(promises).then(() => {
    initStatus = INIT_STATUSES.LOADED;
    here = window.H;
  });
}

export function getHere() {
  return new Promise((resolve) => {
    if (here) {
      resolve(here);
    } else {
      init().then(() => {
        resolve(here);
      });
    }
  });
}
