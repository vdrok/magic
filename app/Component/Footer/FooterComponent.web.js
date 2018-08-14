import React from 'react';
import { Container } from 'semantic-ui-react';
import './Style/FooterComponent.scss';

class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
                <Container>
                    <a className="footer-link" target="_blank" href="https://levuro.com/general-terms-service">General Terms of Service</a>
                    <a className="footer-link" target="_blank" href="https://levuro.com/data-privacy">Data Privacy Statement</a>
                    <a className="footer-link" target="_blank" href="https://levuro.com/impressum">Impressum</a>

                    <a className="app-link" target="_blank" href="https://itunes.apple.com/us/app/levuro-engage/id1308178619"><img src={require('../../Images/ios_en.svg')} alt="Download from App Store" /></a>
                    <a className="app-link" target="_blank" href="https://play.google.com/store/apps/details?id=com.levuro.engage2"><img src={require('../../Images/android_en.png')} alt="Download from Google Play" /></a>
                </Container>
            </div>
        );
    }
}

export default Footer;
