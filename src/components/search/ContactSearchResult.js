import React from 'react';

const ContactSearchResult = function ({contact}) {

    return (
        <div className="contact-container">
            <div className="contact-avatar">
                <img src={contact.profilePicture} alt="contact-avatar"/>
            </div>
            <div className="contact-info">
                <h3>{`${contact.firstName} ${contact.lastName}`}</h3>
                <p>{contact.jobTitle}</p>
            </div>
        </div>
    )
};

export default ContactSearchResult;