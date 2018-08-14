import React from 'react';
import PropTypes from 'prop-types';
import { Facebook as FacebookContentLoader } from 'react-content-loader'

export default class LoadingContent extends React.PureComponent {

    static propTypes = {
        className: PropTypes.string
    }

    render() {
        return <FacebookContentLoader className={this.props.className} />
    }
}