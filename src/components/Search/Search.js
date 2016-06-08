import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Search.css';
import { searchDataReceived } from '../../actions/search.js';
import * as api from '../../services/pbapi.js';

class Search extends Component {
  constructor(props) {
    super(props);

    this.placeholder = 'Search';
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    const query = window.location.hash.match(/q=([A-z0-9\-_]+)/);
    if (query) {
      this.refs.input.value = query[1];
      this.search(query[1]);
    }
  }

  onKeyUp(e) {
    const keyCode = e.keyCode;

    if (keyCode === 13) {
      this.search(this.refs.input.value);
    }
  }

  async search(term) {
    if (!term) {
      this.reset();
      return;
    }

    const state = this.context.store.getState();
    const query = {
      q: term,
      'X-Map-Viewport': api.transformBoundingBox(state.map.mapState.boundingBoxPBAPI),
    };

    const response = await api.search(query);
    window.location.hash = `?q=${term}`;
    this.context.store.dispatch(searchDataReceived(response, query));
  }

  reset() {
    this.context.store.dispatch(searchDataReceived([], ''));
    window.location.hash = ``;
  }

  render() {
    return (
      <div className={s.search}>
        <input className={s.input} ref="input" placeholder={this.placeholder} onKeyUp={this.onKeyUp} />
      </div>
    );
  }
}

Search.contextTypes = {
  store: PropTypes.object.isRequired,
};

export default withStyles(s)(Search);
