import { withStyles, FormControlLabel } from '@material-ui/core';

export const StyledCheckboxLabel = withStyles({
  root: {
    width: '100%',
    margin: '-0.75rem 0 0 -0.75rem'
  },
  label: {
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 500
  }
})(FormControlLabel);
