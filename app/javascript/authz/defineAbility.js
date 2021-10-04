import { defineAbility } from '@casl/ability';

export default (user) =>
  defineAbility((can, cannot) => {
    if (user.type === 'Developer') {
      can('update', 'Task', ['assignee', 'state']);
      cannot('create', 'Task');
      cannot('delete', 'Task');
      cannot('update', 'Task', ['author', 'name', 'description']);
    } else if (user.type === 'Manager') {
      can('create', 'Task');
      cannot('create', 'Task', 'author');
      can('delete', 'Task', { authorId: user.id });
      can('update', 'Task', ['name', 'description', 'expire_at']);
      cannot('update', 'Task', ['state', 'assignee', 'author']);
    } else if (user.type === 'Admin') {
      can('create', 'Task');
      can('update', 'Task');
      can('delete', 'Task');
    }
  });
