import React, { useEffect } from 'react';
import { actions } from '../action/state';

const WaitingRoom: React.FC = () => {
  useEffect(() => {
    console.log('Waiting Room');
    actions.initializaSocket();
  }, []);

  return (
    <div className="flex flex-col h-full justify-between items-center w-full">
      <h3 className="text-center">Waiting Room</h3>
    </div>
  );
};

export default WaitingRoom;
