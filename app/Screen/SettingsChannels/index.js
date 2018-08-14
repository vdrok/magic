if (process.env.PLATFORM_ENV === 'web') {
    module.exports = require('./SettingsChannelsScreen.web');
} else {
    module.exports = require('./SettingsChannelsScreen.mob');
}