import React from 'react';
import {Creators as MediaFileActions} from "../../Reducer/MediaFilesReducer";
import {connect} from "react-redux";

class MediaUploadButton extends React.Component {


    _uploadClick(){
        if(this.refs.fileUploader){
            this.refs.fileUploader.click();
        }

    }

    _upload(files){
        const that = this;
        Array.from(files).forEach(file => {
            const type = file.type.startsWith('video/') || file.type.startsWith('application/')  ? 'video' : 'image';
            that.props.upload(type,file, file.name,file.size , file.type );
        });
    }

    render() {
        return (<div>
            <button className="btn" onClick={this._uploadClick.bind(this)}>UPLOAD</button>
                <input type="file" id="file" multiple
                       ref="fileUploader" style={{display: "none"}}
                       accept="image/*,video/mp4,video/quicktime,application/mxf"
                       onChange={(e)=> {
                           this._upload(e.target.files);
                       }}
                />
            </div>
        );
    }

}

const mapDispatchToProps = dispatch => ({
    upload: (type,uri, name,size,mime_type) => {
        return dispatch(MediaFileActions.putMediaFile(type,uri, name,size,mime_type))
    }
});

const mapStateToProps = (state) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaUploadButton)
