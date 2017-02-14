import React, { Component } from 'react';
// Container is a react component that gets bonded with application state
import BookList from '../containers/BookList';
import BookDetail from '../containers/BookDetail';

export default class App extends Component {
  render() {
    return (<div>
      <BookList />
      <BookDetail />
    </div>);
  }
}