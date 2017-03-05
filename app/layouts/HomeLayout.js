import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HeaderLayout from './HeaderLayout';
import BodyLayout from './BodyLayout';
import FooterLayout from './FooterLayout';

// Container is a react component that gets bonded with application state
class HomeLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div className="l-home">
        <HeaderLayout />
        <BodyLayout>
          <h2>Home Layout</h2>
        </BodyLayout>
        <FooterLayout />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeLayout);
