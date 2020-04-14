import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../../graphql/queries";
import { updateLocalUser } from "../../helpers/localStorage";
import { getErrorMessageFromGraphqlErrorMessage } from '../../helpers/graphql';

import './authentication.css'

const { ipcRenderer } = window.require('electron');

const SignIn = function ({history}) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [signIn, {error}] = useMutation(LOGIN_USER);

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            const result = await signIn({variables: {email, password}});
            await updateLocalUser(result.data.loginUser);
            ipcRenderer.send('signin-success');

        }catch(e){
            console.log('ERROR' + e);
        }
    };
    return (
        <div className='auth-container'>
            <div className="signin-container">
                <img src="https://storage.googleapis.com/teleport_public_assets/logo/teleport-logo-full-colour-rgb.svg" className="teleport-logo" alt="Logo"/>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <input autoFocus type="email" onChange={(e) => setEmail(e.target.value)} placeholder="email"  autoComplete="username"/>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="password"  autoComplete="current-password"/>
                    <button>login</button>
                    {error ? (
                        <h5 className="auth-error-message">{getErrorMessageFromGraphqlErrorMessage(error.message)}</h5>
                    ) : ('')
                    }
                    <a className="signin-slack" href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=535111760275.901936269286"><img
                        alt="Sign in with Slack" height="40" width="172"
                        src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                        srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
                        target="_blank"/></a>
                </form>
            </div>
        </div>
    );
};

export default SignIn;