import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import useStyles from './useStyles';

const AddButton = () => {
  const styles = useStyles();

  return (
    <Fab className={styles.addButton} color="primary" aria-label="add">
      <AddIcon />
    </Fab>
  );
};

export default AddButton;
