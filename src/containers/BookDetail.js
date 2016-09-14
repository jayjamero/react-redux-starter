import React, { Component } from 'react';
import { connect } from 'react-redux';

class BookDetail extends Component {
  render() {
    if (!this.props.book) {
      return <div>Select a book to get started.</div>;
    }
    return (<div>
      <h2>Details For: </h2>
      <p>{this.props.book.title}</p>
      <p>{this.props.book.pages}</p>
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    book: state.activeBook
  }
} 

export default connect(mapStateToProps)(BookDetail);