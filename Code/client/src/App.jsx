import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import shortid from 'shortid';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-select/dist/react-select.css';

import store, { history } from './store';
import Routes from './routes';

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        {
          Routes.map(route => React.cloneElement(route, { key: `@Routes/${shortid.generate()}` }))
        }
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default hot(module)(App);
