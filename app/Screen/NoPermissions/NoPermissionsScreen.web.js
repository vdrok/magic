import React from 'react';
import { withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Grid, Message} from 'semantic-ui-react'

import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import {restrictions} from "../../Helpers/Permissions";


class NoPermissionsScreen extends React.Component {
    static propTypes = {
        restrictionsKey: PropTypes.string
    }

    render() {
        return (
            <Container className="screen-no-permissions">
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <BackButtonComponent onClickCallback={() => this.props.history.goBack()}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Message warning>
                                <Message.Header>{this.getMessage()}</Message.Header>
                                <p>Please contact your project administrator</p>
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

    getMessage() {
        if (!this.props.restrictionsKey || !this.props.restrictionsKey.length) {
            return "You don't have permissions to access this page"
        }

        return restrictions[this.props.restrictionsKey].permissions.message
    }
}

export default withRouter(NoPermissionsScreen);

