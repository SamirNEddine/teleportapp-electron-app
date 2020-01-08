import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { graphQLClient } from "./helpers/graphql";
import WindowManager  from './components/WindowManager'

function App() {
  return (
      <ApolloProvider client={graphQLClient}>
        <WindowManager />
      </ApolloProvider>
  );
}

export default App;
