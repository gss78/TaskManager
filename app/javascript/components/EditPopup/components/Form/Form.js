import React from 'react';
import PropTypes from 'prop-types';
import { has, isNil } from 'ramda';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DatePicker } from '@material-ui/pickers';

import useStyles from './useStyles';

import UserSelect from 'components/UserSelect';
import ImageUpload from 'components/ImageUpload';

import TaskPresenter from 'presenters/TaskPresenter';

const Form = ({ errors, onChange, onAttachImage, onRemoveImage, task, ability }) => {
  const handleChangeTextField = (fieldName) => (event) => onChange({ ...task, [fieldName]: event.target.value });
  const handleChangeSelect = (fieldName) => (user) => onChange({ ...task, [fieldName]: user });
  const handleDateChange = (fieldName) => (date) => onChange({ ...task, [fieldName]: date.toString() });

  const styles = useStyles();

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeTextField('name')}
        value={TaskPresenter.name(task)}
        label="Name"
        required
        disabled={ability.cannot('update', 'Task', 'name')}
        margin="dense"
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeTextField('description')}
        value={TaskPresenter.description(task)}
        label="Description"
        required
        disabled={ability.cannot('update', 'Task', 'description')}
        multiline
        margin="dense"
      />
      <UserSelect
        label="Author"
        userType="Manager"
        value={TaskPresenter.author(task)}
        onChange={handleChangeSelect('author')}
        isDisabled={ability.cannot('update', 'Task', 'author')}
        isRequired
        error={has('author', errors)}
        helperText={errors.author}
      />
      <UserSelect
        label="Assignee"
        userType="Developer"
        value={TaskPresenter.assignee(task)}
        onChange={handleChangeSelect('assignee')}
        isDisabled={ability.cannot('update', 'Task', 'assignee')}
        isRequired={false}
        error={has('assignee', errors)}
        helperText={errors.author}
      />
      <DatePicker
        label="Expited at"
        value={TaskPresenter.expiredAt(task)}
        onChange={handleDateChange('expiredAt')}
        minDate={new Date()}
        minDateMessage=""
        disabled={ability.cannot('update', 'Task', 'expireAt')}
      />

      {ability.can('update', 'Task', 'image') &&
        (isNil(TaskPresenter.imageUrl(task)) ? (
          <div className={styles.imageUploadContainer}>
            <ImageUpload onUpload={onAttachImage} />
          </div>
        ) : (
          <div className={styles.previewContainer}>
            <img className={styles.preview} src={TaskPresenter.imageUrl(task)} alt="Attachment" />
            <Button variant="contained" size="small" color="primary" onClick={onRemoveImage}>
              Remove image
            </Button>
          </div>
        ))}
    </form>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  onAttachImage: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  task: TaskPresenter.shape().isRequired,
  ability: PropTypes.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
};

Form.defaultProps = {
  errors: {},
};

export default Form;
