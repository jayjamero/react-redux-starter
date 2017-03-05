import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import AppLayout from '../layouts/AppLayout';
import SimpleDetailContainer from '../containers/SimpleDetailContainer';
import SimpleContainer from '../containers/SimpleContainer';

// Main Entry Point
const App = ({store}) => {
  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(browserHistory, store);
  return (
    <Router history={history}>
      <Route name="home" path="/" component={AppLayout}>
        <IndexRedirect to="/simple" />
        <Route name="simple" path="/simple" components={{componentBeingRendered: SimpleContainer}} />
        <Route name='detail' path='/detail' components={{componentBeingRendered: SimpleDetailContainer}} />
      </Route>
    </Router>
  );
};

App.propTypes = {
  store: React.PropTypes.object,
};

export default App;