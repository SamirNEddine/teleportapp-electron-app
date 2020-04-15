import React from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from './authentication/SignIn'
import SearchContacts from './search/SearchContacts'

const ViewRouter = function () {
    return (
        <BrowserRouter>
                <Switch>
                    <Route exact path="/sign-in" component={SignIn}/>
                    <Route exact path="/search-contacts" component={SearchContacts}/>
                </Switch>
        </BrowserRouter>
    );
};

export default ViewRouter;