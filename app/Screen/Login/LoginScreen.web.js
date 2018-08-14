import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link} from 'react-router-dom'
import { logo } from '../../Helpers';
import './Style/LoginScreen.scss'
import { Header, Segment, Form, Button, Image, Grid, Message, Checkbox} from 'semantic-ui-react'

import { Creators as AuthActions } from '../../Reducer/AuthReducer'
import {Creators as SettingsActions} from "../../Reducer/SettingsReducer";
import Platform from "../../Helpers/Platform";


const LOGIN_SCREEN_INIT_STATE = {
    email: '',
    password: '',
    error: false,
    isAuthenticated: false,
    demoAccess: false,
};


class LoginScreen extends React.Component {

    constructor (props) {
        super(props);

        this.state = LOGIN_SCREEN_INIT_STATE;
    }

    componentWillReceiveProps (newProps) {

        let isError = false;
        // state change from busy to not busy and is not Authenticated, means error
        if(this.state.busy && !newProps.busy && !newProps.isAuthenticated){
            isError = true;
        }

        this.setState({
            error: isError,
            busy: newProps.busy,
            demoAccess: newProps.demoAccess,
        });

        if(newProps.isAuthenticated){
            this.setState({
                isAuthenticated: newProps.isAuthenticated
            });
        }
    }

    _loginSuccess(){
        if(this.state.isAuthenticated && !this.props.tokenVerified) {
            return <Redirect to='/'/>;
        }
    }

    _renderErrorMessage(){
        if(this.state.error)
            return <Message
        error
        header='Invalid e-mail or password'
        content='please try again or reset your password'
            />
    }

    _loginClick(){
        this.props.authenticate(this.state.email, this.state.password);
    }

    _renderDemoAccess(){

        if(Platform.isProd()){
            return null;
        }

        return <Segment>
            <Checkbox toggle
                      label="DEMO ACCESS"
                      checked={this.state.demoAccess}
                      onChange={(event, data) => {this.props.useFixtures(data.checked)}}
            />
            { (!this.state.demoAccess) ? null :
                <Message
                    warning
                    header='demo account'
                    content='E-mail "", Password: ok'
                />
            }

        </Segment>
    }

    render() {
        return (
          <div className="screen-login">
              <Grid
                  textAlign='center'
                  style={{ height: '100%' }}
                  verticalAlign='middle'
              >
                  <Grid.Column style={{ maxWidth: 450 }}>
                      <Header as='h2' textAlign='center'>
                          <Image src={logo} />
                          {' '}Engage
                      </Header>
                      {this._renderErrorMessage()}
                      <Form onSubmit={this._loginClick.bind(this)} loading={this.state.busy} style={{marginBottom: 10}} size='large'>
                          <Segment>
                              <Form.Input
                                  fluid
                                  icon='at'
                                  iconPosition='left'
                                  placeholder='E-mail'
                                  onChange={(event) => this.setState({
                                      email: event.target.value
                                  })}
                              />

                              <Form.Input
                                  fluid
                                  icon='lock'
                                  iconPosition='left'
                                  placeholder='Password'
                                  type='password'
                                  onChange={(event) => this.setState({
                                      password: event.target.value
                                  })}
                              />
                          </Segment>

                          <Button className="btn"
                                  type='submit' >Login</Button>
                      </Form>

                      <p>
                          <Link to={"/forgot-password"}>Forgot password?</Link><br />
                          <Link to={"/register"}>Register</Link>
                      </p>

                      {this._renderDemoAccess()}

                  </Grid.Column>

              </Grid>
              {this._loginSuccess()}

        </div>);
    }
}

LoginScreen.propTypes = {
    authenticate: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
    busy: state.auth.busy,
    isAuthenticated: state.auth.isAuthenticated,
    demoAccess: state.settings.useFixtures,
    tokenVerified: state.auth.tokenVerified
});

const mapDispatchToProps = dispatch => ({
    authenticate: (email, password) => {
        return dispatch(AuthActions.loginRequest(email,password))
    },
    useFixtures: (value) => {
        return dispatch(SettingsActions.useFixtures(value))
    }
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginScreen));