import { createTheme } from '@mui/material/styles'
import { green } from '@mui/material/colors'

export const theme = createTheme({
    typography: {
        // Complete all the variants adding the color as #000000
        h1: {
            color: '#000000',
        },
        h2: {
            color: '#000000',
            fontSize: 18,
            fontWeight: 700,
        },
        h3: {
            color: '#000000',
            fontSize: 16,
            fontWeight: 500,
        },
        h4: {
            color: '#000000',
        },
        h5: {
            color: '#000000',
        },
        h6: {
            color: '#000000',
            fontSize: 14,
            fontWeight: 600,
        },
        subtitle1: {
            color: '#424242',
            fontSize: 14,
            fontWeight: 400,
        },
        subtitle2: {
            color: '#424242',
            fontSize: 12,
            fontWeight: 300,
        },
        body1: {
            color: '#000000',
        },
        body2: {
            color: '#000000',
        },
        button: {
            textTransform: 'none',
            size: 14,
            fontWeight: 700,
        },
        fontFamily: "'DM Sans', sans-serif;",
    },
    palette: {
        primary: {
            main: '#2967F6',
        },
        secondary: {
            main: green[500],
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgb(243, 242, 239)',
                    borderWidth: 0,
                    borderRadius: 8,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                notchedOutline: {
                    borderWidth: 0,
                },
                root: {
                    border: 'none',

                    '&$multiline': {
                        border: 'none',
                        padding: 70,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderWidth: 0,
                },
                root: {
                    fontSize: 14,
                    fontWeight: 400,

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000',
                    },
                },
            },
        },
    },
})
