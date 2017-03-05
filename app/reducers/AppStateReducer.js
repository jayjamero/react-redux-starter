import { APP_IS_LOADING, APP_ERROR } from '../actions/AppActions';

// Here if i am doing an isomorphic server and client i can pre load the reducer with default values easier
const DEFAULT_APP_SCHEMA = {
  loading: null,
  error: null,
};

export default function (state = DEFAULT_APP_SCHEMA, action) {
  switch (action.type) {
    case APP_IS_LOADING:
      return Object.assign({}, state, { loading: action.payload }); // lets not mutate
    case APP_ERROR:
      return Object.assign({}, state, { error: action.payload }); // lets not mutate
    default:
      return state;
  }
}
