import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, Settings, Terminal as TerminalIcon, FileText, 
  Image, Code, Database, Send, Loader, ChevronRight, ChevronDown,
  Folder, File, Download, Upload, Play, StopCircle, Zap, Brain,
  Users, Bot, GitBranch, Eye, Paperclip, X, Menu, Minimize2, Maximize2
} from 'lucide-react';

// Agent color palette
const AGENT_COLORS = {
  user: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', accent: '#6B7280' },
  leader: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300', accent: '#3B82F6' },
  research: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-300', accent: '#14B8A6' },
  data: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300', accent: '#6366F1' },
  backend: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', accent: '#A855F7' },
  frontend: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-300', accent: '#EC4899' },
  legal: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', accent: '#DC2626' },
  media: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', accent: '#F59E0B' },
  devops: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300', accent: '#64748B' },
  workspace: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', accent: '#10B981' },
  shell: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', accent: '#F97316' },
  security: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-400', accent: '#EF4444' },
  vault: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-300', accent: '#06B6D4' },
  qa: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-300', accent: '#84CC16' }
};

const AGENTS = [
  { id: 'leader', name: 'Leader AI', status: 'idle', color: 'leader' },
  { id: 'research', name: 'Research & OSINT', status: 'idle', color: 'research' },
  { id: 'data', name: 'Data & Big Data', status: 'idle', color: 'data' },
  { id: 'backend', name: 'Backend & API', status: 'idle', color: 'backend' },
  { id: 'frontend', name: 'Frontend & UI/UX', status: 'idle', color: 'frontend' },
  { id: 'legal', name: 'Legal & Business', status: 'idle', color: 'legal' },
  { id: 'media', name: 'Media & Design', status: 'idle', color: 'media' },
  { id: 'devops', name: 'DevOps & Tooling', status: 'idle', color: 'devops' },
  { id: 'workspace', name: 'Workspace AI', status: 'idle', color: 'workspace' },
  { id: 'shell', name: 'Shell & Automation', status: 'idle', color: 'shell' },
  { id: 'security', name: 'Security & Compliance', status: 'idle', color: 'security' },
  { id: 'vault', name: 'Vault & Identity', status: 'idle', color: 'vault' },
  { id: 'qa', name: 'QA & Testing', status: 'idle', color: 'qa' }
];

const BOTS = [
  'Web Scraper', 'Data Cleaner', 'Code Formatter', 'Log Analyzer',
  'File Converter', 'Compression', 'Media Transcoder', 'Summary/Notification'
];

const FileExplorer = ({ onFileSelect }) => {
  const [expanded, setExpanded] = useState({ 'project-1': true });
  
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const files = [
    { id: 'project-1', name: 'WebApp-X', type: 'folder', children: [
      { id: 'src', name: 'src', type: 'folder', children: [
        { id: 'frontend', name: 'frontend', type: 'folder', agent: 'frontend' },
        { id: 'backend', name: 'backend', type: 'folder', agent: 'backend' }
      ]},
      { id: 'docs', name: 'docs', type: 'folder', children: [
        { id: 'spec', name: 'spec.md', type: 'file', agent: 'workspace' }
      ]},
      { id: 'data', name: 'data', type: 'folder' }
    ]}
  ];

  const renderTree = (items, level = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <div 
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-sm"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => item.type === 'folder' ? toggleExpand(item.id) : onFileSelect(item)}
        >
          {item.type === 'folder' && (
            expanded[item.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
          {item.type === 'folder' ? <Folder size={14} className="text-blue-500" /> : <File size={14} className="text-gray-500" />}
          <span className="flex-1">{item.name}</span>
          {item.agent && (
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: AGENT_COLORS[item.agent]?.accent }}
            />
          )}
        </div>
        {item.children && expanded[item.id] && renderTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="h-full overflow-auto p-2">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="font-semibold text-sm">Files</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Plus size={16} />
        </button>
      </div>
      {renderTree(files)}
    </div>
  );
};

const AgentsPanel = () => {
  return (
    <div className="h-full overflow-auto p-3">
      <h3 className="font-semibold text-sm mb-3">Agents</h3>
      <div className="space-y-2">
        {AGENTS.map(agent => (
          <div 
            key={agent.id}
            className={`flex items-center gap-3 p-2 rounded-lg border ${AGENT_COLORS[agent.color].bg} ${AGENT_COLORS[agent.color].border}`}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: AGENT_COLORS[agent.color].accent }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{agent.name}</div>
              <div className="text-xs text-gray-500 capitalize">{agent.status}</div>
            </div>
            <Brain size={14} className="text-gray-400" />
          </div>
        ))}
      </div>
      
      <h3 className="font-semibold text-sm mb-3 mt-6">Bots</h3>
      <div className="space-y-1">
        {BOTS.map(bot => (
          <div key={bot} className="flex items-center gap-2 p-2 text-xs hover:bg-gray-50 rounded">
            <Bot size={12} className="text-gray-400" />
            <span>{bot}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatMessage = ({ message }) => {
  const color = AGENT_COLORS[message.agent] || AGENT_COLORS.user;
  const isUser = message.agent === 'user';
  
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-start' : 'justify-end'}`}>
      {!isUser && (
        <div className="flex flex-col items-end flex-1">
          <div className={`max-w-2xl p-3 rounded-lg ${color.bg} border ${color.border}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold ${color.text}`}>
                {AGENTS.find(a => a.id === message.agent)?.name || 'System'}
              </span>
            </div>
            <div className="text-sm">{message.text}</div>
            {message.files && (
              <div className="flex flex-wrap gap-2 mt-2">
                {message.files.map((file, i) => (
                  <div key={i} className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs border">
                    <FileText size={12} />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">{message.time}</div>
        </div>
      )}
      {isUser && (
        <div className="flex flex-col items-start flex-1">
          <div className="max-w-2xl p-3 rounded-lg bg-gray-100 border border-gray-300">
            <div className="text-sm">{message.text}</div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{message.time}</div>
        </div>
      )}
    </div>
  );
};

const Terminal = () => {
  const [lines, setLines] = useState([
    { type: 'output', text: 'AI Terminal Ready. Type commands or ask AI for help.' },
    { type: 'prompt', text: '$ ' }
  ]);
  const [input, setInput] = useState('');

  const handleCommand = (cmd) => {
    if (!cmd.trim()) return;
    
    setLines(prev => [...prev, 
      { type: 'command', text: `$ ${cmd}` },
      { type: 'output', text: 'Command executed. (Demo mode)' },
      { type: 'prompt', text: '$ ' }
    ]);
    setInput('');
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100 p-3 font-mono text-sm overflow-auto">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
        <span className="text-xs text-gray-400">Terminal</span>
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded">
            Explain Last Error
          </button>
          <button className="text-xs px-2 py-1 bg-blue-900 hover:bg-blue-800 rounded">
            Generate Command
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'output' ? 'text-gray-400' : ''}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-green-400">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          className="flex-1 bg-transparent outline-none"
          placeholder="Type command or ask AI..."
        />
      </div>
    </div>
  );
};

const PreviewPane = ({ file }) => {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Eye size={48} className="mx-auto mb-2 opacity-50" />
          <p>Select a file to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{file.name}</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
            Ask AI
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Edit
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded p-4 text-sm">
        <p className="text-gray-600">Preview content for {file.name}</p>
        <p className="mt-2 text-xs text-gray-500">
          AI Capabilities: Summarize, Explain, Rewrite, Extract Data
        </p>
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const statuses = ['Backlog', 'In Progress', 'Verifying', 'Done'];
  const tasks = {
    'Backlog': [{ id: 1, title: 'Research competitors', agent: 'research' }],
    'In Progress': [
      { id: 2, title: 'Design database schema', agent: 'data' },
      { id: 3, title: 'Build API endpoints', agent: 'backend' }
    ],
    'Verifying': [{ id: 4, title: 'Frontend components', agent: 'frontend' }],
    'Done': []
  };

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex gap-4">
        {statuses.map(status => (
          <div key={status} className="flex-1 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">{status}</h3>
            <div className="space-y-2">
              {(tasks[status] || []).map(task => {
                const color = AGENT_COLORS[task.agent];
                return (
                  <div 
                    key={task.id}
                    className={`p-3 rounded-lg border ${color.bg} ${color.border}`}
                  >
                    <div className="text-sm mb-1">{task.title}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color.accent }}
                      />
                      {AGENTS.find(a => a.id === task.agent)?.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AIOpsApp() {
  const [activeTab, setActiveTab] = useState('agents');
  const [mode, setMode] = useState('quick');
  const [messages, setMessages] = useState([
    { agent: 'leader', text: 'Hello! I\'m your Leader AI. I can help coordinate your entire project. What would you like to build today?', time: '10:30 AM' }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bottomView, setBottomView] = useState('terminal');
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      agent: 'user',
      text: input,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        agent: 'leader',
        text: 'I understand. Let me break this down and assign tasks to the appropriate agents...',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const modes = [
    { id: 'quick', name: 'Quick', icon: Zap },
    { id: 'deep', name: 'Deep Think', icon: Brain },
    { id: 'research', name: 'Research', icon: Search }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">AI Operations Platform</h1>
          <select className="px-3 py-1.5 border rounded text-sm">
            <option>WebApp-X</option>
            <option>OSINT-Bounty-1</option>
            <option>+ New Project</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {modes.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 ${
                    mode === m.id ? 'bg-white shadow' : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  {m.name}
                </button>
              );
            })}
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-64'} bg-white border-r flex flex-col transition-all duration-200`}>
          <div className="flex items-center justify-between p-3 border-b">
            {!sidebarCollapsed && (
              <div className="flex gap-2 overflow-x-auto">
                {['agents', 'bots', 'files'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded text-sm capitalize ${
                      activeTab === tab ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Menu size={16} />
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              {activeTab === 'agents' && <AgentsPanel />}
              {activeTab === 'files' && <FileExplorer onFileSelect={setSelectedFile} />}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-auto p-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe your project or task..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Split View */}
          <div className="h-64 border-t flex">
            {/* Terminal / Task Board Switcher */}
            <div className="flex-1 border-r">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b">
                <button
                  onClick={() => setBottomView('terminal')}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${
                    bottomView === 'terminal' ? 'bg-white shadow' : 'hover:bg-gray-100'
                  }`}
                >
                  <TerminalIcon size={14} />
                  Terminal
                </button>
                <button
                  onClick={() => setBottomView('tasks')}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${
                    bottomView === 'tasks' ? 'bg-white shadow' : 'hover:bg-gray-100'
                  }`}
                >
                  <GitBranch size={14} />
                  Tasks
                </button>
              </div>
              {bottomView === 'terminal' ? <Terminal /> : <TaskBoard />}
            </div>

            {/* Preview Pane */}
            <div className="flex-1 bg-white">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
                <span className="text-sm font-medium">Preview</span>
              </div>
              <PreviewPane file={selectedFile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}