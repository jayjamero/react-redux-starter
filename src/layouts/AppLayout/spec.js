import React from 'react'
import { shallow } from 'enzyme'
import AppLayout from './index'

// TODO Sample mock test for now
describe('<AppLayout />', () => {
  test('should render without throwing an error', () => {
    const AppLayoutComponent = () => <AppLayout />
    const component = shallow(<AppLayoutComponent />)
    expect(component.name()).toBe('AppLayout')
  })
})
