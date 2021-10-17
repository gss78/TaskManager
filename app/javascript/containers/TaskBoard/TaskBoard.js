import React, { useEffect, useState } from 'react';
import KanbanBoard from '@asseinfo/react-kanban';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddButton from 'components/AddButton';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TaskForm from 'forms/TaskForm';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from 'prop-types';

import TasksRepository from 'repositories/TasksRepository';
import defineAbilityFor from 'authz/defineAbility';

import useTasks from 'hooks/store/useTasks';

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const TaskBoard = ({ user }) => {
  const ability = defineAbilityFor(user);
  const { board, loadBoard, loadColumn, loadColumnMore } = useTasks();

  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

  useEffect(() => loadBoard(), []);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumn(task.state);
      handleClose();
    });
  };
  const handleTaskLoad = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumn(task.state);
      handleClose();
    });
  };

  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(task.id).then(() => {
      loadColumn(task.state);
      handleClose();
    });

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { task: { stateEvent: transition.event } })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(`Move failed! ${error.message}`);
      });
  };

  const enableCardDrag = (a) => a.cannot('update', 'Task', 'state');

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <>
          <KanbanBoard
            disableColumnDrag
            disableCardDrag={enableCardDrag(ability)}
            onCardDragEnd={handleCardDragEnd}
            renderCard={(card) => <Task task={card} onClick={handleOpenEditPopup} />}
            renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
          >
            {board}
          </KanbanBoard>
          {ability.can('create', 'Task') && <AddButton onClick={handleOpenAddPopup} />}
          {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} ability={ability} />}
          {mode === MODES.EDIT && (
            <EditPopup
              onLoadCard={handleTaskLoad}
              onCardDestroy={handleTaskDestroy}
              onCardUpdate={handleTaskUpdate}
              onClose={handleClose}
              cardId={openedTaskId}
              ability={ability}
            />
          )}
        </>
      </MuiPickersUtilsProvider>
    </div>
  );
};

TaskBoard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
  }).isRequired,
};

export default TaskBoard;
