import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';
import TaskBoard from 'containers/TaskBoard';

const App = (user) => (
  <Provider store={store}>
    <TaskBoard user={user} />
  </Provider>
);

export default App;
