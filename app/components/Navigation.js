import React from 'react';
import { Link } from 'react-router';

const Navigation = () => (
  <nav className="c-navigation">
    <ul role="navigation">
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/simple">Simple</Link></li>
      <li><Link to="/detail">Detail</Link></li>
    </ul>
  </nav>
);

export default Navigation;
