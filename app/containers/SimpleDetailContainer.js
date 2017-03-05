import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SimpleDetailContainer extends PureComponent {
  render() {
    return (
      <h2>Detail Container</h2>
    );
  }
}

function mapStateToProps(state) {
  return {
    state,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

SimpleDetailContainer.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleDetailContainer);
