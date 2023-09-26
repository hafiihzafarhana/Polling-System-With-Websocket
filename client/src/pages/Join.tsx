import React, { useState } from 'react';
import { AppPage, actions } from '../action/state';
import { Poll } from 'shared/poll-types';
import { makeRequest } from '../api/api';

const Join: React.FC = () => {
  const [pollId, setPollId] = useState('');
  const [name, setName] = useState('');
  const [apiError, setApiError] = useState<string>('');

  const areFieldsValid = (): boolean => {
    if (pollId.length < 6 || pollId.length > 6) return false;

    if (name.length < 1 || name.length > 25) return false;

    return true;
  };

  const handleJoinPoll = async () => {
    actions.startLoading();
    setApiError('');

    const { data, error } = await makeRequest<{
      poll: Poll;
      accessToken: string;
    }>('/polls/join', {
      method: 'POST',
      body: JSON.stringify({
        pollId,
        name,
      }),
    });

    if (error && error.statusCode === 400) {
      console.log('Erro 400', error);
      setApiError('Please make sure your data');
    } else if (error && !error.statusCode) {
      setApiError('Unknow Api Error');
    } else {
      actions.initializePoll(data.poll);
      actions.setPollAccessToken(data.accessToken);
      actions.setPage(AppPage.WaitingRoom);
    }

    actions.stopLoading();
  };

  return (
    <div className="flex flex-col h-full justify-around items-stretch w-full mx-auto max-w-sm">
      <div className="mb-12">
        <div className="my-4">
          <h3 className="text-center">Enter Code</h3>
          <div className="text-center w-full">
            <input
              maxLength={6}
              onChange={(e) => setPollId(e.target.value)}
              className="box info w-full"
            />
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-center">Your Name</h3>
          <div className="text-center w-full">
            <input
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="box info w-full"
            />
          </div>
        </div>

        {apiError && (
          <p className="text-center text-red-600 font-light mt-8">{apiError}</p>
        )}
      </div>

      <div className="my-12 flex flex-col justify-center items-center">
        <button
          disabled={!areFieldsValid()}
          className="box btn-orange w-32 my-2"
          onClick={handleJoinPoll}
        >
          Join
        </button>
        <button
          className="box btn-purple w-32 my-2"
          onClick={() => actions.startOver()}
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default Join;
