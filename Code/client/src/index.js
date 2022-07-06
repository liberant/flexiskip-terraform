import React from 'react';
import ReactDOM from 'react-dom';

/* eslint import/no-webpack-loader-syntax: 0 */
/* eslint import/no-unresolved: 0 */

import '!!style-loader!css-loader!react-widgets/dist/css/react-widgets.css';
import './index.css';

import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
