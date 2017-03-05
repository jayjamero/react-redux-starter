import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import HomeLayout from '../layouts/HomeLayout';

const App = () => {
  return (
    <ReactCSSTransitionGroup
      component="div"
      transitionName="l-app-root"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={true}
      transitionEnterTimeout={500}
      transitionLeave={false}
    >
      <HomeLayout />
    </ReactCSSTransitionGroup>
  );
};

export default App;
