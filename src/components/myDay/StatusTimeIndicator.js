import React from 'react';


const styles = {
    container: {
        backgroundColor: 'white',
    },
    badge: {
        position: 'absolute',
        width: '18px',
        height: '18px',
        borderRadius: '9px'
    },
    time: {
        position: 'relative',
        left: '26px',
        fontFamily: 'Silka',
        fontSize: '17px',
        fontWeight: 'bold',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal'
    },
    statusTitle: {
        position: 'relative',
        left: '26px',
        fontFamily: 'Silka',
        fontSize: '13px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal'
    },
    statusSubtitle: {
        position: 'relative',
        left: '26px',
        fontFamily: 'Silka',
        fontSize: '9px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal'
    }
};

const m = function (...args) {
    return Object.assign({}, ...args);
};
const StatusTimeIndicator = function ({status, time}) {

    const statusTitle = function (status) {
        let result = null;
        switch (status) {
            case 'busy':
            {
                result = 'busy';
                break;
            }
            case 'focus':
            {
                result = 'focus';
                break;
            }
            case 'available':
            {
                result = 'available';
                break;
            }
        }
        return result;
    };

    const statusSubtitle = function (status) {
        let result = null;
        switch (status) {
            case 'busy':
            {
                result = 'from your calendar';
                break;
            }
            case 'focus':
            {
                result = 'on your work';
                break;
            }
            case 'available':
            {
                result = 'for your team';
                break;
            }
        }
        return result;
    };
    const badgeColor = function (status) {
        let result = null;
        switch (status) {
            case 'busy':
            {
                result = 'var(--dusk)';
                break;
            }
            case 'focus':
            {
                result = 'var(--vivid-purple)';
                break;
            }
            case 'available':
            {
                result = 'var(--pink-purple)';
                break;
            }
        }
        return result;
    };

    return (
        <div style={styles.container}>
            <div style={m(styles.badge, {backgroundColor: badgeColor(status)})} />
            <div style={styles.time}>{(time/1000/60/60).toFixed(1)} hours</div>
            <div style={styles.statusTitle}>{statusTitle(status)}</div>
            <div style={styles.statusSubtitle}>{statusSubtitle(status)}</div>
        </div>
    )
};

export default StatusTimeIndicator;