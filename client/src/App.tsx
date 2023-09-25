import React from 'react';
import { devtools } from 'valtio/utils';

import './index.css';
import Pages from './pages/pages';
import { state } from './action/state';
import { useSnapshot } from 'valtio';
import Loader from './components/ui/Loader';

devtools(state, { name: 'app_state', enabled: true });
const App: React.FC = () => {
  const currState = useSnapshot(state);
  return (
    <>
      <Loader isLoading={currState.isLoading} color="orange" width={120} />
      <Pages />
    </>
  );
};

export default App;
