import { combineReducers } from 'redux';
import books from './BooksReducer';
import activeBook from './ActiveBookReducer';

// a function that returns a piece of the application state
// because application can have many different pieces of state == many reducers
const rootReducer = combineReducers({
  books,
  activeBook
});

export default rootReducer;
