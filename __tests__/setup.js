//import 'jest-enzyme';
import Fixtures from '../app/Fixtures';

jest.mock('Linking', () => {
    return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        openURL: jest.fn(),
        canOpenURL: jest.fn(),
        getInitialURL: jest.fn()
    };
});

jest.mock('WebView', () => 'WebView');

jest.mock('Keyboard', () => {
    return {
        addListener: jest.fn(),
        removeListener: jest.fn()
    };
});

jest.mock('react-native-fs', () => {
    return {
        mkdir: jest.fn(),
        moveFile: jest.fn(),
        copyFile: jest.fn(),
        pathForBundle: jest.fn(),
        pathForGroup: jest.fn(),
        getFSInfo: jest.fn(),
        getAllExternalFilesDirs: jest.fn(),
        unlink: jest.fn(),
        exists: jest.fn(),
        stopDownload: jest.fn(),
        resumeDownload: jest.fn(),
        isResumable: jest.fn(),
        stopUpload: jest.fn(),
        completeHandlerIOS: jest.fn(),
        readDir: jest.fn(),
        readDirAssets: jest.fn(),
        existsAssets: jest.fn(),
        readdir: jest.fn(),
        setReadable: jest.fn(),
        stat: jest.fn(),
        readFile: jest.fn(),
        read: jest.fn(),
        readFileAssets: jest.fn(),
        hash: jest.fn(),
        copyFileAssets: jest.fn(),
        copyFileAssetsIOS: jest.fn(),
        copyAssetsVideoIOS: jest.fn(),
        writeFile: jest.fn(),
        appendFile: jest.fn(),
        write: jest.fn(),
        downloadFile: jest.fn(),
        uploadFiles: jest.fn(),
        touch: jest.fn(),
        MainBundlePath: jest.fn(),
        CachesDirectoryPath: jest.fn(),
        DocumentDirectoryPath: jest.fn(),
        ExternalDirectoryPath: jest.fn(),
        ExternalStorageDirectoryPath: jest.fn(),
        TemporaryDirectoryPath: jest.fn(),
        LibraryDirectoryPath: jest.fn(),
        PicturesDirectoryPath: jest.fn()
    };
});
jest.mock('react-native-fetch-blob', () => {
    return {
        DocumentDir: () => {},
        polyfill: () => {}
    };
});
jest.mock('react-native-google-signin', () => {});
jest.mock('react-native-device-info', () => {
    return {
        getDeviceLocale: jest.fn()
    };
});

jest.mock('DatePickerIOS', () => 'DatePickerIOS');
jest.mock(
    'bugsnag-react-native',
    () => ({
        Configuration: () => ({
            registerBeforeSendCallback: () => {}
        }),
        Client: () => ({})
    }),
    { virtual: true }
);

jest.mock('bugsnag-js', () => {
    return jest.fn().mockImplementation(() => {
        return { use: () => {} };
    });
});

jest.mock('gl-react-native', () => {
    return jest.fn().mockImplementation(() => {
        return { use: () => {} };
    });
});

jest.mock('video.js', () => ({
    getComponent: jest.fn(),
    extend: jest.fn(),
    plugin: jest.fn()
}));
jest.mock('videojs-abloop', () => {});
jest.mock('videojs-contrib-hls', () => {});
jest.mock('videojs-framebyframe', () => {});

jest.mock('react-native-onesignal', () => {
    return {
        init: jest.fn()
    }
});

global.videojs = () => ({
    on: jest.fn()
});

window.setTimeout = (fn, time) => fn();
window.navigator = {};

Fixtures.enableFixtures(0);
