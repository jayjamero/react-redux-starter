import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Container - is just a component that has direct access to state produced by redux
// react and redux seperate libraries - react-redux melds two together
// Only create containers out of components that care about a particular piece of state
class SimpleContainer extends Component {
  render() {
    return (
      <h2>Simple Container</h2>
    );
  }
}

function mapStateToProps(state) {
  // whatever is returned will show up as props
  return {
    state
  };
}

// Anything returned from this function will end up as props
function mapDispatchToProps(dispatch) {
  // Whenever dispatch is called the result should be passed
  // to all of the reducers
  return bindActionCreators({
  }, dispatch);
}

// Prop type declaration
SimpleContainer.propTypes = {
};

// To promote a component to a container (smart component) - it needs
// to know about this new dispatch method. Make it available
// as a prop.
export default connect(mapStateToProps, mapDispatchToProps)(SimpleContainer);
