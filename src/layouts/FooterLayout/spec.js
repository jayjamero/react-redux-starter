import React from 'react'
import { shallow } from 'enzyme'
import FooterLayout from './index'

// TODO Sample mock test for now
describe('<FooterLayout />', () => {
  test('should render without throwing an error', () => {
    const FooterLayoutComponent = () => <FooterLayout />
    const component = shallow(<FooterLayoutComponent />)
    expect(component.name()).toBe('FooterLayout')
  })
})
