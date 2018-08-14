import React, { Component } from 'react'
import PropTypes from 'prop-types';

import '../Styles/appStyle.scss'
import AuthApp from "./AuthApp";
import UnAuthApp from "./UnAuthApp";
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom'

class App extends Component{

    render() {
        const isForgotPasswordLocation = this.props.location.pathname.match(/\/forgot-password\//);

        if(this.props.isAuthenticated && !isForgotPasswordLocation)
            return <AuthApp />;
        else
            return <UnAuthApp />;
    }
}


App.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    tokenVerified: state.auth.tokenVerified
});

const mapDispatchToProps = dispatch => ({

});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
