import React from 'react'
import { shallow } from 'enzyme'
import BodyLayout from './index'

// TODO Sample mock test for now
describe('<BodyLayout />', () => {
  test('should render without throwing an error', () => {
    const BodyLayoutComponent = () => <BodyLayout />
    const component = shallow(<BodyLayoutComponent />)
    expect(component.name()).toBe('BodyLayout')
  })
})
