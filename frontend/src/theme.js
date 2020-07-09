import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    h1: {
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: '400',
      lineHeight: '1.334',
      letterSpacing: 0,
      marginBottom: '1.25rem'
    },
    h2: {
      fontSize: '1.35rem',
      fontWeight: '400'
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: '400'
    }
  },
  props: {
    MuiCheckbox: {
      color: 'primary'
    },
    MuiGridList: {
      cols: null,
      cellHeight: 160
    },
    MuiFormControl: {
      variant: 'outlined',
      fullWidth: true
    },
    MuiSelect: {
      variant: 'outlined'
    },
    MuiTextField: {
      variant: 'outlined',
      fullWidth: true
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiAppBar: {
      root: {
        marginBottom: '2.5rem'
      }
    },
    MuiFormControl: {
      root: {
        marginBottom: '1.25rem'
      }
    }
  }
});

export default theme;
