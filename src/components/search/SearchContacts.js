import React, {useEffect, useState} from 'react';
import ContactSearchResult from './ContactSearchResult'

import './search.css'

const remote = window.require('electron').remote;
const minSize = remote.getCurrentWindow().getBounds(); minSize.height = 55 ;
const contacts = [
    {firstName: "Dareen", lastName: "Youssef", jobTitle: "Senior Director", profilePictureUrl: ""},
    {firstName: "Samir", lastName: "Youssef", jobTitle: "Senior Director", profilePictureUrl: ""},
    {firstName: "Dareen", lastName: "Youssef", jobTitle: "Senior Director", profilePictureUrl: ""},
    {firstName: "Dareen", lastName: "Youssef", jobTitle: "Senior Director", profilePictureUrl: ""},
    ];

const SearchContacts = function () {

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
        if(input.length){
            setSearchResults(contacts.map( c => {
                return (
                    <div className="search-result-container"> <ContactSearchResult  contact={c} /></div>
                )
            }));
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