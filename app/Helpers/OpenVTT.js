import { WebVTTParser } from "../Lib/parser";

export default class OpenVTT{

    /**
     * 'https://pum4i3zoaplxth.data.mediastore.eu-west-1.amazonaws.com/thumbnailTest/thumbnails.vtt'
     * @param baseURL
     * @param vttFile
     * @param isLive
     */
    constructor(){
        this.baseUrl = null;
        this.data = [];
    }

    /**
     *
     * @param url
     */
    load(url){

        this.baseUrl = url.substring(0, url.lastIndexOf("/") + 1);


        new Promise((resolve, reject) => {
            const req = new XMLHttpRequest()
            req.open('GET', url)
            req.onload = function () {
                resolve(req.response);
            };
            req.onerror = function () {
                reject(req.response);
            };
            req.send()
        }).then((data)=> {
            const parser = new WebVTTParser();
            const tree = parser.parse(data, 'metadata');
            this.data = tree.cues;
            this.preloadImages();
        })
    }

    /**
     * preload all the thumbnail to improve usability
     */
    preloadImages(){
        const that = this;
        setTimeout(function() {
            for(let i = 0; i < that.data.length; i++){
                new Image().src = that.baseUrl + that.data[i].text;
            }
        }, 1000);

    }

    /**
     * Returns thumbnail image URL or false
     * @param time in seconds
     */
    getImage(time){
        const image =  this.data.filter(e => e.endTime > time && e.startTime <= time );
        if(image[0]){
            return this.baseUrl + image[0].text;
        }

        return false;
    }


}