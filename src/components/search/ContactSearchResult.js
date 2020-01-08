import React from 'react';


const ContactSearchResult = function ({contact}) {

    return (
        <div className="contact-container">
            <div className="contact-avatar">
                <img src="https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/3ae383bdcc8889a88908f3f03037b753" alt="contact-avatar"/>
            </div>
            <div className="contact-info">
                <h3>{`${contact.firstName} ${contact.lastName}`}</h3>
                <p>{contact.jobTitle}</p>
            </div>
        </div>
    )
};

export default ContactSearchResult;