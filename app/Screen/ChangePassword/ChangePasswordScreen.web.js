import React from 'react';
import {withRouter} from 'react-router-dom';

import { logo } from '../../Helpers';
import ChangePasswordComponent from '../../Component/ChangePassword/ChangePasswordComponent.web';
import './Style/ChangePasswordScreen.scss';
import {Grid, Header, Image} from "semantic-ui-react";

class ChangePasswordScreen extends React.Component {
    render() {
        return this._renderPublicPage();
    }

    _renderPublicPage() {
        const {token} = this.props.match.params || '';

        return <div className="screen-login">
            <Grid
                textAlign='center'
                style={{ height: '100%' }}
                verticalAlign='middle'
            >
                <Grid.Column style={{ maxWidth: 450 }}>

                    {this._renderPublicPageHeader()}

                    <ChangePasswordComponent callback={() => this._toHomepage()} token={token}/>

                </Grid.Column>

            </Grid>

        </div>;
    }

    _renderPublicPageHeader() {
        const {token} = this.props.match.params;

        if (!token) {
            return null;
        }

        return <Header as='h2' textAlign='center'>
            <Image src={'../' + logo} />
            {' '}Engage
        </Header>
    }

    _toHomepage() {
        this.props.history.push('/');
    }
}

export default withRouter(ChangePasswordScreen);