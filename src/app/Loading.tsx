import {TailSpin } from 'react-loader-spinner';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <TailSpin height="60" width="60" color="#4f46e5" />
    </div>
  );
};

export default Loading;
