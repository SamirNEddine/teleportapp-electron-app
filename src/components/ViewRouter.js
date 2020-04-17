import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './authentication/SignIn'
import MyDaySetup from "./myDay/MyDaySetup";
import CalendarIntegration from "./onboarding/CalendarIntegration";

const ViewRouter = function () {
    return (
        <BrowserRouter>
                <Switch>
                    <Route exact path="/sign-in" component={SignIn}/>
                    <Route exact path="/my-day-setup" component={MyDaySetup}/>
                    <Route exact path="/calendar-integration" component={CalendarIntegration}/>
                </Switch>
        </BrowserRouter>
    );
};

export default ViewRouter;