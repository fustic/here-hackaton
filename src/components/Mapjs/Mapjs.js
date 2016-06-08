import s from './Mapjs.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import mapjs from './services/mapjs';
import { showSearchResults } from './services/markersService';
import { SEARCH_ACTION } from '../../constants';

class Mapjs extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  initMap() {
    mapjs(document.getElementById('mapContainer'), window.devicePixelRatio || 1, this.context.store);
  }

  componentDidMount() {
    this.initMap();
    this.context.store.subscribe(() => {
      const lastAction = this.context.store.getState().lastAction;
      if (lastAction.type === SEARCH_ACTION) {
        showSearchResults(lastAction.data);
      }
    });
  }

  // componentDidUpdate() {
  //   this.initMap();
  // }

  render() {
    return (
      <div className={s.mapContainer} id="mapContainer">

      </div>
    )
  }
}

export default withStyles(s)(Mapjs);
