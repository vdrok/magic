import React from 'react';

import { View, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '../Text/TextComponent.mob';
import style from './Style/StartScreenStyle';
import { logo } from '../../Helpers';

export default class StartScreen extends React.Component {
    render() {
        return (
            <KeyboardAvoidingView
                style={style.container}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <ScrollView contentContainerStyle={style.containerView}>
                    <View style={style.logoWrapper}>
                        <Image source={logo} style={style.logo} />
                        <View style={style.logoTextWrapper}>
                            <Text style={style.logoText}>Engage</Text>
                            <Text style={style.LogoTextLead}>Storytelling</Text>
                        </View>
                    </View>

                    {this.props.children}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
