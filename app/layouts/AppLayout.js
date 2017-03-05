import React, { PureComponent, cloneElement } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HeaderLayout from './HeaderLayout';
import BodyLayout from './BodyLayout';
import FooterLayout from './FooterLayout';

// Container is a react component that gets bonded with application state
class AppLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { componentBeingRendered } = this.props;
    return (
      <div className="l-home">
        <HeaderLayout />
        <BodyLayout>
          <ReactCSSTransitionGroup
            component="div"
            transitionName="s-slide"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnter
            transitionEnterTimeout={500}
            transitionLeave={false}
          >
            {cloneElement(componentBeingRendered, {
              key: location.pathname,
            })}
          </ReactCSSTransitionGroup>
        </BodyLayout>
        <FooterLayout />
      </div>
    );
  }
}

AppLayout.propTypes = {
  componentBeingRendered: React.PropTypes.shape.isRequired,
};

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
