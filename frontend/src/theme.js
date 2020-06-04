import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  props: {
    MuiGridList: {
      cols: null,
      cellHeight: 160
    }
  }
});

export default theme;
