import React, { Component } from 'react'

import AppNavigation from "../Navigation/AppNavigation.web";
import FooterComponent from '../Component/Footer/FooterComponent.web';

import '../Styles/appStyle.scss'


export default class UnAuthApp extends Component{

    render() {
        return (
                    <div className="container unauthorised-container">
                        <div className="row">
                                    <AppNavigation />
                        </div>
                        <FooterComponent/>

                    </div>
              )
    }
}
