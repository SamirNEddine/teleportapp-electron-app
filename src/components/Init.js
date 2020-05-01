import React, {useEffect} from "react";
import {GET_USER_STATE} from '../graphql/queries';
import {useQuery} from "@apollo/react-hooks";
import {updateIsOnBoarded} from '../helpers/localStorage';
const {ipcRenderer} = window.require('electron');

const Init = function () {
    const {loading, error, data} = useQuery(GET_USER_STATE);

    useEffect( () => {
        if (!error && data && data.user) {
            updateIsOnBoarded(data.user.onBoarded);
            ipcRenderer.send('app-init', {onBoarded: data.user.onBoarded});
        }
    }, [error, data]);
    return (
        <div/>
    )
};

export default Init;