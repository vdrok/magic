import React, { Component } from 'react'
import AppNavigation from "../Navigation/AppNavigation.web";
import MainMenuComponent from "../Component/MainMenu/MainMenuComponent.web"
import Notification from "../Component/Notification/Notification.web"

import FooterComponent from '../Component/Footer/FooterComponent.web';
import ClientSelector from "../Component/ClientSelector/ClientSelectorComponent.web";
import { Grid, Container, Image} from 'semantic-ui-react'

import {logo} from '../Helpers';
import '../Styles/appStyle.scss'


export default class AuthApp extends Component{

    render() {
        return (
            <Container >
                <Grid >
                    <Grid.Row  columns={2} verticalAlign='middle' stretched={true}>
                        <Grid.Column mobile={8} tablet={5} computer={3}  >
                            <h2 className="brand"><Image src={logo} alt="Duo logo" size='mini' floated='left' /> Engage</h2>
                        </Grid.Column>

                        <Grid.Column mobile={8} tablet={11} computer={5} verticalAlign='middle' floated='right'>
                            <Grid columns={2} stackable style={{flexDirection: 'row-reverse'}}>
                                <div className="eleven wide">
                                    <ClientSelector/>
                                </div>

                                <div className="five wide">
                                    <Notification />
                                </div>
                            </Grid>
                        </Grid.Column>

                    </Grid.Row>

                    <Grid.Row columns={2}>
                        <Grid.Column computer={3}>
                            <MainMenuComponent />
                        </Grid.Column>

                        <Grid.Column stretched={true} computer={13}>
                            <AppNavigation />
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
                <FooterComponent/>
            </Container>
              )
    }
}
