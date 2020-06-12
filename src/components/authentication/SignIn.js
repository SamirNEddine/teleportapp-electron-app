import React, {useEffect} from "react";
import {useMutation} from "@apollo/react-hooks";
import {SIGN_IN_WITH_SLACK} from "../../graphql/queries";
import {updateLocalUser} from "../../helpers/localStorage";
import {useTranslation, Trans} from 'react-i18next';
import {getErrorMessageFromGraphqlErrorMessage} from '../../helpers/graphql';
import './authentication.css'
const {ipcRenderer} = window.require('electron');

const SignIn = function ({history}) {
    const { t, ready: translationsReady, i18n } = useTranslation('Authentication', { useSuspense: false });
    const [signInWithSlack, {error}] = useMutation(SIGN_IN_WITH_SLACK);

    const language = translationsReady ? i18n.language.split('-')[0] : 'en';
    const privacyURL = language !== 'en' ? `https://www.teleport.so/${i18n.language}/privacy` : 'https://www.teleport.so/privacy';
    const termsURL = language !== 'en' ? `https://www.teleport.so/${i18n.language}/terms` : 'https://www.teleport.so/terms';
    useEffect( () => {
        ipcRenderer.on('sign-in-with-slack-success', async (event, code) => {
            try {
                const result = await signInWithSlack({variables: {code}});
                const {accessToken, refreshToken} = result.data.signInWithSlack;
                await updateLocalUser(accessToken, refreshToken);
                ipcRenderer.send('signin-success');
            }catch(e){
                console.debug(error);
            }
        });
    }, []);

    if (!translationsReady){
        return <div className='auth-container' />;
    }else{
        return (
            <div className='auth-container'>
                <img src="https://storage.googleapis.com/teleport_public_assets/logo/teleport-logo-full-colour-rgb.svg" className="teleport-logo" alt="Logo"/>
                <div className='branding-title'>{t('SIGN_IN-BRANDING_MESSAGE')}</div>
                <a className="signin-slack" href="https://slack.com/oauth/authorize?scope=users:read,users:read.email,users:write,users.profile:read,users.profile:write,dnd:write,dnd:read&client_id=535111760275.901936269286&redirect_uri=teleport://slack/auth"><img
                    alt=" Sign in with Slack"
                    src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                    srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
                    target="_blank"/>
                </a>
                <div className="terms">
                    <Trans i18nKey="SIGN_IN-USER_TERMS_AND_PRIVACY_CONSENT" ns="Authentication">
                        By signing in, I agree to Teleport's <a href={termsURL}>Terms of Service</a> & <a href={privacyURL}>Privacy Policy</a>.
                    </Trans>
                </div>
                {error ? <p className='auth-error-message'>{error.message}</p> : ''}
            </div>
        );
    }

};

export default SignIn;