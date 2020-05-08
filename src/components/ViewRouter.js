import React from "react";
import { HashRouter, Switch, Route } from 'react-router-dom';
import SignIn from './authentication/SignIn'
import MyDaySetup from "./myDay/MyDaySetup";
import Onboarding from "./onboarding/Onboarding";
import CalendarIntegration from "./onboarding/CalendarIntegration";
import CurrentStatus from "./status/CurrentStatus";

const ViewRouter = function () {
    return (
        <HashRouter>
                <Switch>
                    <Route exact path="/sign-in" component={SignIn}/>
                    <Route exact path="/my-day-setup" component={MyDaySetup}/>
                    <Route exact path="/onboarding" component={Onboarding}/>
                    <Route exact path="/missing-calendar-integration" component={CalendarIntegration}/>
                    <Route exact path="/current-status" component={CurrentStatus}/>
                </Switch>
        </HashRouter>
    );
};

export default ViewRouter;