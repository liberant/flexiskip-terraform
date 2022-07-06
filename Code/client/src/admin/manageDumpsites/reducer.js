import { combineReducers } from 'redux';
import list from './list/reducer';
import view from './view/reducers';

export default combineReducers({
  list,
  view,
});
