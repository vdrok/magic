import BaseApi from './BaseApi';
import { uploadFileParams } from '../Saga/MediaFilesSaga';
import { buffers, eventChannel, END } from 'redux-saga';
import Platform from '../Helpers/Platform';
import Evaporate from 'evaporate';
import AWS from 'aws-sdk';

export interface updateMediaFileParams {
    name: String;
    status: Number;
}

const config = {
    signerUrl: BaseApi.baseUrl + 'mediaSignUpload',
    signHeaders: {
        Authorization: () => BaseApi.authToken
    },
    aws_key: process.env.AWS_BUCKET,
    bucket: 'duo-media',
    logging: false,
    //partSize: 8 * 1024 * 1024, // 8MB
    awsSignatureVersion: '4',
    awsRegion: 'eu-west-1',
    progressIntervalMS: 5000,
    cryptoHexEncodedHash256: function(data) {
        return AWS.util.crypto.sha256(data, 'hex');
    },
    cloudfront: true,
    computeContentMd5: true,
    cryptoMd5Method: function(data) {
        return AWS.util.crypto.md5(data, 'base64');
    }
};

let webUploader;
if (Platform.isWeb()) {
    Evaporate.create(config).then(function(evaporate) {
        webUploader = evaporate;
    });
}
const ApiMediaFiles = () => {
    const _api = BaseApi.api;

    const getMediaFiles = (page = 0, searchText, selectedFolder = null) => {
        let url = 'media?page=' + page;

        if (searchText) {
            url += '&query=' + searchText;
        }

        if (selectedFolder) {
            url += '&folder=' + selectedFolder;
        }

        if (BaseApi.clientId) {
            url += '&clientId=' + BaseApi.clientId;
        }

        return _api.get(url);
    };

    const getSearch = (searchText, selectedFolder) => {
        let queryParams = [];
        if (searchText) {
            queryParams.push('query=' + searchText);
        }

        if (selectedFolder) {
            queryParams.push('folder=' + selectedFolder);
        }

        if (BaseApi.clientId) {
            queryParams.push('clientId=' + BaseApi.clientId);
        }

        return _api.get('media?' + queryParams.join('&'));
    };

    const getMediaFile = id => {
        return _api.get('media/' + id);
    };

    const addMediaFile = (data: uploadFileParams) => {
        const size = data.size ? data.size : 0;
        const clientId = BaseApi.clientId ? BaseApi.clientId : null;
        return _api.post('media', {
            file_type: data.file_type,
            name: data.name,
            mime_type: data.mime_type,
            size: size,
            clientId
        });
    };

    const deleteMediaFile = (id) => {
        return _api.delete('media/' + id);
    };

    const copyToChannel = (MediaId, ChannelId) =>
        _api.post('media/' + MediaId + '/copyToChannel/' + ChannelId);

    const updateMediaFile = (id, data: updateMediaFileParams) => {
        return _api.patch('media/' + id, {
            name: data.name,
            status: data.status
        });
    };

    const getFileUrl = id => {
        return _api.get('media/' + id + '/url');
    };

    const getDownloadUrl = id => {
        return _api.get('media/' + id + '/download');
    };

    const uploadWeb = (emitter, file, url, mime_type, formInputs) => {
        const addConfig = {
            name: formInputs.key,
            file: file,
            xAmzHeadersAtInitiate: { 'x-amz-acl': 'private' },
            progress: function(p, stats) {
                const progress = parseFloat(p * 100).toFixed(1);
                emitter({ progress, stats });
            }
        };
        webUploader.add(addConfig).then(
            function(awsObjectKey) {
                emitter({ success: awsObjectKey });
                emitter(END);
            },
            function(reason) {
                emitter({ err: reason });
                emitter(END);
                //console.log('File did not upload sucessfully:', reason);
            }
        );
    };

    const uploadMobile = (emitter, file, url, mime_type, formInputs, formData) => {
        let data = new FormData();

        if (formInputs) {
            Object.keys(formInputs).forEach(function(key, index) {
                data.append(key, formInputs[key]);
            });
        }
        // mobile upload we build the file structure
        data.append('file', {
            uri: file,
            type: mime_type,
            name: 'randomname' // basename
        });

        const configMobile = {
            onUploadProgress: function(progressEvent) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                emitter({ progress });
            },
            baseUrl: '', // we put absolute url in the URL param
            headers: false,
            timeout: 7200000 //2 hours
        };
        if (typeof formData === 'undefined' || typeof formData.action === 'undefined') {
            setTimeout(() => {
                emitter({ err: 'invalid params' });
                emitter(END);
            }, 300);

            return () => {};
        }

        _api.post(formData.action, data, configMobile)
            .then(data => {
                emitter({ success: data });
                emitter(END);
            })
            .catch(error => {
                emitter({ err: error });
                emitter(END);
            });
    };

    /**
     *
     * Currently Web version supports multipart upload with larger files. Mobile is limited to 5GB.
     * TODO can be changed one RN implements URL class which breaks on this library
     * TODO to achieve that we need to transform file to File API
     *
     * @param file can be a string if mobile resources like file://var/... or input file object if provided from Web
     * @param url - where to push
     * @param mime_type
     * @param formInputs
     * @param formData
     * @returns {Channel<any>}
     */
    const upload = (file, url, mime_type, formInputs, formData) =>
        eventChannel(emitter => {
            if (Platform.isWeb()) {
                uploadWeb(emitter, file, url, mime_type, formInputs);
            } else {
                uploadMobile(emitter, file, url, mime_type, formInputs, formData);
            }

            //unsubscribe function
            return () => {};
        }, buffers.fixed(10));

    const createVideo = (videoId, startTime, endTime, name) => {
        return _api.post('media/' + videoId + '/video/create', {
            starttime: parseInt(startTime),
            endtime: parseInt(endTime),
            name: name
        });
    };

    const createVideoThumbnail = (videoId, data) => {
        return _api.patch('media/' + videoId + '/video', {
            time_ms: parseInt(data.time_ms)
        });
    };

    const createVideoCloser = (videoId, closerId, name) => {
        return _api.post('media/' + videoId + '/video/closer', {
            closer: closerId,
            name: name
        });
    };

    const getVideoThumbnail = id => {
        if (Platform.isWeb()) {
            return _api({
                url: 'media/' + id + '/video/thumbnail',
                method: 'GET',
                responseType: 'blob'
            });
        } else {
            return {
                url: BaseApi.baseUrl + 'media/' + id + '/video/thumbnail',
                method: 'GET',
                headers: {
                    Authorization: BaseApi.authToken
                }
            };
        }
    };

    const createImage = (imageId, data) => {
        return _api.post('media/' + imageId + '/image/create', data);
    };

    return {
        getMediaFiles,
        getMediaFile,
        addMediaFile,
        deleteMediaFile,
        upload,
        updateMediaFile,
        getFileUrl,
        getDownloadUrl,
        copyToChannel,
        getSearch,
        createVideo,
        createVideoThumbnail,
        createVideoCloser,
        getVideoThumbnail,
        createImage
    };
};

export default ApiMediaFiles();
