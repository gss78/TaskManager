import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { isNil } from 'ramda';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const Task = ({ task, onClick }) => {
  const styles = useStyles();
  const [expired, setExpired] = useState(false);

  const isExpired = () => {
    if (
      !isNil(TaskPresenter.expiredAt(task)) &&
      TaskPresenter.state(task) !== 'archived' &&
      new Date(TaskPresenter.expiredAt(task)) < new Date().setHours(0, 0, 0, 0)
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isExpired()) {
        setExpired(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => setExpired(isExpired()));

  const handleClick = () => onClick(task);
  const action = (
    <IconButton onClick={handleClick}>
      <EditIcon />
    </IconButton>
  );

  return (
    <Card className={styles.root + (expired ? ` ${styles.expired}` : '')}>
      <CardHeader action={action} title={TaskPresenter.name(task)} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {TaskPresenter.description(task)}
        </Typography>
      </CardContent>
    </Card>
  );
};

Task.propTypes = {
  task: TaskPresenter.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Task;
