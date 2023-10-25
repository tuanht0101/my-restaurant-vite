import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Theme, useTheme } from '@mui/system';
import { createTheme } from '@mui/material';

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';

// Assuming your theme looks something like this:
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976D2',
        },
        secondary: {
            main: '#dc004e',
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#FFC107',
        },
        info: {
            main: '#2196F3',
        },
        success: {
            main: '#4CAF50', // Ensure this color is defined in your theme
        },
    },
});
interface SeverityPillProps {
    children?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'success';
}

const SeverityPillRoot: FC<SeverityPillProps> = (props) => {
    const { color = 'primary', children } = props;
    const theme = useTheme();

    // Check if the theme exists
    if (!theme) {
        console.error('Theme not found');
        return null;
    }

    // Check if the color exists in the theme palette
    const colorPalette = theme.palette[color];
    if (!colorPalette) {
        console.error(`Color ${color} not found in theme palette`);
        return null;
    }

    const backgroundColor = colorPalette.alpha12;
    const textColor =
        theme.palette.mode === 'dark' ? colorPalette.main : colorPalette.dark;

    const styles: React.CSSProperties = {
        alignItems: 'center',
        backgroundColor,
        borderRadius: 12,
        color: textColor,
        cursor: 'default',
        display: 'inline-flex',
        flexGrow: 0,
        flexShrink: 0,
        lineHeight: 2,
        fontWeight: 600,
        justifyContent: 'center',
        letterSpacing: 0.5,
        minWidth: 20,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        textTransform: 'uppercase' as TextTransform, // Explicitly set the type
        whiteSpace: 'nowrap',
    };

    return <span style={styles}>{children}</span>;
};

export const SeverityPill: FC<SeverityPillProps> = (props) => {
    return <SeverityPillRoot {...props} />;
};

SeverityPill.propTypes = {
    children: PropTypes.node,
    color: PropTypes.oneOf([
        'primary',
        'secondary',
        'error',
        'info',
        'warning',
        'success',
    ]),
};
