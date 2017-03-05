import React from 'react';
import { describe, it } from 'mocha';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Navigation from '../../../app/components/Navigation';

describe('<Navigation />', () => {
  it('check if it renders with class c-navigation', function() {
    const wrapper = mount(
      <Navigation />
    );
    expect(wrapper.find('.c-navigation').length).to.equal(1);
  });
});
