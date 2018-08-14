import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-native-content-loader';
import { View } from 'react-native';
import { Circle, Rect } from 'react-native-svg';

export default class LoadingContent extends React.PureComponent {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ])
    }

    render() {
        const { style } = this.props;

        return <View style={style}>
                <ContentLoader
                    height={160}
                    width={400}
                    speed={2}
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                >
                    <Rect x="70" y="15" rx="4" ry="4" width="117" height="6.4" />
                    <Rect x="70" y="35" rx="3" ry="3" width="85" height="6.4" />
                    <Rect x="0" y="80" rx="3" ry="3" width="350" height="6.4" />
                    <Rect x="0" y="100" rx="3" ry="3" width="380" height="6.4" />
                    <Rect x="0" y="120" rx="3" ry="3" width="201" height="6.4" />
                    <Circle cx="30" cy="30" r="30" />
                </ContentLoader>
            </View>

    }
}