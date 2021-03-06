import { pick, propOr } from 'ramda';

export default {
  defaultAttributes(attributes) {
    return {
      name: '',
      description: '',
      author: null,
      assignee: null,
      expiredAt: null,
      ...attributes,
    };
  },

  attributesToSubmit(task) {
    const pertmittedKeys = ['id', 'name', 'description', 'expiredAt'];

    return {
      ...pick(pertmittedKeys, task),
      assigneeId: propOr(null, 'id', task.assignee),
      authorId: propOr(null, 'id', task.author),
    };
  },
};
