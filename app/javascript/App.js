import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';
import TaskBoard from 'containers/TaskBoard';
import MUITheme from 'MUITheme/MUITheme';

const App = (user) => (
  <Provider store={store}>
    <MUITheme>
      <TaskBoard user={user} />
    </MUITheme>
  </Provider>
);

export default App;
