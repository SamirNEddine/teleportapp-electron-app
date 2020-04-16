import React from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_SUGGESTED_AVAILABILITY_FOR_TODAY} from '../../graphql/queries';
import './myDay.css'

const MyDaySetup = function () {

    const {data} = useQuery(GET_SUGGESTED_AVAILABILITY_FOR_TODAY);
    if(data && data) console.log(data);
    return (
        <div className='my-day-setup-container'>
            <h1>My Day Setup Screen!!!</h1>
        </div>
    );
};

export default MyDaySetup;