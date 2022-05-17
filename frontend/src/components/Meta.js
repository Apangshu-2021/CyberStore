import React from 'react'
import { Helmet } from 'react-helmet'
const Meta = (props) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name='description' content={props.description} />
      <meta name='keyword' content={props.keywords} />
    </Helmet>
  )
}
Meta.defaultProps = {
  title: 'Welcome to CyberStore',
  description: 'We sell best products for cheap',
  keywords: 'electronics,buy electronics,cheap electronics',
}
export default Meta
