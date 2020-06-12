const i18n = require('i18next');
const Backend = require('i18next-locize-backend');
const LastUsed = require('locize-lastused');
const {app, remote} = require('electron');

const isDev = require('electron-is-dev');
const projectId = process.env.LOCIZE_PROJECT_ID;
const apiKey = (isDev ? process.env.LOCIZE_API_KEY : '' );

const locizeOptions = {
    projectId,
    apiKey,
    referenceLng: 'en',
};

const LanguageDetector =  {
    type: 'languageDetector',
    async: false,
    init: Function.prototype,
    detect: () => (app || remote.app).getLocale(),
    cacheUserLanguage: Function.prototype
};

i18n
    .use(Backend)
    .use(LastUsed)
    .use(LanguageDetector)
    .init({
        fallbackLng: 'en',
        debug: true,
        saveMissing: true,
        interpolation: {
            escapeValue: false,
        },
        backend: locizeOptions,
        locizeLastUsed: locizeOptions,
    });

module.exports = i18n;