import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Grid, Item, Button, Modal, Form, Input } from 'semantic-ui-react';

import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import ImageCropComponent from '../../Component/ImageEditor/ImageCrop/ImageCropComponent.web';
import APIMediaFile from '../../API/ApiMediaFiles';
import './Style/ImageEditorScreenStyle.scss';

class ImageEditorScreen extends React.Component {
    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                media: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired
                }).isRequired
            })
        }),
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const { media } = this.props.location.state;

        this.state = {
            error: false,
            saving: false,
            showModal: false,
            media: media,
            source: null,
            name: media.name
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        const data = this.refs.imageCrop.getCropData();
        data.name = this.state.name;
        
        this.setState({
            saving: true
        });

        APIMediaFile.createImage(this.state.media.id, data)
            .then(success => {
                this.setState({ showModal: false });
                this.props.history.push('/media');
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
        return (
            <Grid className="page-image-editor" stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <BackButtonComponent
                            onClickCallback={() => {
                                this.props.history.push('/media');
                            }}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16} className="image-editor">
                        {!this.state.source && <Loader active inline="centered" />}
                        {this.state.source && (
                            <div>
                                <Item>
                                    <ImageCropComponent ref={'imageCrop'} image={this.state.source} />
                                </Item>
                                <Item>
                                    <Button
                                        floated="right"
                                        content="Save as new"
                                        loading={false}
                                        className="btn"
                                        icon="plus"
                                        labelPosition="left"
                                        onClick={this.handleSave}
                                    />
                                </Item>
                            </div>
                        )}
                        {this.renderModal()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    renderModal() {
        return (
            <Modal
                className="image-editor-modal"
                open={this.state.showModal}
                closeIcon
                onClose={() => this.setState({ showModal: false })}>
                <Modal.Header>How to name the new file?</Modal.Header>
                <Modal.Content>
                    <Form loading={this.state.saving} onSubmit={this.handleSubmit}>
                        <Form.Field required>
                            <label>New image name</label>
                            <Form.Input
                                fluid
                                required={true}
                                placeholder={this.state.media.name}
                                value={this.state.name}
                                onChange={event =>
                                    this.setState({
                                        name: event.target.value
                                    })
                                }
                            />
                        </Form.Field>
                        {this.state.error && <p className="error">{this.state.error}</p>}
                        <Form.Button className="submit-btn" type="submit" disabled={this.state.saving}>
                            Create new image
                        </Form.Button>
                    </Form>
                </Modal.Content>
            </Modal>
        );
    }
}

export default ImageEditorScreen;
