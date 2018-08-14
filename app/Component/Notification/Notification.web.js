import React from 'react';
import {connect} from "react-redux";
import { Dropdown, Progress, Label, Form, Header } from 'semantic-ui-react'
import { pathOr } from 'ramda';
import { humanFileSize, secondsToLength } from '../../Helpers'
import './Style/Notification.scss';

class Notification extends React.Component {


    constructor(){
        super()
        this.state = {
            uploading: []
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            uploading: pathOr(this.state.uploading,['uploading'], newProps),
        });
    }

    _renderNoMessage(){

        if(this.state.uploading.length > 0)  return null;

        return <Dropdown.Item>
           No new notifications
        </Dropdown.Item>
    }

    _renderUploadingFiles(){
        const that = this;
        return this.state.uploading.map(function(uploadedFile, i){
                    return that._renderUploadingFile(i, uploadedFile.name, uploadedFile.progress, uploadedFile.stats)
                });

    }

    _renderUploadingFile(i, name, progress, stats){

       const statusText =  progress === 0 ? "waiting" : 'uploading';

       return <Dropdown.Item key={i}>
           <Dropdown.Header icon='cloud upload' content={statusText} />
           <div>
               <Header as='h4'>{name}</Header>
               {(progress > 0 || stats) &&  <Progress percent={progress} indicating progress />}
               {this.renderStats(stats)}
           </div>
       </Dropdown.Item>
    }

    renderStats(stats){
        if(!stats) return;

        return <p className='stats'> {humanFileSize(stats.totalUploaded)} / {humanFileSize(stats.fileSize)} ({stats.readableSpeed}/s) -{secondsToLength(stats.secondsLeft)}</p>
    }

    render() {

        const badge = this.state.uploading.length === 0 ? null : <Label basic color='red' pointing='right'>{this.state.uploading.length}</Label>

        return (
            <Form className="notification">
                <Form.Field>
                    {badge}
                <Dropdown icon='globe' floating button className='icon' direction='right'>
                    <Dropdown.Menu className='dropdown'>
                        {this._renderNoMessage()}
                        {this._renderUploadingFiles()}
                    </Dropdown.Menu>
                </Dropdown>
                </Form.Field>
            </Form>
        );
    }

}

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = (state) => {
    return {
        uploading: state.media.uploading
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
