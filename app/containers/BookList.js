import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectBook } from '../actions/index';
import { bindActionCreators } from 'redux';

// Container - is just a component that has direct access to state produced by redux
// react and redux seperate libraries - react-redux melds two together
// Only create containers out of components that care about a particular piece of state
class BookList extends Component {
  renderList() {
    return this.props.books.map((book) => {
      return (
        <li
          key={book.title}
          onClick={() => this.props.selectBook(book)}
          className="list-group-item">{book.title}
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="list-group col-sm-4">
        {this.renderList()}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  // whatever is returned will show up as props
  // inside of bookList
  return {
    books: state.books
  };
}

// Anything returned from this function will end up as props
// on the BookList Container
function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result should be passed
  // to all of the reducers
  return bindActionCreators({
    selectBook: selectBook
  }, dispatch);
}

BookList.propTypes = {
  books: React.PropTypes.array,
  selectBook: React.PropTypes.func
};

// To bromote BookList from a component to a container (smart component) - it needs
// to know about this new dispatch method, selectBook. Make it available
// as a prop.
export default connect(mapStateToProps, mapDispatchToProps)(BookList);
