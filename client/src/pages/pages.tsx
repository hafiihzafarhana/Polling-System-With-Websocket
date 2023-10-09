// For switch page

import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';
import Create from './Create';
import Join from './Join';
import Welcome from './Welcome';
import { AppPage, actions, state } from './../action/state';
import WaitingRoom from './WaitingRoom';

const routeConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Create]: Create,
  [AppPage.Join]: Join,
  [AppPage.WaitingRoom]: WaitingRoom,
};

const Pages: React.FC = () => {
  const currentState = useSnapshot(state);
  const pageRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    [AppPage.Welcome]: useRef<HTMLDivElement>(null),
    [AppPage.Create]: useRef<HTMLDivElement>(null),
    [AppPage.Join]: useRef<HTMLDivElement>(null),
    [AppPage.WaitingRoom]: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    // jika data user ada dan poll belum dimulai, maka akan masuk ke ruang tunggu
    if (currentState.me?.id && !currentState.poll?.hasStarted) {
      actions.setPage(AppPage.WaitingRoom);
    }
  }, [currentState.me?.id, currentState.poll?.hasStarted]);

  return (
    <>
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === currentState.currentPage}
          timeout={500}
          classNames="page"
          unmountOnExit
          nodeRef={pageRefs[page]}
        >
          <div
            className={`page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto `}
            ref={pageRefs[page]}
          >
            <Component />
          </div>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;
