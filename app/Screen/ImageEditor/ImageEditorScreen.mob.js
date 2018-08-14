import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Dimensions, View, Text, ActivityIndicator, Button, Image } from 'react-native';
import { Form, Item, Input } from 'native-base';
import Modal from 'react-native-modal';

import ButtonComponent from '../../Component/Button/ButtonComponent.mob';
import ImageCropComponent from '../../Component/ImageEditor/ImageCrop/ImageCropComponent.mob';
import APIMediaFile from '../../API/ApiMediaFiles';
import { logo } from '../../Helpers';
import Colors from '../../Styles/Colors';
import Style from './Style/ImageEditorScreenStyle';

class ImageEditorScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const saveHandler =
            navigation.state.params && navigation.state.params.saveHandler
                ? navigation.state.params.saveHandler
                : () => {};

        return {
            headerLeft: (
                <Button
                    title="Back"
                    onPress={() => {
                        navigation.goBack(null);
                    }}
                />
            ),
            headerRight: <Button title="Save As" onPress={saveHandler} />,
            title: <Image source={logo} style={Style.header_logo} />
        };
    };

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    media: PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        name: PropTypes.string.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        })
    };

    constructor(props) {
        super(props);

        const { media } = this.props.navigation.state.params;

        this.state = {
            error: false,
            saving: false,
            showModal: false,
            media: media,
            source: null,
            name: ''
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.props.navigation.setParams({
            saveHandler: this.handleSave
        });
    }

    componentDidMount() {
        APIMediaFile.getFileUrl(this.state.media.id)
            .then(success => {
                if (success.status === 200) {
                    this.setState({
                        source: success.data
                    });
                }
            })
            .catch(error => {
                alert(error && error.message);
            });
    }

    handleSave() {
        this.setState({
            showModal: true,
            error: false
        });
    }

    handleSubmit() {
        if (!this.state.name) {
            this.setState({
                error: 'Image name it\'s required'
            });
            return;
        }

        const data = this.refs.imageCrop.getCropData();
        data.name = this.state.name;
        
        this.setState({
            error: false,
            saving: true
        });

        APIMediaFile.createImage(this.state.media.id, data)
            .then(success => {
                this.setState({ showModal: false });
                this.props.redirect('MediaScreen');
            })
            .catch(error => {
                this.setState({
                    saving: false,
                    error:
                        error.response.status === 400
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    render() {
        if (!this.state.source) {
            return (
                <View style={Style.container}>
                    <ActivityIndicator size="large" color={Colors.green} style={Style.loader} />
                </View>
            );
        }

        return (
            <View style={Style.container}>
                <ImageCropComponent ref={'imageCrop'} image={this.state.source} />
                {this.renderModal()}
            </View>
        );
    }

    renderModal() {
        if (!this.state.showModal) {
            return null;
        }

        return (
            <Modal
                onSwipe={() => this.setState({ showModal: false })}
                onBackdropPress={() => this.setState({ showModal: false })}
                onBackButtonPress={() => this.setState({ showModal: false })}
                isVisible={this.state.showModal}
                onRequestClose={() => this.setState({ showModal: false })}>
                <View style={Style.modalContainer}>
                    <Text style={Style.modalHeader}>How to name the new image?</Text>
                    <Form>
                        <Item error={this.state.media.name.length === 0}>
                            <Input placeholder="Image name" onChangeText={text => this.setState({ name: text })} />
                        </Item>
                        {this.state.error && <Text style={Style.error}>{this.state.error}</Text>}
                    </Form>
                    <ButtonComponent busy={this.state.saving} onPress={this.handleSubmit} style={Style.modalSubmit}>
                        <Text>Save as new</Text>
                    </ButtonComponent>
                </View>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    redirect: scene => dispatch(NavigationActions.navigate({ routeName: scene }))
});

export default connect(null, mapDispatchToProps)(ImageEditorScreen);
