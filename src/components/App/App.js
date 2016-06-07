/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './App.css';
import Mapjs from '../Mapjs/Mapjs';
import { Provider } from 'react-redux';
import NotificationSystem from 'react-notification-system';

let notificationSystem = null;
let activeNotification = null;

class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      store: PropTypes.object.isRequired,
      insertCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func,
    }).isRequired,
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      setTitle: context.setTitle || emptyFunction,
      setMeta: context.setMeta || emptyFunction,
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
    window.removeEventListener('online', this._addNotification);
    window.removeEventListener('offline', this._addNotification);
  }

  _addNotification(event) {
    if (event) {
      event.preventDefault();
    }

    if (!navigator.onLine) {
      activeNotification = notificationSystem.addNotification({
        title: 'Status',
        message: 'Your browser is offline',
        level: 'warning',
        position: 'tc',
        autoDismiss: 0,
        dismissible: false
      });
      return;
    }

    if (activeNotification) {
      notificationSystem.removeNotification(activeNotification);
    }
  }

  componentDidMount() {
    notificationSystem = this.refs.notificationSystem;
    window.addEventListener('online', this._addNotification);
    window.addEventListener('offline', this._addNotification);
    this._addNotification();
  }

  render() {
    if (this.props.error) {
      return this.props.children;
    }

    const store = this.props.context.store;
    return (
      <Provider store={store}>
        <div>
          <NotificationSystem ref="notificationSystem" />
          {this.props.children}
          <Mapjs />
        </div>
      </Provider>
    );
  }

}

export default App;
