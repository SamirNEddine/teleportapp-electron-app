import React, {useEffect, useState} from 'react';
import { useApolloClient } from "@apollo/react-hooks";
import { SEARCH_USERS } from "../../graphql/queries";
import ContactSearchResult from './ContactSearchResult'

import './search.css'

const remote = window.require('electron').remote;
const minSize = remote.getCurrentWindow().getBounds(); minSize.height = 55 ;

const SearchContacts = function () {
    const apolloClient = useApolloClient();
    const [searchResults, setSearchResults] = useState(null);
    useEffect( () => {
        if(searchResults && searchResults.length){
            remote.getCurrentWindow().setSize(minSize.width, minSize.height + (74*searchResults.length));
        }else{
            remote.getCurrentWindow().setSize(minSize.width, minSize.height, false);
        }
    }, [searchResults]);

    const [input, setInput] = useState('');
    useEffect( () => {

        const fetchContacts = async function(queryString) {
            const {error, data} = await apolloClient.query({query: SEARCH_USERS, variables:{queryString}, fetchPolicy: 'no-cache'});
            if(!error){
                setSearchResults(data.searchUsers.map( c => {
                    return (
                        <div className="search-result-container"> <ContactSearchResult  contact={c} /></div>
                    )
                }));
            }else{
                //To do: Error handling
            }
        };

        if(input.length){
            fetchContacts(input)
        }else{
            setSearchResults(null);
        }
    }, [input]);

    const onInputChange = function (e) {
        setInput(e.currentTarget.value);
    };

    return (
        <div className="search-container">
            <input autoFocus className='search-field' type="text" onChange={onInputChange} value={input}/>
            {searchResults ? <div className="search-results-container"> {searchResults} </div> : ''}
        </div>
    )
};

export default SearchContacts;