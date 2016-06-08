let map;
let ui;
let bubble;
let polyline;
let pointLabelBubble;
let placeLabelBubble;
let routeGroup;
let searchResultsGroup = null;

const BUBBLE_STATES = {
  OPEN: 'open',
  CLOSED: 'closed'
};

function closeRoute() {
  if (map) {
    if (polyline) {
      map.removeObject(polyline);
      polyline = null;
    }
    if (routeGroup) {
      map.removeObject(routeGroup);
      routeGroup = null;
    }
  }
}
function removeMarkers() {
  if (map) {
    if (searchResultsGroup) {
      map.removeObject(searchResultsGroup);
      searchResultsGroup = null;
    }
  }
}

function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      {
        content: text
      }
    );
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

export function setMap(mapInstance) {
  map = mapInstance;
}

export function setUI(uiInstance) {
  ui = uiInstance;
}

export function addCurrentPositionMarker(coordinates) {
  //TODO: move svg to service. It's ugly to hardcode them
  const icon = new H.map.DomIcon('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><path fill="' + Config.map.colors.currentPosition + '" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>');
  const marker = new H.map.DomMarker(coordinates, { icon: icon });

  map.addObject(marker);
}

export function showPointLabel(location) {
  if (bubble) {
    bubble.close();
  }
  // $pointLabelScope.locationLabel.setLocation(location);
  if (!pointLabelBubble) {
    pointLabelBubble = new H.ui.InfoBubble({
      lat: location.Location.DisplayPosition.Latitude,
      lng: location.Location.DisplayPosition.Longitude
    }, {
      content: ''
    });
    ui.addBubble(pointLabelBubble);
    var bubbleBody = pointLabelBubble.el.querySelector('.H_ib_body');
    bubbleBody.innerHTML = '';
    // bubbleBody.appendChild($pointLabel[0]);
  } else {
    pointLabelBubble.setPosition({
      lat: location.Location.DisplayPosition.Latitude,
      lng: location.Location.DisplayPosition.Longitude
    });
    if (pointLabelBubble.getState() !== BUBBLE_STATES.OPEN) {
      pointLabelBubble.open();
    }
  }
}

export function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      {
        content: text
      }
    );
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

export function showPlaceBubble(place) {
  if (pointLabelBubble) {
    pointLabelBubble.close();
  }
  if (bubble) {
    bubble.close();
  }
  // $placeScope.locationLabel.setPlace(place);
  if (!placeLabelBubble) {
    placeLabelBubble = new H.ui.InfoBubble({
      lat: place.location.position[0],
      lng: place.location.position[1]
    }, {
      content: ''
    });
    ui.addBubble(placeLabelBubble);
    var bubbleBody = placeLabelBubble.el.querySelector('.H_ib_body');
    bubbleBody.innerHTML = '';
    // bubbleBody.appendChild($placeLabel[0]);
  } else {
    placeLabelBubble.setPosition({
      lat: place.location.position[0],
      lng: place.location.position[1]
    });
    if (placeLabelBubble.getState() !== BUBBLE_STATES.OPEN) {
      placeLabelBubble.open();
    }
  }
}

export function showRoute(route) {
  closeRoute();
  const strip = new H.geo.Strip();
  const routeShape = route.shape;

  routeShape.forEach((point) => {
    const parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);


  const dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}});
  //TODO: move svg to service. It's ugly to hardcode them
  let svgMarkup = '<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#1b468d" stroke="white" stroke-width="1"  /></svg>';
  let maneuver;
  let marker;
  let waypoint;

  routeGroup = new H.map.Group();
  // Add a marker for each maneuver
  for (let i = 0;  i < route.leg.length; i += 1) {
    for (let j = 0;  j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      marker = new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude
      }, {
        icon: dotIcon
      });
      marker.text = maneuver.instruction;
      routeGroup.addObject(marker);
    }
  }

  //TODO: move svg to service. It's ugly to hardcode them
  for (let i = 0; i < route.waypoint.length; i += 1) {
    svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle fill="#fff" stroke="#bfbfbf" stroke-width="2.2" cx="29" cy="30" r="27.5"></circle></svg>';
    if (i === 0) {
      svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle fill="#389CD6" cx="30" cy="30" r="30"></circle></svg>';
    } else if (i === route.waypoint.length - 1) {
      svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 20 20"><circle fill="#fff" cx="10" cy="10" r="8.029"></circle><g><path fill="#111623" d="M14.316 16.764c.98-.63 1.816-1.464 2.445-2.445h-2.444v2.444zM14.316 5.684V3.236C13.068 2.438 11.59 1.97 10 1.97v3.714h4.316zM5.684 3.236c-.984.63-1.82 1.464-2.448 2.448h2.448V3.236zM5.685 14.316v2.447c1.247.8 2.725 1.267 4.315 1.267v-3.714H5.685zM14.316 10H10V5.683H5.684V10H1.97c0 1.59.47 3.068 1.267 4.316h2.447V10H10v4.316h4.316V10h3.713c0-1.59-.47-3.07-1.267-4.316h-2.447V10z"></path></g></svg>';
    }
    waypoint = route.waypoint[i];
    marker = new H.map.Marker({
      lat: waypoint.mappedPosition.latitude,
      lng: waypoint.mappedPosition.longitude
    }, {
      icon: new H.map.Icon(svgMarkup, {anchor: {x:29, y:30}})
    });
    marker.text = waypoint.label;
    routeGroup.addObject(marker);
  }

  routeGroup.addEventListener('tap', (evt) => {
    openBubble(evt.target.getPosition(), evt.target.text);
    evt.preventDefault();
    evt.stopPropagation();
  }, false);

  map.addObject(routeGroup);
}

export function showSearchResults(results = []) {
  removeMarkers();
  searchResultsGroup = new H.map.Group();
  searchResultsGroup.addObjects(results.map((searchResult) => {
    return new H.map.Marker({lat: searchResult.position[0],
      lng: searchResult.position[1]})
  }));
  map.addObject(searchResultsGroup);
}
