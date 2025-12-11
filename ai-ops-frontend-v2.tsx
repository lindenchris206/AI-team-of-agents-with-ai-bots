import React, { useState } from 'react';
import { 
  MessageSquare, Brain, BookOpen, Settings, Globe, Lock, 
  Puzzle, FileText, Image, Table, Terminal, 
  Eye, Plus, Save, Download, Upload, Search, Shield, Key,
  Database, Chrome, Code, Play, X, Maximize2, Film, Layers,
  HardDrive, Cpu, FolderOpen, Link2, Zap, Package
} from 'lucide-react';

// ============================================================================
// TAB SYSTEM
// ============================================================================

const TABS = [
  { id: 'workspace', name: 'Workspace', icon: MessageSquare },
  { id: 'agents', name: 'AI Agents', icon: Brain },
  { id: 'knowledge', name: 'Knowledge', icon: BookOpen },
  { id: 'browsers', name: 'Browsers', icon: Globe },
  { id: 'vault', name: 'Vault', icon: Lock },
  { id: 'editors', name: 'Editors', icon: Layers },
  { id: 'integrations', name: 'Integrations', icon: Puzzle },
  { id: 'extensions', name: 'Extensions', icon: Package },
  { id: 'settings', name: 'Settings', icon: Settings }
];

const AGENTS = [
  { id: 'leader', name: 'Leader AI', color: '#3B82F6', status: 'idle' },
  { id: 'research', name: 'Research & OSINT', color: '#14B8A6', status: 'idle' },
  { id: 'data', name: 'Data & Big Data', color: '#6366F1', status: 'idle' },
  { id: 'backend', name: 'Backend & API', color: '#A855F7', status: 'idle' },
  { id: 'frontend', name: 'Frontend & UI/UX', color: '#EC4899', status: 'idle' },
  { id: 'legal', name: 'Legal & Business', color: '#DC2626', status: 'idle' },
  { id: 'media', name: 'Media & Design', color: '#F59E0B', status: 'idle' },
  { id: 'devops', name: 'DevOps & Tooling', color: '#64748B', status: 'idle' },
  { id: 'workspace', name: 'Workspace AI', color: '#10B981', status: 'idle' },
  { id: 'shell', name: 'Shell & Automation', color: '#F97316', status: 'idle' },
  { id: 'security', name: 'Security', color: '#EF4444', status: 'idle' },
  { id: 'vault', name: 'Vault & Identity', color: '#06B6D4', status: 'idle' },
  { id: 'qa', name: 'QA & Testing', color: '#84CC16', status: 'idle' }
];

const WORKFLOWS = [
  'Sequential Pipeline', 'Parallel Specialist', 'Hierarchical Supervisor',
  'Event-Driven', 'Adaptive ReAct', 'Handoff/Magentic'
];

// ============================================================================
// WORKSPACE TAB (Main Chat + Terminal + Preview)
// ============================================================================

const WorkspaceTab = () => {
  const [terminalLines, setTerminalLines] = useState([
    '> AI Terminal Ready',
    '> Type commands or ask AI for help'
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  const handleTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    setTerminalLines(prev => [...prev, `$ ${terminalInput}`, 'Command executed (demo)']);
    setTerminalInput('');
  };

  return (
    <div className="h-full flex">
      {/* Left: Chat */}
      <div className="w-80 border-r flex flex-col bg-white">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Leader AI Chat</h3>
          <select className="w-full mt-2 p-2 border rounded text-sm">
            <option>Select Workflow</option>
            {WORKFLOWS.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-700 mb-1">Leader AI</div>
            <div className="text-sm">Hello! I'm ready to coordinate your project. What would you like to build?</div>
          </div>
        </div>
        <div className="p-3 border-t">
          <textarea 
            className="w-full p-2 border rounded text-sm resize-none" 
            rows="3"
            placeholder="Describe your project..."
          />
          <button className="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>

      {/* Right: Terminal + Preview (BIG) */}
      <div className="flex-1 flex flex-col">
        {/* Terminal (Top Half) */}
        <div className="flex-1 bg-gray-900 text-gray-100 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <TerminalIcon size={16} />
              <span className="text-sm font-semibold">AI Terminal</span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                Explain Error
              </button>
              <button className="px-3 py-1 bg-blue-900 hover:bg-blue-800 rounded text-xs">
                Generate Command
              </button>
              <button className="p-1 hover:bg-gray-700 rounded">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm">
            {terminalLines.map((line, i) => (
              <div key={i} className={line.startsWith('$') ? 'text-green-400' : 'text-gray-400'}>
                {line}
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-2">
            <span className="text-green-400">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
              className="flex-1 bg-transparent outline-none"
              placeholder="Type command or ask AI..."
            />
          </div>
        </div>

        {/* Preview Pane (Bottom Half) */}
        <div className="flex-1 bg-white border-t">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span className="text-sm font-semibold">Preview & Editor</span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                Ask AI About This
              </button>
              <button className="px-3 py-1 border rounded text-xs hover:bg-gray-100">
                Edit
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
          <div className="p-6 overflow-auto h-full">
            <div className="text-center text-gray-400 mt-20">
              <Eye size={64} className="mx-auto mb-4 opacity-30" />
              <p>Select a file to preview or drag & drop files here</p>
              <div className="flex gap-2 justify-center mt-4">
                <button className="px-4 py-2 border rounded hover:bg-gray-50">Upload Files</button>
                <button className="px-4 py-2 border rounded hover:bg-gray-50">Open Editor</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AI AGENTS TAB
// ============================================================================

const AgentsTab = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <div className="h-full flex">
      <div className="w-80 border-r bg-gray-50 overflow-auto p-4">
        <h3 className="font-semibold mb-3">AI Agents ({AGENTS.length})</h3>
        <div className="space-y-2">
          {AGENTS.map(agent => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedAgent?.id === agent.id
                  ? 'bg-white border-blue-500 shadow'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{agent.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{agent.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {selectedAgent ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: selectedAgent.color + '20', border: `2px solid ${selectedAgent.color}` }}>
                <Brain size={24} style={{ color: selectedAgent.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
                <p className="text-gray-600">Configure models and settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Primary Model</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>GPT-4 Turbo</option>
                  <option>GPT-4</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Claude 3 Opus</option>
                  <option>Gemini Pro 1.5</option>
                  <option>Local: Llama 3 70B</option>
                  <option>Local: Mixtral 8x7B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Secondary Model (Dual-Mode)</label>
                <select className="w-full p-3 border rounded-lg">
                  <option>None</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>GPT-4</option>
                  <option>Gemini Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Specialties (3-4 selected)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Web Research', 'OSINT', 'Data Mining', 'API Integration', 'Security Analysis', 'Report Writing'].map(spec => (
                    <label key={spec} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                      <input type="checkbox" />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Knowledge Packs</label>
                <div className="space-y-1">
                  {['Web Development', 'OSINT Fundamentals', 'Database Design', 'API Security'].map(pack => (
                    <label key={pack} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                      <input type="checkbox" defaultChecked />
                      <BookOpen size={14} />
                      <span className="text-sm">{pack}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Save Configuration
                </button>
                <button className="px-4 py-2 border rounded hover:bg-gray-50">
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Brain size={64} className="mx-auto mb-4 opacity-30" />
              <p>Select an agent to configure</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// KNOWLEDGE BASE TAB
// ============================================================================

const KnowledgeTab = () => {
  const categories = [
    { name: 'Software Development', packs: 40, icon: Code },
    { name: 'Web Research & OSINT', packs: 25, icon: Search },
    { name: 'Legal & Benefits', packs: 30, icon: FileText },
    { name: 'Real Estate & Engineering', packs: 25, icon: HardDrive },
    { name: 'E-Commerce & Business', packs: 25, icon: Table },
    { name: 'General Skills', packs: 5, icon: BookOpen }
  ];

  return (
    <div className="h-full flex">
      <div className="w-80 border-r bg-gray-50 overflow-auto p-4">
        <h3 className="font-semibold mb-3">Knowledge Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="p-3 bg-white border rounded-lg hover:border-blue-300 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <div className="text-xs text-gray-500">{cat.packs} packs</div>
              </div>
            );
          })}
        </div>
        <button className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Custom Pack
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Knowledge Pack Library (150 Total)</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <Upload size={16} />
              Import Packs
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg hover:border-blue-300 hover:shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-500" />
                  <h4 className="font-semibold text-sm">Pack {i + 1}</h4>
                </div>
                <input type="checkbox" />
              </div>
              <p className="text-xs text-gray-600 mb-3">REST API Design, Authentication patterns, Rate limiting strategies</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>2.3 MB</span>
                <span>540 docs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BROWSERS TAB
// ============================================================================

const BrowsersTab = () => {
  const browsers = [
    { id: 'brave', name: 'Brave Browser', icon: Shield, color: '#FB542B', enabled: true },
    { id: 'edge', name: 'Microsoft Edge', icon: Globe, color: '#0078D7', enabled: true },
    { id: 'privacy', name: 'Privacy Browser', icon: Lock, color: '#6B7280', enabled: true }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-xl font-bold mb-2">Built-in Browsers</h2>
        <p className="text-sm text-gray-600">AI agents can control these browsers for web automation</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 p-4">
        {browsers.map(browser => {
          const Icon = browser.icon;
          return (
            <div key={browser.id} className="border rounded-lg p-4 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                     style={{ backgroundColor: browser.color + '20' }}>
                  <Icon size={24} style={{ color: browser.color }} />
                </div>
                <div>
                  <h3 className="font-semibold">{browser.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Enabled
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  JavaScript Enabled
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked />
                  Cookies Allowed
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" />
                  Headless Mode
                </label>
              </div>

              <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2">
                <Play size={16} />
                Launch Browser
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <div className="space-y-2">
          <div className="text-sm p-2 bg-white border rounded">
            Research Agent: Accessed 5 sites via Brave (2 min ago)
          </div>
          <div className="text-sm p-2 bg-white border rounded">
            Security Agent: Scanned target.com via Privacy Browser (15 min ago)
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VAULT TAB
// ============================================================================

const VaultTab = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full flex">
      <div className="w-80 border-r bg-gray-50 overflow-auto p-4">
        <h3 className="font-semibold mb-3">Vault Categories</h3>
        <div className="space-y-2">
          {['All Credentials', 'Email Accounts', 'API Keys', 'Database Connections', 'SSH Keys', 'OAuth Tokens'].map(cat => (
            <div key={cat} className="p-3 bg-white border rounded-lg hover:border-blue-300 cursor-pointer">
              <div className="flex items-center gap-2">
                <Key size={14} />
                <span className="text-sm font-medium">{cat}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2">
          <Plus size={16} />
          Add New Credential
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Password Vault & Credentials</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <Shield size={16} />
              Master Password
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
              <Lock size={16} />
              Locked
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { service: 'Gmail API', username: 'user@gmail.com', type: 'OAuth' },
            { service: 'GitHub', username: 'developer', type: 'Token' },
            { service: 'AWS', username: 'AKIA...', type: 'Access Key' },
            { service: 'OpenAI API', username: 'sk-...', type: 'API Key' },
            { service: 'Database (PostgreSQL)', username: 'admin', type: 'Password' }
          ].map((cred, i) => (
            <div key={i} className="p-4 border rounded-lg hover:border-blue-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Key size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{cred.service}</div>
                    <div className="text-sm text-gray-600">{cred.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{cred.type}</span>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EDITORS TAB
// ============================================================================

const EditorsTab = () => {
  const editors = [
    { name: 'PDF Editor', icon: FileText, color: '#DC2626', features: ['View', 'Edit', 'Annotate', 'Fill Forms'] },
    { name: 'Word Processor', icon: FileText, color: '#2563EB', features: ['Rich Text', 'Track Changes', 'AI Writing'] },
    { name: 'Spreadsheet', icon: Table, color: '#059669', features: ['Formulas', 'Charts', 'AI Analysis'] },
    { name: 'Image Editor', icon: Image, color: '#D946EF', features: ['Crop', 'Enhance', 'AI Generation'] },
    { name: 'Video Editor', icon: Film, color: '#EA580C', features: ['Trim', 'Transcode', 'AI Captions'] },
    { name: 'Code Editor', icon: Code, color: '#6366F1', features: ['Syntax', 'Lint', 'AI Completion'] }
  ];

  return (
    <div className="h-full p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Editor Suite</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {editors.map(editor => {
          const Icon = editor.icon;
          return (
            <div key={editor.name} className="border rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: editor.color + '20' }}>
                  <Icon size={28} style={{ color: editor.color }} />
                </div>
                <h3 className="text-lg font-semibold">{editor.name}</h3>
              </div>

              <div className="space-y-2 mb-4">
                {editor.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>

              <button className="w-full py-2 border rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                <Plus size={16} />
                Open Editor
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">AI-Powered Features</h3>
        <p className="text-sm text-gray-700">
          Every editor has integrated AI assistance. Ask AI to summarize, rewrite, analyze, or generate content directly within each tool.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// INTEGRATIONS TAB
// ============================================================================

const IntegrationsTab = () => {
  const integrations = [
    { name: 'Gmail', icon: '📧', connected: true },
    { name: 'GitHub', icon: '🔗', connected: true },
    { name: 'Slack', icon: '💬', connected: false },
    { name: 'Notion', icon: '📝', connected: false },
    { name: 'Jira', icon: '📊', connected: false },
    { name: 'AWS', icon: '☁️', connected: true },
    { name: 'Google Drive', icon: '📁', connected: true },
    { name: 'Dropbox', icon: '📦', connected: false }
  ];

  return (
    <div className="h-full flex">
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">API Integrations</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          {integrations.map(int => (
            <div key={int.name} className="p-4 border rounded-lg hover:shadow">
              <div className="text-3xl mb-2">{int.icon}</div>
              <div className="font-semibold mb-1">{int.name}</div>
              <div className={`text-xs ${int.connected ? 'text-green-600' : 'text-gray-400'}`}>
                {int.connected ? '✓ Connected' : 'Not connected'}
              </div>
              <button className="w-full mt-3 py-1 border rounded text-sm hover:bg-gray-50">
                {int.connected ? 'Configure' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Automation Workflows (IFTTT-style)</h3>
          <div className="space-y-3">
            {[
              'New email → Research Agent analyzes → Save to Drive',
              'GitHub issue created → Backend Agent reviews → Posts to Slack',
              'File uploaded → Workspace Agent processes → Updates database'
            ].map((workflow, i) => (
              <div key={i} className="p-3 bg-gray-50 border rounded flex items-center justify-between">
                <span className="text-sm">{workflow}</span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Play size={14} />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Settings size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            <Plus size={16} />
            Create New Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXTENSIONS TAB
// ============================================================================

const ExtensionsTab = () => {
  const extensions = [
    { name: 'File System Access', icon: FolderOpen, enabled: true, desc: 'Read/write files on your computer' },
    { name: 'Windows Integration', icon: Cpu, enabled: true, desc: 'Control Windows programs and services' },
    { name: 'Database Connector', icon: Database, enabled: true, desc: 'Connect to SQL/NoSQL databases' },
    { name: 'Browser Automation', icon: Globe, enabled: true, desc: 'Automate web browsers' },
    { name: 'Email Client', icon: Link2, enabled: true, desc: 'Send/receive emails' },
    { name: 'Cloud Storage', icon: HardDrive, enabled: true, desc: 'Access Google Drive, Dropbox, etc.' }
  ];

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">System Extensions</h2>
          <p className="text-gray-600 mt-1">Enable AI agents to interact with your system</p>
        </div>
        <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
          <Plus size={16} />
          Add Extension
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {extensions.map(ext => {
          const Icon = ext.icon;
          return (
            <div key={ext.name} className="p-5 border rounded-lg hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{ext.name}</h3>
                    <p className="text-sm text-gray-600">{ext.desc}</p>
                  </div>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="hidden" defaultChecked={ext.enabled} />
                  <span className={`block w-full h-full rounded-full transition-all ${
                    ext.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                      ext.enabled ? 'translate-x-6' : ''
                    }`} />
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Configure →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Shield size={18} />
          Security Notice
        </h3>
        <p className="text-sm text-gray-700">
          Extensions have controlled access to your system. All actions are logged and can require approval. Use the Security agent to review permissions.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// SETTINGS TAB
// ============================================================================

const SettingsTab = () => {
  return (
    <div className="h-full p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6 max-w-3xl">
        <div>
          <h3 className="font-semibold mb-3">Execution Modes</h3>
          <div className="space-y-2">
            {['Quick Mode', 'Deep Think Mode', 'Research Mode'].map(mode => (
              <label key={mode} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50">
                <input type="radio" name="mode" defaultChecked={mode === 'Quick Mode'} />
                <span>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Security Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 border rounded">
              <span>Require approval for file deletion</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 border rounded">
              <span>Require approval for external emails</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 border rounded">
              <span>Enable audit logging</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Performance</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-2">Max Concurrent Tasks</label>
              <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
              <div className="text-xs text-gray-500 mt-1">5 tasks</div>
            </div>
            <div>
              <label className="block text-sm mb-2">Context Cache Duration (minutes)</label>
              <input type="number" defaultValue="30" className="w-full p-2 border rounded" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Export & Backup</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export Configuration
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <Upload size={16} />
              Import Configuration
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
              <Save size={16} />
              Backup All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

export default function AIOpsApp() {
  const [activeTab, setActiveTab] = useState('workspace');

  const renderTab = () => {
    switch (activeTab) {
      case 'workspace': return <WorkspaceTab />;
      case 'agents': return <AgentsTab />;
      case 'knowledge': return <KnowledgeTab />;
      case 'browsers': return <BrowsersTab />;
      case 'vault': return <VaultTab />;
      case 'editors': return <EditorsTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'extensions': return <ExtensionsTab />;
      case 'settings': return <SettingsTab />;
      default: return <WorkspaceTab />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">AI Operations Platform</h1>
          <select className="px-3 py-1.5 border rounded text-sm">
            <option>Project: WebApp-X</option>
            <option>Project: OSINT-Research</option>
            <option>+ New Project</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
            System Online
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b px-2 py-1 flex gap-1 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-500 text-white shadow'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderTab()}
      </div>
    </div>
  );
}