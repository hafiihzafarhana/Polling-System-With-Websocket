import React from 'react';
import { devtools } from 'valtio/utils';

import './index.css';
import Pages from './pages/pages';
import { state } from './action/state';

devtools(state, 'app_state');
const App: React.FC = () => <Pages />;

export default App;
