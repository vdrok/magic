import React from 'react';
import PropTypes from 'prop-types';
import './Style/WhiteBoxComponentStyle.scss'

class WhiteBox extends React.PureComponent {

    static propTypes = {
        onLayout: PropTypes.func,
        onClick: PropTypes.func,
        className: PropTypes.string,
    }

    constructor(props){
        super(props);
        this.wrapper = React.createRef();
    }

    componentDidMount(){
        if(this.props.onLayout){
            this.props.onLayout(this.wrapper);
        }
    }


    render() {

        const clsClickable = this.props.onClick ? ' clickable' : '';
        const cls = 'white-box clearfix ' + this.props.className + clsClickable ;

        return <div ref={(ref) => this.wrapper = ref} className={cls} onClick={this.props.onClick}>
            {this.props.children}
        </div>;
    }
}


export default WhiteBox;