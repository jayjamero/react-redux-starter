import React, { PureComponent } from 'react'
import HeaderLayout from 'layouts/HeaderLayout'
import BodyLayout from 'layouts/BodyLayout'
import FooterLayout from 'layouts/FooterLayout'
import GenericContainer from 'containers/GenericContainer'
import styles from './styles.scss'

export default class AppLayout extends PureComponent {
  render() {
    return (
      <div className={styles.home}>
        <HeaderLayout />
        <BodyLayout>
          <GenericContainer />
        </BodyLayout>
        <FooterLayout />
      </div>
    )
  }
}
