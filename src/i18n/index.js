import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import LastUsed from 'locize-lastused';

const isRenderer = (process && process.type === 'renderer');
const isDev = isRenderer ? window.require('electron-is-dev') : require('electron-is-dev');
const projectId = isRenderer ? window.require('electron').remote.process.env.LOCIZE_PROJECT_ID : process.env.LOCIZE_PROJECT_ID;
const apiKey = (isDev ? (isRenderer ? window.require('electron').remote.process.env.LOCIZE_API_KEY : process.env.LOCIZE_API_KEY) : '' );

const locizeOptions = {
    projectId,
    apiKey,
    referenceLng: 'en',
};

i18n
    .use(Backend)
    .use(LastUsed)
    .use(LanguageDetector)
    .use(initReactI18next)
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

export default i18n;