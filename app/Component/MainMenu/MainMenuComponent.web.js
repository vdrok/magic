import React from 'react';
import { connect } from 'react-redux';
import { Link,  withRouter} from 'react-router-dom';
import { Grid, Container, Image, Menu} from 'semantic-ui-react'
import PropTypes from 'prop-types';

class MainMenuComponent extends React.Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    redirect(page){
        this.props.history.push(page);
    }

    render() {
        return <Menu pointing text vertical>
            <Menu.Item name='home' onClick={() => this.redirect('/')}>
                Stories
            </Menu.Item>

            <Menu.Item name='compose' onClick={() => this.redirect('/compose')}>
                Compose
            </Menu.Item>

            <Menu.Item name='media' onClick={() => this.redirect('/media')}>
                Media
            </Menu.Item>
            <Menu.Item name='analytics' onClick={() => this.redirect('/analytics')}>
                Analytics
            </Menu.Item>

            <Menu.Item  name='settings' onClick={() => this.redirect('/settings')}>
                Settings
            </Menu.Item>
        </Menu>;
    }
}



const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    click: () => { }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainMenuComponent));