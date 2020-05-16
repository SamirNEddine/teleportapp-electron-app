import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
            },
            '&.MuiInput-underline.Mui-error:after':{
                borderBottomColor: 'red',
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

export const TeleportPrimarySwitch = withStyles({
    switchBase: {
        color: '#7E83A3',
        '&$checked': {
            color: '#514290',
        },
        '&$checked + $track': {
            backgroundColor: '#514290',
            opacity: 0.38
        },
    },
    checked: {},
    track: {
        backgroundColor: '#7E83A3',
        opacity: 0.38
    },
})(Switch);

export const TeleportFormControl = withStyles({
    root: {
        color: '#030163',
        '& .MuiTypography-body1': {
            fontFamily: 'Nunito',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '22px',
        }
    }
})(FormControlLabel);