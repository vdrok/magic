export default class MediaFile {

    static isReady(type, status){
        return type === 'video' ? this.isVideoReady(status) : this.isImageReady(status);
    }

    static isImageReady(status){
        if(status <= 1){
            return false;
        }
        return true;
    }

    static isVideoReady(status){
        if(status === 3 ){
            return true;
        }
        return false;
    }
}