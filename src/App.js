import React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {graphQLClient} from "./helpers/graphql";
import ViewRouter  from './components/ViewRouter';
import {addCorsHandler} from './utils/cors';

addCorsHandler();

function App() {
    return (
      <ApolloProvider client={graphQLClient}>
        <ViewRouter />
      </ApolloProvider>
  );
}

export default App;
