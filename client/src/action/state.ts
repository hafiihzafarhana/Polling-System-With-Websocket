import { Poll } from 'shared/poll-types';
import { proxy } from 'valtio';

// Valtio digunakan untuk melakukan state management

export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waiting-room',
}

export type AppState = {
  isLoading: boolean;
  currentPage: AppPage;
  poll?: Poll;
  accessToken?: string;
};

const state: AppState = proxy({
  currentPage: AppPage.Welcome,
  isLoading: false,
  accessToken: '',
});

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
};

export { state, actions };
