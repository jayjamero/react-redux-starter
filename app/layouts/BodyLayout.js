import React, { PureComponent } from 'react';

class BodyLayout extends PureComponent {
  render() {
    return (
      <section className="l-bd">
        <div className="l-pg l-pg--width">
          {this.props.children}
        </div>
      </section>
    );
  }
}

BodyLayout.propTypes = {
  children: React.PropTypes.element,
};

export default BodyLayout;
