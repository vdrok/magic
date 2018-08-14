
export default class Platform {

    static isWeb(){
        if(process.env.PLATFORM_ENV === 'web') return true;

        return false;
    }

    static isMobile(){
        return !Platform.isWeb()
    }

    static isProd(){
        if (Platform.isWeb() && process.env.NODE_ENV === 'production'){
            return true;
        }

        // MOBILE
        if(Platform.isMobile()  && (typeof __DEV__ === 'undefined' || __DEV__ === false)){
            return true;
        }

        return false;
    }
}