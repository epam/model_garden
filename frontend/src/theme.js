import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    h1: {
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: '400'
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
    }
  }
});

export default theme;
