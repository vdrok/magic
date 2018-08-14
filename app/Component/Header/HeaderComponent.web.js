import React from 'react';
import { connect } from 'react-redux';
import { Link,  withRouter} from 'react-router-dom'

class HeaderComponent extends React.Component {

    render() {
        return <h1 className="text-center"></h1>;
    }
}


const mapStateToProps = state => ({
    header: state.router
});

const mapDispatchToProps = dispatch => ({
    click: () => { }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderComponent));