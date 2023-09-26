import { Poll } from 'shared/poll-types';
import { proxy } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { getTokenPayload } from '../utils/util';

// Valtio digunakan untuk melakukan state management

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waiting-room',
}

type Me = {
  id: string;
  name: string;
};

export type AppState = {
  isLoading: boolean;
  currentPage: AppPage;
  poll?: Poll;
  accessToken?: string;
  me?: Me;
};

const state: AppState = proxy({
  currentPage: AppPage.Welcome,
  isLoading: false,
});

const stateWithComputed: AppState = derive(
  {
    me: (get) => {
      const accessToken = get(state).accessToken;
      if (!accessToken) return;

      const token = getTokenPayload(accessToken);

      return {
        id: token.sub,
        name: token.name,
      };
    },
    isAdmin: (get) => {
      if (
        get(state).me?.id === undefined ||
        get(state).poll?.adminId == undefined
      )
        return;
      return get(state).me?.id == get(state).poll?.adminId;
    },
  },
  { proxy: state }
);

const actions = {
  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },
  startOver: (): void => {
    actions.setPage(AppPage.Welcome);
  },
  startLoading: (): void => {
    state.isLoading = true;
  },
  initializePoll: (data: Poll): void => {
    state.poll = data;
  },
  setPollAccessToken: (accessToken: string): void => {
    state.accessToken = accessToken;
  },
  stopLoading: (): void => {
    state.isLoading = false;
  },
  ifAfterRefreshAndNoAccessToken: (): void => {
    if (!state.accessToken && !state.poll) {
      localStorage.removeItem('accessToken');
    }
  },
};

subscribeKey(state, 'accessToken', () => {
  console.log(state.currentPage);
  if (state.accessToken && state.poll) {
    console.log(1);
    localStorage.setItem('accessToken', state?.accessToken);
  } else {
    console.log(2);
    localStorage.removeItem('accessToken');
  }
});

export { stateWithComputed as state, actions };
