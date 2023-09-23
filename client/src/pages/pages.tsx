// For switch page

import React from 'react';
import Welcome from './Welcome';
import { AppPage, state } from '../action/state';
import Join from './Join';
import Create from './Create';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';

const routeConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Join]: Join,
  [AppPage.Create]: Create,
};

const Pages: React.FC = () => {
  const currState = useSnapshot(state);
  return (
    <>
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === currState.currentPage}
          timeout={500}
          classNames={'page'}
          unmountOnExit
        >
          <div className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto">
            <Component />
          </div>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;
