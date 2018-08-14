import moment from "moment/moment";

export const logo = require('../Images/Logo/levuroSquareLogo.png');
export const campaign_placeholder = require('../Images/Campaign/template_placeholder.png');
export const play_icon = require('../Images/Icon/play.png');

export const logo_socials = {
    "facebook": require('../Images/ChannelIcons/facebook.png'),
    "facebook-page": require('../Images/ChannelIcons/facebook.png'),
    "facebook-account": require('../Images/ChannelIcons/facebook.png'),
    linkedin: require('../Images/ChannelIcons/in.png'),
    instagram: require('../Images/ChannelIcons/insta.png'),
    "instagram-business": require('../Images/ChannelIcons/insta.png'),
    twitter: require('../Images/ChannelIcons/twitter.png'),
    ott: require('../Images/MediaFolderIcons/levuro-ott.png'),
    youtube: require('../Images/ChannelIcons/youtube_social_icon_red.png')
};

export const arrow_icon = {
    open: require('../Images/Icon/open.png'),
    close: require('../Images/Icon/close.png')
};

export const folder_icons = {
    folder: require('../Images/MediaFolderIcons/folder.png'),
    drive: require('../Images/MediaFolderIcons/drive.png'),
    dropbox: require('../Images/MediaFolderIcons/dropbox.png'),
    levuro_ott: require('../Images/MediaFolderIcons/levuro-ott.png'),
    ooyala: require('../Images/MediaFolderIcons/ooyala.png'),
    youtube: require('../Images/MediaFolderIcons/youtube.png'),
    zattoo: require('../Images/MediaFolderIcons/zattoo.png'),
    ott: require('../Images/MediaFolderIcons/levuro-ott.png'),
    instagram: require('../Images/ChannelIcons/insta.png'),
    youtube: require('../Images/ChannelIcons/youtube_social_icon_red.png'),
    live: require('../Images/MediaFolderIcons/live.png'),
    facebook: require('../Images/MediaFolderIcons/facebook.png'),
    twitter: require('../Images/MediaFolderIcons/twitter.png'),
};

export const social_options_icons = {
    emotion: require('../Images/Icon/emotion.png'),
    location: require('../Images/Icon/location.png'),
    photo: require('../Images/Icon/photo-green.png'),
    tag: require('../Images/Icon/tag.png')
};

export const post_status = {
    "1": "draft",
    "2": "approved",
    "4": "live"
}

export const POST_STATUSES  = {
    ERROR: -1,
    DRAFT: 1,
    APPROVED: 2,
    PUBLISHED: 3,
    LIVE: 4,
}

export const CHANNEL_TYPES  = {
    FACEBOOK_PAGE: 'facebook-page',
    FACEBOOK_ACCOUNT: 'facebook-account',
    INSTAGRAM: 'instagram',
    INSTAGRAM_BUSINESS: 'instagram-business',
    TWITTER: 'twitter',
    OTT: 'ott'
}


export const MEDIA_CHANNEL_TYPES  = {
    OOYALA: 'ooyala'
}

export const OOYALA_STATUES  = {
    PAUSED: -1,
    INITIALIZED: 0,
    CREATED : 1,
    UPLOADING: 2,
    PROCESSING: 3,
    READY: 4,
}

export const USER_ROLES = {
    ROLE_ADMIN: {
        name: 'Admin',
        description: 'Team Management'
    },
    ROLE_APPROVAL: {
        name: 'Approval',
        description: 'Approval drafted content'
    },
    ROLE_ANALYTICS: {
        name: 'Analytics',
        description: 'See channels and campaign analytics'
    },
    ROLE_EDITOR: {
        name: 'Editor',
        description: 'Can upload media and draft new stories'
    }
}

export const TWITTER = {
    VIDEO_MAX_LENGTH_MS: 140 * 1000 // in milliseconds
}

export function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function humanFileSize(bytes) {
    const thresh = 1024;
    if(bytes < thresh) return bytes + ' B';
    const units =  ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
}

export function msToLength(ms){
    return secondsToLength(parseInt(ms / 1000));
}

export function msToHuman(ms){
    const format = ms >= 3600000 ? "HH:mm:ss.SSS" : "mm:ss.SSS";
    return moment("1900-01-01 00:00:00").add(ms, 'ms').format(format);
}

/** DecySeconds to Human) */
export function dsToHuman(ds){
    const format = ds >= 36000 ? "HH:mm:ss.S" : "mm:ss.S";
    return moment("1900-01-01 00:00:00").add(ds * 100, 'ms').format(format);
}

export function secondsToLength(seconds){
    const format = seconds >= 3600 ? "HH:mm:ss" : "mm:ss";
    return moment("1900-01-01 00:00:00").add(seconds, 'seconds').format(format);
}

export function extractQueryParameters(locationUrl) {
    if (locationUrl[0] === '?')
        locationUrl = locationUrl.slice(1);

    let result = {};

    let paramArray = locationUrl.split('&');

    if (paramArray.length === 0)
        return false;

    paramArray.map(parameter => {
        let singleParam = parameter.split('=');
        result[singleParam[0]] = singleParam[1];
    });

    return result;
}

export function getFilenameFromPath(path){
    return path.split('/')[path.split('/').length - 1];

}

/**
 * used to validate media files selected per channel.
 * rules properties:
 *  - min
 *  - max
 *
 * @param data
 * @param rules
 */
export function validatePostMedia(data, rules) {
    const success = {
        _valid: true,
        _message: 'Success'
    };

    if(rules.maxVideos && data.filter(d => d.type === 'video').length > rules.maxVideos){
        return {
            _valid: false,
            _message: `You can publish maximum ${rules.maxVideos} video`
        };
    }

    if(rules.videos && data.filter(d => d.type === 'video').length !== rules.videos){
        return {
            _valid: false,
            _message: `Choose ${rules.videos} video`
        };
    }

    if(rules.noMixedImageWithVideos
        && data.filter(d => d.type === 'video').length > 0
        &&  data.filter(d => d.type === 'image').length > 0 ){
        return {
            _valid: false,
            _message: `This platform doesn't allow to publish videos and images with one post`
        };
    }



    if (!rules.min && !rules.max) {
        return success;
    }

    if (!data || !Array.isArray(data)) {
        return {
            _valid: false,
            _message: `At least ${rules.min} media files required.`
        };
    }

    if (rules.min && data.length < rules.min) {
        return {
            _valid: false,
            _message: `At least ${rules.min} media files required.`
        }
    }

    if (rules.max && data.length > rules.max) {
        return {
            _valid: false,
            _message: `Maximum number of media files allowed is ${rules.max}.`
        }
    }

    return success;
}

export function serializeParams(obj) {
    let str = [];
    for (let p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
}

/**
 *  Truncates the text to 'length' and adds 'add' to the end(default add = '...').
 *  Ex: truncateText('long text', 4, '...') returns 'long...'
 *
 * @param text
 * @param length
 * @param add
 */
export function truncateText(text, length, add = "...") {
    if (!text) {
        return ''
    }

    return text.length > length ? text.substr(0, length) + add : text
}

/**
 * Adds separator after 3 digits of number
 *
 * @param nr
 * @param separator
 * @returns {string}
 */
export function numberFormatWithSeparator(nr, separator = "'") {
    if(typeof nr === 'undefined' || nr  === null || isNaN(nr)) {
        return 'n/a'
    }

    return nr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function getThumbnailUrl(media){
    const { thumbnail, updated_at } = media;
    return thumbnail + "?" + updated_at;
}

/**
 * This function coverts file url to vtt url
 * http://www.example.com/test/index.m3u8 to http://www.example.com/test/thumbnails.vtt
 * @param fileURL
 */
export function getVttUrl(fileURL:string){
    return fileURL.substring(0, fileURL.lastIndexOf("/") + 1) + 'thumbnails.vtt';
}

/**
 * Returns the user browser language
 * 
 * @returns {string}
 */
export function getUserLanguage() {
    return window.navigator.userLanguage || window.navigator.language;
}