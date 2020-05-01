import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
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
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#3C465C',
        },
        '& label.MuiInputLabel-shrink': {
            transform: 'translate(0, 6px) scale(1)',
            transformOrigin: 'top left'
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
