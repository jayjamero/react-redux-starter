import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import HeaderLayout from 'layouts/HeaderLayout'
import BodyLayout from 'layouts/BodyLayout'
import FooterLayout from 'layouts/FooterLayout'
import GenericContainer from 'containers/GenericContainer'

// Container is a react component that gets bonded with application state
class AppLayout extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    // const { componentBeingRendered } = this.props
    return (
      <div className="l-home">
        <HeaderLayout />
        <BodyLayout>
          <GenericContainer />
        </BodyLayout>
        <FooterLayout />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout)
