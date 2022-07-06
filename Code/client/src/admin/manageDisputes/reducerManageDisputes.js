import { combineReducers } from 'redux';
import list from './list/reducers';
import view from './view/reducers';

export default combineReducers({
  list,
  view,
});
