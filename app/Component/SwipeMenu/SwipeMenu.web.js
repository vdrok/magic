import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Button} from 'semantic-ui-react';
import './Style/SwipeMenu.scss';

class SwipeMenu extends React.Component {
    static propTypes = {
        expanded: PropTypes.bool
    };

    constructor(prop) {
        super(prop);

        this.state = {
            expanded: this.props.expanded
        }
    }

    render() {
        return <div className={this.state.expanded ? "sidebar-wrapper open" : "sidebar-wrapper"}>
            <Button onClick={this.expand.bind(this)} className="open-button">
                <Icon name={this.state.expanded ? `chevron right` : `chevron left`}/>
            </Button>

            <div className='content'>
                {this.props.children}
            </div>
        </div>
    }

    expand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }
}

SwipeMenu.defaultProps = {
    expanded: false
};

export default SwipeMenu;