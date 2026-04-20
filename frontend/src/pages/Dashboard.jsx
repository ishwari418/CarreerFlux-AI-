import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';

export const Dashboard = () => {
  const [mode, setMode] = useState('general');

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar currentMode={mode} setMode={setMode} />
      <ChatArea mode={mode} />
    </div>
  );
};
