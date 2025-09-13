import React, { useState } from 'react';
import UploadFile from '../Component.js/UploadFile';
import CreateSegment from '../Component.js/CreateSegment';
import { FileUp } from 'lucide-react';

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  return (
    <div className='w-full flex relative justify-center gap-10 '>
      <div className='absolute top-5 left-5 flex flex-col items-center gap-3'>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-slate-800'>
          <FileUp className='w-5 h-5' />
          {showUpload ? 'Hide' : 'Show'} Upload Panel
          </button>
        {
          showUpload &&
          <UploadFile/>
        }
      </div>
      <CreateSegment />
      
    </div>
  );
};

export default Dashboard;
