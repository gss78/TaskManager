import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

import useStyles from './useStyles';

const AddButton = ({ onClick }) => {
  const styles = useStyles();

  return (
    <Fab className={styles.addButton} onClick={onClick} color="primary" aria-label="add">
      <AddIcon />
    </Fab>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddButton;
