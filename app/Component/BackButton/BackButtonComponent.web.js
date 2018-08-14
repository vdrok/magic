import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import './Style/BackButtonStyle.scss';

class BackButtonComponent extends React.Component {
    static propTypes = {
        onClickCallback: PropTypes.func
    };

    render() {
        const handler = this.props.onClickCallback || this.props.history.goBack;

        return <a href="javascript:void(0)" onClick={handler} className="back-button"><i className="material-icons">keyboard_arrow_left</i> Back</a>
    }
}

export default withRouter(BackButtonComponent);