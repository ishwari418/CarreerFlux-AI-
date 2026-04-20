import { FileText, Compass, PenTool, BrainCircuit, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]" 
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-indigo-400" : "group-hover:scale-110 transition-transform")} />
    <span className="font-medium">{label}</span>
  </button>
);

export const Sidebar = ({ currentMode, setMode }) => {
  const { logout, user } = useAuth();

  const modes = [
    { id: 'general', label: 'General Chat', icon: MessageSquare },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'career', label: 'Career Guidance', icon: Compass },
    { id: 'notes', label: 'Notes Generator', icon: PenTool },
    { id: 'quiz', label: 'Quiz Generator', icon: BrainCircuit },
  ];

  return (
    <aside className="w-72 h-screen flex flex-col glass border-r border-slate-800/50 p-4 fixed left-0 top-0 z-20">
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold gradient-text">CareerFlux</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {modes.map((mode) => (
          <SidebarItem
            key={mode.id}
            icon={mode.icon}
            label={mode.label}
            active={currentMode === mode.id}
            onClick={() => setMode(mode.id)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        <div className="px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Logged in as</p>
          <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
