/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import { subject } from '@casl/ability';
import UserPresenter from 'presenters/UserPresenter';
import TaskPresenter from 'presenters/TaskPresenter';

import Form from './components/Form';

import useStyles from './useStyles';

const EditPopup = ({ cardId, onClose, onCardDestroy, onLoadCard, onCardUpdate, ability }) => {
  const [task, setTask] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const styles = useStyles();

  useEffect(() => {
    onLoadCard(cardId).then(setTask);
  }, []);

  const handleCardUpdate = () => {
    setSaving(true);

    onCardUpdate(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});

      if (error instanceof Error) {
        alert(`Update Failed! Error: ${error.message}`);
      }
    });
  };

  const handleCardDestroy = () => {
    setSaving(true);

    onCardDestroy(task).catch((error) => {
      setSaving(false);

      alert(`Destrucion Failed! Error: ${error.message}`);
    });
  };
  const isLoading = isNil(task);

  const canDelete = () => {
    if (isNil(task)) return false;

    if (isNil(TaskPresenter.author(task))) {
      return ability.can('delete', 'Task');
    }
    return ability.can('delete', subject('Task', { authorId: UserPresenter.id(TaskPresenter.author(task)) }));
  };

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title={
            isLoading
              ? 'Your task is loading. Please be patient.'
              : `Task # ${TaskPresenter.id(task)} [${TaskPresenter.name(task)}]`
          }
        />
        <CardContent>
          {isLoading ? (
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          ) : (
            <Form errors={errors} onChange={setTask} task={task} ability={ability} />
          )}
        </CardContent>
        <CardActions className={styles.actions}>
          <Button disabled={isLoading || isSaving} onClick={handleCardUpdate} size="small" variant="contained" color="primary">
            Update
          </Button>
          {canDelete() && (
            <Button
              disabled={isLoading || isSaving}
              onClick={handleCardDestroy}
              size="small"
              variant="contained"
              color="secondary"
            >
              Destroy
            </Button>
          )}
        </CardActions>
      </Card>
    </Modal>
  );
};

EditPopup.propTypes = {
  // cardId, onClose, onCardDestroy, onLoadCard, onCardUpdate
  cardId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardDestroy: PropTypes.func.isRequired,
  onLoadCard: PropTypes.func.isRequired,
  onCardUpdate: PropTypes.func.isRequired,
  ability: PropTypes.shape().isRequired,
};

export default EditPopup;
