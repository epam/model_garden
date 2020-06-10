import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    h1: {
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: '400',
      lineHeight: '1.334',
      letterSpacing: 0
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
    MuiGridList: {
      cols: null,
      cellHeight: 160
    },
    MuiFormControl: {
      variant: 'outlined'
    },
    MuiSelect: {
      variant: 'outlined'
    },
    MuiTextField: {
      variant: 'outlined'
    }
  }
});

export default theme;
