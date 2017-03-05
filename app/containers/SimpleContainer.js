import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Container - is just a component that has direct access to state produced by redux
// react and redux seperate libraries - react-redux melds two together
// Only create containers out of components that care about a particular piece of state
class SimpleContainer extends Component {
  render() {
    return (
      <h3>Simple Container</h3>
    );
  }
}

function mapStateToProps(state) {
  // whatever is returned will show up as props
  // inside of bookList
  return {
    state
  };
}

// Anything returned from this function will end up as props
// on the BookList Container
function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result should be passed
  // to all of the reducers
  return bindActionCreators({
  }, dispatch);
}

SimpleContainer.propTypes = {
  books: React.PropTypes.array,
  selectBook: React.PropTypes.func
};

// To bromote BookList from a component to a container (smart component) - it needs
// to know about this new dispatch method, selectBook. Make it available
// as a prop.
export default connect(mapStateToProps, mapDispatchToProps)(SimpleContainer);
