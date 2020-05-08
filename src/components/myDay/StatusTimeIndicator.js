import React from 'react';
import {concatStyleObjects} from '../../utils/css';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '50px'
    },
    badge: {
        position: 'absolute',
        width: '18px',
        height: '18px',
        borderRadius: '9px'
    },
    time: {
        position: 'absolute',
        left: '28px',
        top: '-5px',
        fontFamily: 'Nunito',
        fontSize: '18px',
        fontWeight: 800,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#514290'
    },
    statusTitle: {
        position: 'absolute',
        left: '28px',
        top: '15px',
        fontFamily: 'Nunito',
        fontSize: '14px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#322279'
    },
    statusSubtitle: {
        position: 'absolute',
        left: '28px',
        top: '31px',
        fontFamily: 'Nunito',
        fontSize: '12px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#514290'
    }
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
                result = 'from calendar';
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
    const hours = Math.floor(time/(1000*60*60));
    const minutes = Math.floor(time/(1000*60) - hours*60);
    const timeStr = hours > 0 ? `${hours}${minutes > 0 ? `h${minutes}` : ` ${hours > 1 ? 'hours' : 'hour'}`}` : `${minutes > 0 ? `${minutes} mins` : '0h'}`;
    return (
        <div style={styles.container}>
            <div style={concatStyleObjects(styles.badge, {backgroundColor: badgeColor(status)})} />
            <div style={styles.time}>{timeStr}</div>
            <div style={styles.statusTitle}>{statusTitle(status)}</div>
            <div style={styles.statusSubtitle}>{statusSubtitle(status)}</div>
        </div>
    )
};

export default StatusTimeIndicator;