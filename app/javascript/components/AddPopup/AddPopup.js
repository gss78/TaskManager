import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from '@material-ui/pickers';

import TaskForm from 'forms/TaskForm';
import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const AddPopup = ({ onClose, onCreateCard, ability }) => {
  const [task, changeTask] = useState(TaskForm.defaultAttributes());
  const [isSaving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const handleCreate = () => {
    setSaving(true);

    onCreateCard(task).catch((error) => {
      setSaving(false);
      setErrors(error || {});

      if (error instanceof Error) {
        // eslint-disable-next-line no-alert
        alert(`Creation Failed! Error: ${error.message}`);
      }
    });
  };
  const handleChangeTextField = (fieldName) => (event) => changeTask({ ...task, [fieldName]: event.target.value });
  const handleChangeSelect = (fieldName) => (user) => changeTask({ ...task, [fieldName]: user });
  const handleDateChange = (fieldName) => (date) => changeTask({ ...task, [fieldName]: date.toString() });
  const styles = useStyles();

  return (
    <Modal className={styles.modal} open onClose={onClose}>
      <Card className={styles.root}>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title="Add New Task"
        />
        <CardContent>
          <div className={styles.form}>
            <TextField
              error={has('name', errors)}
              helperText={errors.name}
              onChange={handleChangeTextField('name')}
              value={TaskPresenter.name(task)}
              label="Name"
              required
              margin="dense"
            />
            <TextField
              error={has('description', errors)}
              helperText={errors.description}
              onChange={handleChangeTextField('description')}
              value={TaskPresenter.description(task)}
              label="Description"
              required
              margin="dense"
            />
            {ability.can('create', 'Task', 'author') && (
              <UserSelect
                label="Author"
                userType="Manager"
                value={TaskPresenter.author(task)}
                onChange={handleChangeSelect('author')}
                isDisabled={false}
                isRequired
                error={has('author', errors)}
                helperText={errors.author}
              />
            )}
            {ability.can('update', 'Task', 'assignee') && (
              <UserSelect
                label="Assignee"
                userType="Developer"
                value={TaskPresenter.assignee(task)}
                onChange={handleChangeSelect('assignee')}
                isDisabled={false}
                isRequired={false}
                error={has('assignee', errors)}
                helperText={errors.assignee}
              />
            )}
            <DatePicker
              label="Expited at"
              value={TaskPresenter.expiredAt(task)}
              onChange={handleDateChange('expiredAt')}
              minDate={new Date()}
            />
          </div>
        </CardContent>
        <CardActions className={styles.actions}>
          <Button disabled={isSaving} onClick={handleCreate} variant="contained" size="small" color="primary">
            Add
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

AddPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreateCard: PropTypes.func.isRequired,
  ability: PropTypes.shape().isRequired,
};

export default AddPopup;
