import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import themeable from '@instructure/ui-themeable'
import CustomPropTypes from '@instructure/ui-utils/lib/react/CustomPropTypes'
import capitalizeFirstLetter from '@instructure/ui-utils/lib/capitalizeFirstLetter'
import safeCloneElement from '@instructure/ui-utils/lib/react/safeCloneElement'
import matchComponentTypes from '@instructure/ui-utils/lib/react/matchComponentTypes'
import { omitProps, pickProps } from '@instructure/ui-utils/lib/react/passthroughProps'

import GridRow from './GridRow'

import styles from './styles.css'
import theme from './theme'

/**
---
category: components/layout
---
**/
@themeable(theme, styles)
export default class Grid extends Component {
  /* eslint-disable react/require-default-props */
  static propTypes = {
    children: CustomPropTypes.Children.oneOf([GridRow]),
    colSpacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
    rowSpacing: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
    hAlign: PropTypes.oneOf(['start', 'center', 'end', 'space-around', 'space-between']),
    vAlign: PropTypes.oneOf(['top', 'middle', 'bottom']),
    startAt: PropTypes.oneOf(['small', 'medium', 'large', 'x-large', null]),
    visualDebug: PropTypes.bool
  };
  /* eslint-enable react/require-default-props */

  static defaultProps = {
    colSpacing: 'medium',
    rowSpacing: 'medium',
    hAlign: 'start',
    startAt: 'small',
    vAlign: 'top',
    visualDebug: false
  };

  startAtClass () {
    return !!this.props.startAt && (`startAt${capitalizeFirstLetter(this.props.startAt)}`)
  }

  renderChildren () {
    const children = Children.toArray(this.props.children)

    return children.map((child, index) => {
      if (matchComponentTypes(child, [GridRow])) {
        return safeCloneElement(child, {
          ...pickProps(this.props, Grid.propTypes),
          ...child.props, /* child props should override parent */
          isLastRow: ((index + 1) === children.length)
        })
      } else {
        return child // PropType validation should handle errors
      }
    })
  }

  render () {
    const classes = {
      [styles.root]: true,
      [styles[this.startAtClass()]]: !!this.props.startAt,
      [styles.visualDebug]: this.props.visualDebug
    }

    const props = omitProps(this.props, Grid.propTypes)

    return (
      <span
        {...props}
        className={classnames(classes)}
      >
        {this.renderChildren()}
      </span>
    )
  }
}

export { default as GridCol } from './GridCol'
export { default as GridRow } from './GridRow'
