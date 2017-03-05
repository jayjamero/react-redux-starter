import React, { PureComponent } from 'react';
import Navigation from '../components/Navigation';

class HeaderLayout extends PureComponent {
  render() {
    const BROWSE_HAPPY = `<!--[if lte IE 8]>
      <p className="browsehappy">
        You are using an <strong>outdated</strong> browser.
        Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
      </p>
    <![endif]-->`;
    return (
      <header className="l-hd">
        <div dangerouslySetInnerHTML={{__html: BROWSE_HAPPY}}></div>
        <div className="l-pg l-pg--width">
          <h1>React Redux Starer</h1>
          <Navigation />
        </div>
      </header>
    );
  }
}

export default HeaderLayout;
