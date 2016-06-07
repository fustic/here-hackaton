import s from './Mapjs.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React, { Component, PropTypes } from 'react';
import mapjs from './services/mapjs';

class Mapjs extends Component {

  initMap() {
    mapjs(document.getElementById('mapContainer'), window.devicePixelRatio || 1);
  }

  componentDidMount() {
    this.initMap();
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
