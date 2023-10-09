import { Poll } from 'shared/poll-types';
import { proxy, ref } from 'valtio';
import { derive, subscribeKey } from 'valtio/utils';
import { getTokenPayload } from '../utils/util';
import { Socket } from 'socket.io-client';
import { createSocketWithHandlers, socketIOUrl } from '../socket/socket-io';

// Valtio digunakan untuk melakukan state management

// halaman yang ada
export enum AppPage {
  Welcome = 'welcome',
  Create = 'create',
  Join = 'join',
  WaitingRoom = 'waiting-room',
}

// memberi data type

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
  socket?: Socket;
};

// inisialisasi state
const state: AppState = proxy({
  currentPage: AppPage.Welcome,
  isLoading: false,
});

// jika saat ini, state diinisialisasi atau ditentukan dengan sebuah properti, dapat dilakukan dengan method
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

// actions digunakan untuk menambah aksi dalam memanipulasi redux state
const actions = {
  // untuk merubah halaman
  setPage: (page: AppPage): void => {
    state.currentPage = page;
  },
  // untuk kembali ke halaman awal
  startOver: (): void => {
    actions.setPage(AppPage.Welcome);
  },
  // membantu untuk mengaplikasikan sebuah loading
  startLoading: (): void => {
    state.isLoading = true;
  },
  // menginisialisasi adanya poll yang telah dibuat
  initializePoll: (data: Poll): void => {
    state.poll = data;
  },
  setPollAccessToken: (accessToken: string): void => {
    state.accessToken = accessToken;
  },
  // membantu mengaplikasikan jika loading telah usai
  stopLoading: (): void => {
    state.isLoading = false;
  },
  // melakukan pemeriksaan jika tidak ada data reduxnya, ini terjadi mkemungkinan besar saat halaman direfresh
  // ifAfterRefreshAndNoAccessToken: (): void => {
  //   if (!state.accessToken && !state.poll) {
  //     localStorage.removeItem('accessToken');
  //   }
  // },
  // inisialisasi socket
  initializaSocket: (): void => {
    // jika tidak ada socket, buat sebuah koneksi
    if (!state.socket) {
      console.log('yuki');
      state.socket = ref(
        createSocketWithHandlers({ socketIOUrl, state, actions })
      );
    }
    // jika sudah ada socket, maka lakukan koneksi
    else {
      console.log('Yuma');
      state.socket.connect();
    }
  },
  // update poll
  updatePoll: (poll: Poll): void => {
    state.poll = poll;
  },
};

// apabila ada data accessToken di dalam redux state, maka lakukan ini
subscribeKey(state, 'accessToken', () => {
  console.log(state.currentPage);
  if (state.accessToken) {
    console.log(1);
    localStorage.setItem('accessToken', state?.accessToken);
  }
  // else {
  //   console.log(2);
  //   localStorage.removeItem('accessToken');
  // }
});

export type AppActions = typeof actions;

export { stateWithComputed as state, actions };
