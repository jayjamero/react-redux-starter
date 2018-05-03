import React from 'react'
import { shallow } from 'enzyme'
import HeaderLayout from './index'

// TODO Sample mock test for now
describe('<HeaderLayout />', () => {
  test('should render without throwing an error', () => {
    const HeaderLayoutComponent = () => <HeaderLayout />
    const component = shallow(<HeaderLayoutComponent />)
    expect(component.name()).toBe('HeaderLayout')
  })
})
