import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';

const isRenderer = (process && process.type === 'renderer');
const projectId = isRenderer ? window.require('electron').remote.process.env.LOCIZE_PROJECT_ID : process.env.LOCIZE_PROJECT_ID;
const apiKey = isRenderer ? window.require('electron').remote.process.env.LOCIZE_API_KEY : process.env.LOCIZE_API_KEY;

const locizeOptions = {
    projectId,
    apiKey,
    referenceLng: 'en',
};

i18n
    .use(Backend)
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
    });

export default i18n;