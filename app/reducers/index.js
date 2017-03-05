import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import appState from './AppStateReducer';

// a function that returns a piece of the application state
// because application can have many different pieces of state == many reducers
const rootReducer = combineReducers({
  appState,
  routing: routerReducer,
});

export default rootReducer;
