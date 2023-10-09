import React, { useEffect } from 'react';
import { devtools } from 'valtio/utils';

import './index.css';
import Pages from './pages/pages';
import { actions, state } from './action/state';
import { useSnapshot } from 'valtio';
import Loader from './components/ui/Loader';
import { getTokenPayload } from './utils/util';

devtools(state, { name: 'app_state', enabled: true });
const App: React.FC = () => {
  const currState = useSnapshot(state);

  useEffect(() => {
    actions.startLoading();

    const accessToken = localStorage.getItem('accessToken');

    // Jika tidak ada accessToken
    if (!accessToken) {
      actions.stopLoading();
      return;
    }

    const { exp: tokenExp } = getTokenPayload(accessToken);
    const currTimeSeconds = Date.now() / 1000;

    // hapus token lama
    // jika token ada dalam 10 detik, akan dicegah agar koneksi karena poll hampir selesai
    if (tokenExp < currTimeSeconds - 10) {
      localStorage.removeItem('accessToken');
      actions.stopLoading();
      return;
    }

    // reconnect ke poll
    actions.setPollAccessToken(accessToken);

    // kirim pemberitahuan untuk bergabung ke poll kembali
    actions.initializaSocket();

    // actions.stopLoading();
  }, []);

  return (
    <>
      <Loader isLoading={currState.isLoading} color="orange" width={120} />
      <Pages />
    </>
  );
};

export default App;
