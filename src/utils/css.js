import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import {withStyles} from '@material-ui/core/styles';

export const concatStyleObjects = function (...args) {
    return Object.assign({}, ...args);
};

export const TeleportInputLabel= withStyles({
    root: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontSize: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#3C465C',
    }
})(InputLabel);

export const TeleportTextField = withStyles({
    root: {
        '& label.MuiFormLabel-root': {
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#3C465C',
        },
        '& .MuiInput-underline': {
            '&:before': {
                borderBottomColor: '#DBDBF1',
            },
            '&:after': {
                borderBottomColor: '#514290',
            },
            '&:hover:before': {
                borderBottomColor: '#8985bd',
            }
        },
        '& .MuiInput-root': {
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontSize: '16px',
            color: '#030163',
        }
    }
})(TextField);

export const TeleportSelect = withStyles({
    root: {

        '& .MuiInput-underline': {
            '&:before': {
                borderBottomColor: '#DBDBF1',
            },
            '&:after': {
                borderBottomColor: '#514290',
            },
            '&:hover:before': {
                borderBottomColor: '#8985bd',
            }
        },
        '& .MuiInput-root': {
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontSize: '16px',
            color: '#030163',
        }
    }
})(Select);
