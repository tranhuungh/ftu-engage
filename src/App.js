import React, { useState, useRef } from 'react';
import { 
  Home, Calendar, FileText, Bell, User, 
  Search, Menu, Filter, Download, 
  CheckCircle, XCircle, AlertCircle, BarChart2,
  Users, CheckSquare, Settings, Upload, QrCode, Heart, LogOut, Key, ArrowRight, FilePlus, Clock, ChevronRight, UserPlus, Mail, MapPin, Phone, CreditCard, Flag, Edit2, Save, X, Eye, ThumbsUp, ThumbsDown, Info, Layout, File, MessageSquare, PlusCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// --- DỮ LIỆU KHỞI TẠO ---

const EVENT_CATEGORIES = [
  { id: 'academic', label: 'Academic & Research', color: 'bg-blue-50 text-blue-700', maxPoints: 20 }, 
  { id: 'political', label: 'Political & Social', color: 'bg-red-50 text-red-700', maxPoints: 25 },   
  { id: 'culture', label: 'Culture, Arts & Sports', color: 'bg-purple-50 text-purple-700', maxPoints: 20 }, 
  { id: 'volunteer', label: 'Volunteer & Community', color: 'bg-green-50 text-green-700', maxPoints: 25 },
  { id: 'leadership', label: 'Leadership & Skills', color: 'bg-orange-50 text-orange-700', maxPoints: 10 } 
];

// Sự kiện ban đầu
const INITIAL_EVENTS = [
  { id: 1, title: 'Scientific Research Workshop', date: '2024-10-26', time: '08:00 AM', location: 'Hall A', points: 2, category: 'Academic & Research', status: 'Open', image: '🔬', description: 'Learn research methodology.', proposalFile: 'workshop_plan.pdf' },
  { id: 2, title: 'FTU Games 2025 Opening', date: '2024-10-28', time: '02:00 PM', location: 'Sports Center', points: 2, category: 'Culture, Arts & Sports', status: 'Full', image: '🏅', description: 'Sports festival opening ceremony.', proposalFile: 'games_budget.pdf' },
  { id: 3, title: 'Blood Donation Drive', date: '2024-11-02', time: '07:00 AM', location: 'Main Hall', points: 5, category: 'Volunteer & Community', status: 'Open', image: '🩸', description: 'Give blood, save lives.', proposalFile: 'redcross_collab.pdf' },
];

// Điểm số ban đầu (Để demo tính năng update điểm)
const INITIAL_SCORES = {
  'Academic & Research': 0,
  'Political & Social': 0,
  'Culture, Arts & Sports': 0,
  'Volunteer & Community': 0,
  'Leadership & Skills': 0
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Your "Blood Donation" evidence has been verified (+5 points).', time: '2 hours ago', type: 'success' },
  { id: 2, text: 'New event "Startup Talk" is now open for registration.', time: '5 hours ago', type: 'info' },
];

const INIT_EVIDENCE_HISTORY = [
  // Empty initially to show live update
];

const MOCK_STUDENT_ATTENDANCE = [
  { id: 1, name: 'Nguyen Van A', studentId: '2025001', class: 'K60-A', time: '08:15 AM', method: 'Code Entry' },
  { id: 2, name: 'Tran Thi B', studentId: '2025002', class: 'K60-B', time: '08:20 AM', method: 'QR Scan' },
];

const ANALYTICS_DATA = [
  { name: 'Jan', participation: 400 }, { name: 'Feb', participation: 300 }, { name: 'Mar', participation: 600 }, { name: 'Apr', participation: 800 }, { name: 'May', participation: 500 },
];

const MOCK_CLUB_MEMBERS = [
  { id: 1, name: 'Tran Van E', studentId: '2025005', role: 'President', status: 'Active', joined: 'Sep 2023' },
  { id: 2, name: 'Le Thi F', studentId: '2025006', role: 'Treasurer', status: 'Active', joined: 'Sep 2023' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- HELPER COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", onClick, type="button", disabled=false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#B40000] text-white hover:bg-[#8a0000]",
    secondary: "bg-white border border-[#B40000] text-[#B40000] hover:bg-red-50",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    success: "bg-[#4CAF50] text-white hover:bg-[#388E3C]",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    'Open': 'bg-green-100 text-green-800',
    'Full': 'bg-red-100 text-red-800',
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Draft': 'bg-gray-100 text-gray-800',
    'Registered': 'bg-blue-100 text-blue-800',
    'On Track': 'bg-green-100 text-green-800',
    'Verified': 'bg-green-100 text-green-800',
    'Pending': 'bg-orange-100 text-orange-800',
    'Active': 'bg-green-100 text-green-800',
    'Academic & Research': 'bg-blue-100 text-blue-800',
    'Political & Social': 'bg-red-100 text-red-800',
    'Culture, Arts & Sports': 'bg-purple-100 text-purple-800',
    'Volunteer & Community': 'bg-green-100 text-green-800',
    'Leadership & Skills': 'bg-orange-100 text-orange-800',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl transform transition-all scale-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>No, Cancel</Button>
          <Button onClick={onConfirm}>Yes, I'm Sure</Button>
        </div>
      </div>
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Request Changes</h3>
        <textarea 
          className="w-full border rounded-lg p-3 h-32 text-sm mb-4" 
          placeholder="Describe what needs to be changed in the proposal..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onSubmit(feedback); setFeedback(''); }}>Send Request</Button>
        </div>
      </div>
    </div>
  );
};

const NativeDonutChart = ({ totalScore }) => (
  <div className="w-full h-64 flex items-center justify-center">
    <div className="relative w-48 h-48 rounded-full" 
         style={{ background: `conic-gradient(#B40000 0% ${totalScore}%, #f3f4f6 ${totalScore}% 100%)` }}>
      <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800">{totalScore}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider">Total Points</span>
      </div>
    </div>
  </div>
);

const NativeBarChart = () => (
  <div className="w-full h-64 flex items-end justify-between gap-2 pt-8">
    {[{ l: 'Jan', v: 40 }, { l: 'Feb', v: 30 }, { l: 'Mar', v: 60 }, { l: 'Apr', v: 80 }, { l: 'May', v: 50 }].map((item, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-full bg-gray-100 rounded-t-md relative h-48 flex items-end overflow-hidden">
          <div className="w-full bg-[#B40000] rounded-t-md transition-all duration-500 group-hover:bg-red-700" style={{ height: `${item.v}%` }}></div>
        </div>
        <span className="text-xs text-gray-500 font-medium">{item.l}</span>
      </div>
    ))}
  </div>
);

// --- AUTH COMPONENT ---

const LoginPage = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); 

  const fillTestCreds = (testRole) => {
    setRole(testRole);
    setStudentId(testRole === 'admin' ? '999999' : testRole === 'organizer' ? '888888' : '2025001');
    setPassword('123456');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.trim()) onLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-[#B40000] p-8 text-center text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-white/20">
             <img src="/FTU_logo_2020.svg.jpg" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/B40000/FFFFFF?text=F"; }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>FTU-Engage</h1>
          <p className="opacity-90 text-sm mt-1">Student Activity Management System</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex gap-2 mb-4 justify-center bg-gray-50 p-2 rounded-lg border border-gray-100">
            <button onClick={() => fillTestCreds('student')} className="text-xs px-3 py-1 bg-white border border-gray-200 hover:border-[#B40000] hover:text-[#B40000] rounded shadow-sm">Test: Student</button>
            <button onClick={() => fillTestCreds('organizer')} className="text-xs px-3 py-1 bg-white border border-gray-200 hover:border-[#B40000] hover:text-[#B40000] rounded shadow-sm">Test: Organizer</button>
            <button onClick={() => fillTestCreds('admin')} className="text-xs px-3 py-1 bg-white border border-gray-200 hover:border-[#B40000] hover:text-[#B40000] rounded shadow-sm">Test: Admin</button>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
            {['student', 'organizer', 'admin'].map((r) => (
              <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${role === r ? 'bg-white shadow-sm text-[#B40000]' : 'text-gray-500 hover:text-gray-700'}`}>{r.toUpperCase()}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID (Number Only)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="number" required value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B40000]" placeholder="e.g. 2025001" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#B40000]" placeholder="••••••••" />
              </div>
            </div>
            <Button type="submit" className="w-full py-3 text-lg mt-4">Login <ArrowRight size={18} /></Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- VIEWS ---

const StudentHome = ({ events, onRegister }) => (
  <div className="space-y-8">
    <div className="bg-[#B40000] rounded-2xl p-8 text-white flex justify-between items-center relative overflow-hidden">
      <div className="relative z-10"><h1 className="text-3xl font-bold mb-2">Welcome!</h1><p className="opacity-90">You have {events.filter(e => e.status === 'Open').length} upcoming events available.</p></div>
      <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{EVENT_CATEGORIES.map(cat => (<div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-md transition-shadow cursor-pointer hover:border-[#B40000]"><div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${cat.color} bg-opacity-20`}><Filter size={20} /></div><span className="font-medium text-gray-700 text-sm">{cat.label}</span></div>))}</div>
    </div>
    <div><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2><Button variant="ghost" className="text-sm">View All</Button></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{events.filter(e => e.status === 'Open' || e.status === 'Full').map(event => (<Card key={event.id} className="p-0 overflow-hidden hover:shadow-lg transition-shadow"><div className="h-32 bg-gray-100 flex items-center justify-center text-4xl">{event.image}</div><div className="p-4"><div className="flex justify-between items-start mb-2"><Badge status={event.category} /><button className="text-gray-400 hover:text-red-500"><Heart size={20} /></button></div><h3 className="font-bold text-lg mb-1">{event.title}</h3><p className="text-sm text-gray-500 mb-3">{event.date} • {event.location}</p><div className="flex justify-between items-center"><span className="font-bold text-[#B40000]">+{event.points} Points</span>{event.registered ? (<Button className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700" disabled>Registered</Button>) : (<Button className="text-xs px-3 py-1" onClick={() => onRegister(event.id)} disabled={event.status === 'Full'}>{event.status === 'Full' ? 'Full' : 'Register'}</Button>)}</div></div></Card>))}</div>
    </div>
  </div>
);

const StudentDashboard = ({ scores }) => {
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6"><h2 className="text-xl font-bold text-gray-800">Training Score Progress</h2><Badge status="Active" /></div>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="w-48 h-48 flex-shrink-0"><NativeDonutChart totalScore={totalScore} /></div>
                <div className="flex-1 w-full space-y-4">
                    <div>
                        <div className="flex justify-between mb-1"><span className="font-bold text-gray-700">Total Score</span><span className="font-bold text-[#B40000]">{totalScore}/100</span></div>
                        <div className="w-full bg-gray-100 rounded-full h-3"><div className="bg-[#B40000] h-3 rounded-full" style={{ width: `${totalScore}%` }}></div></div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {EVENT_CATEGORIES.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{cat.label}</span>
                                <span className="font-bold text-[#B40000]">{scores[cat.label] || 0}/{cat.maxPoints}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

const EvidencePage = ({ onSubmitEvidence, evidenceHistory }) => {
  const [activeTab, setActiveTab] = useState('external'); 
  const [formData, setFormData] = useState({ name: '', date: '', category: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if(!formData.name || !selectedFile || (activeTab === 'external' && !formData.category)) {
      return alert("Please fill all details and upload a file.");
    }
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newEntry = { 
      id: Date.now(), 
      student: 'Student', 
      activity: formData.name, 
      type: activeTab === 'external' ? 'External Activity' : 'Missing Score Report', 
      category: formData.category || 'N/A',
      date: formData.date || today, 
      status: 'Pending', 
      file: selectedFile.name 
    };
    onSubmitEvidence(newEntry);
    setFormData({ name: '', date: '', category: '' });
    setSelectedFile(null);
    alert("Submitted successfully to Organizer/Admin!");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">Evidence & Reports</h2>
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button onClick={() => setActiveTab('external')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'external' ? 'bg-[#B40000] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Evidences (External)</button>
          <button onClick={() => setActiveTab('missing')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'missing' ? 'bg-[#B40000] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Report Missing Score</button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <h3 className="font-bold text-lg mb-4">{activeTab === 'external' ? 'Submit Evidence' : 'Report Missing Score'}</h3>
          <p className="text-xs text-gray-500 mb-4">{activeTab === 'external' ? 'Upload proof for activities outside campus.' : 'Points not updated? Report here.'}</p>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Activity Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2 text-sm" placeholder={activeTab === 'external' ? "e.g. IELTS 7.5" : "e.g. Blood Donation"} /></div>
            
            {activeTab === 'external' && (
              <div>
                <label className="block text-sm font-medium mb-1">Category (for points)</label>
                <select className="w-full border rounded-lg p-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {EVENT_CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </div>
            )}
            
            <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg p-2 text-sm" /></div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <Upload className="mx-auto text-gray-400 mb-2" size={24}/>
              {selectedFile ? <span className="text-green-600 font-bold text-sm">{selectedFile.name}</span> : <span className="text-gray-500 text-sm">Click to upload proof</span>}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            </div>
            
            <Button className="w-full" onClick={handleSubmit}>Submit</Button>
          </div>
        </Card>
        
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-4">Submission History</h3>
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr><th className="p-3">Activity</th><th className="p-3">Category</th><th className="p-3">Date</th><th className="p-3">File</th><th className="p-3">Status</th></tr></thead><tbody>{evidenceHistory.map(item => (<tr key={item.id}><td className="p-3 font-medium">{item.activity}</td><td className="p-3 text-xs">{item.category || '-'}</td><td className="p-3">{item.date}</td><td className="p-3 text-blue-600 text-xs underline cursor-pointer">{item.file}</td><td className="p-3"><Badge status={item.status} /></td></tr>))}</tbody></table></div>
        </Card>
      </div>
    </div>
  );
};

const EventsPage = ({ events, onRegister }) => {
  const [filterType, setFilterType] = useState('all'); 
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-full lg:w-64 flex-shrink-0 space-y-4"><Card><div className="flex items-center gap-2 font-bold mb-4 text-gray-800"><Filter size={18} /> Filters</div><div className="space-y-4"><div><label className="text-sm font-medium text-gray-700 mb-2 block">Category</label><div className="space-y-2">{EVENT_CATEGORIES.map(c => (<label key={c.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="radio" name="category" className="rounded text-[#B40000] focus:ring-[#B40000]" /> {c.label}</label>))}</div></div><Button variant="secondary" className="w-full text-sm">Reset Filters</Button></div></Card></div>
      <div className="flex-1 flex flex-col gap-6"><div className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100"><div className="flex gap-2">{['All Events', 'My Registered', 'Saved'].map((tab) => (<button key={tab} onClick={() => setFilterType(tab.toLowerCase())} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterType === tab.toLowerCase() || (filterType === 'all' && tab === 'All Events') ? 'bg-[#B40000] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{tab}</button>))}</div></div><div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pb-4">{events.filter(e => e.status === 'Open' || e.status === 'Full').map((event) => (<Card key={event.id} className="flex flex-col h-full hover:shadow-md transition-shadow duration-200"><div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-5xl mb-4 relative overflow-hidden group"><span className="group-hover:scale-110 transition-transform duration-300">{event.image}</span><div className="absolute top-2 right-2"><Badge status={event.status} /></div></div><div className="flex justify-between items-start mb-2"><span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{event.category}</span><span className="flex items-center gap-1 text-[#B40000] font-bold text-xs"><CheckCircle size={12} /> {event.points} pts</span></div><h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3><div className="space-y-2 mt-auto"><div className="flex items-center gap-2 text-xs text-gray-600"><Calendar size={14} className="text-gray-400" /> {event.date}</div><Button className="w-full mt-3 text-sm" variant={event.status === 'Full' ? 'secondary' : 'primary'} disabled={event.registered || event.status === 'Full'} onClick={() => !event.registered && onRegister(event.id)}>{event.registered ? 'Registered' : event.status === 'Full' ? 'Join Waitlist' : 'Register Now'}</Button></div></Card>))}</div></div>
    </div>
  );
};

const CheckInPage = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const handleCheckIn = (e) => { e.preventDefault(); setStatus('loading'); setTimeout(() => setStatus('success'), 1500); };
  return (<div className="max-w-xl mx-auto pt-10"><Card className="text-center space-y-6 p-10"><div className="mb-4"><h2 className="text-2xl font-bold text-gray-800">Event Check-in</h2></div>{status === 'success' ? <div className="text-green-600 font-bold">Checked In!</div> : <div className="space-y-4"><input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter Code" className="w-full text-center text-2xl p-4 border rounded-xl" /><Button onClick={() => setStatus('success')} className="w-full">Submit</Button></div>}</Card></div>);
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode
  const [formData, setFormData] = useState({ name: '', id: '', dob: '', phone: '', email: '', address: '', class: '', major: '' });
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const InfoRow = ({ label, name, value }) => (<div className="grid grid-cols-3 items-center"><span className="font-medium text-gray-500">{label}:</span><div className="col-span-2 font-bold text-gray-800">{isEditing ? <input type="text" name={name} value={value} onChange={handleInputChange} className="w-full border rounded-lg p-2 text-sm" /> : value || '-'}</div></div>);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3"><div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👤</div><div><h1 className="text-xl font-bold">{formData.name || 'Your Name'}</h1><p className="text-sm text-gray-500">Student Profile</p></div></div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'success' : 'outline'}>{isEditing ? 'Save Profile' : 'Edit Profile'}</Button>
      </div>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4"><InfoRow label="Full Name" name="name" value={formData.name} /><InfoRow label="Student ID" name="id" value={formData.id} /><InfoRow label="Date of Birth" name="dob" value={formData.dob} /></div>
           <div className="space-y-4"><InfoRow label="Class" name="class" value={formData.class} /><InfoRow label="Major" name="major" value={formData.major} /><InfoRow label="Email" name="email" value={formData.email} /></div>
        </div>
      </Card>
    </div>
  );
};

// --- ORGANIZER PORTAL ---
const OrganizerPortal = ({ onAddEvent }) => {
  const [formData, setFormData] = useState({ title: '', date: '', points: 2, category: '' });
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const handleSubmit = () => {
    if(!formData.title || !file || !formData.category) return alert("Please fill all fields and upload proposal.");
    onAddEvent({ ...formData, proposalFile: file.name });
    setFormData({ title: '', date: '', points: 2, category: '' });
    setFile(null);
    alert("Event submitted for Admin verification!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-[#B40000]">Create New Event</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#B40000] font-bold border-b-2 border-[#B40000]">1. Draft</span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">2. Admin Review</span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">3. Verified</span>
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Event Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><select className="w-full border rounded-lg p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option value="">Select...</option>{EVENT_CATEGORIES.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg p-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Points</label><input type="number" value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} className="w-full border rounded-lg p-2" /></div>
          </div>
          <div className="pt-2"><label className="block text-sm font-medium mb-1">Event Proposal (Required for Admin)</label><div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer bg-gray-50 transition-colors" onClick={() => fileRef.current.click()}><FileText className="mx-auto text-gray-400 mb-2" size={24} />{file ? <span className="text-green-600 font-bold">{file.name}</span> : <span className="text-sm text-gray-500">Upload Plan/Budget (PDF)</span>}<input type="file" ref={fileRef} className="hidden" onChange={e => setFile(e.target.files[0])} /></div></div>
          <Button className="w-full mt-4" onClick={handleSubmit}>Submit for Verification</Button>
        </div>
      </Card>
      <Card><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Attendance Queue</h3><Button variant="ghost" size="sm"><Download size={14}/></Button></div><div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="bg-gray-50"><tr><th className="p-2">Student</th><th className="p-2 text-right">Check-in</th></tr></thead><tbody>{MOCK_STUDENT_ATTENDANCE.map(st => (<tr key={st.id}><td className="p-2"><div className="font-bold">{st.name}</div><div className="text-[10px] text-gray-500">{st.studentId}</div></td><td className="p-2 text-right"><div className="text-green-600">{st.time}</div><div className="text-[10px] text-gray-400">{st.method}</div></td></tr>))}</tbody></table></div></Card>
    </div>
  );
};

const MemberManagement = () => (<div className="space-y-6"><Card><div className="flex justify-between items-center mb-6"><div><h2 className="font-bold text-lg text-[#B40000]">Club Member Registry</h2></div><Button variant="secondary" className="text-xs">Import List</Button></div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-600 font-medium"><tr><th className="p-3">Student Info</th><th className="p-3">Role</th><th className="p-3">Status</th></tr></thead><tbody>{MOCK_CLUB_MEMBERS.map((member) => (<tr key={member.id}><td className="p-3"><div className="font-bold">{member.name}</div></td><td className="p-3">{member.role}</td><td className="p-3"><Badge status={member.status} /></td></tr>))}</tbody></table></div></Card></div>);

// --- ADMIN PORTAL (UPDATED: Student Evidence Review) ---
const AdminApprovals = ({ events, evidenceHistory, onVerifyEvent, onVerifyEvidence, onRequestChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Event & Score Approvals</h2>
    
    {/* 1. Event Proposals */}
    <Card className="border-l-4 border-blue-500">
      <h3 className="font-bold text-lg mb-4">Organizer Event Proposals</h3>
      {events.filter(e => e.status === 'Pending Review').length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No pending event proposals.</p>
      ) : (
        events.filter(e => e.status === 'Pending Review').map(event => (
          <div key={event.id} className="border p-4 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-2">
              <div><h4 className="font-bold">{event.title}</h4><p className="text-xs text-gray-500">Category: {event.category}</p></div>
              <Badge status="Pending Review" />
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded mb-3 cursor-pointer border border-blue-200 hover:bg-blue-100">
              <FileText size={16}/> <span>{event.proposalFile || 'plan.pdf'}</span> <span className="ml-auto text-xs">Download</span>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" className="text-xs" onClick={() => onRequestChange(event.id)}>Request Change</Button><Button onClick={() => onVerifyEvent(event.id)} className="text-xs bg-green-600 hover:bg-green-700">Verify & Launch</Button></div>
          </div>
        ))
      )}
    </Card>

    {/* 2. Student Evidence Review */}
    <Card className="border-l-4 border-orange-500">
      <h3 className="font-bold text-lg mb-4">Student Evidence & Reports</h3>
      <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr><th className="p-3">Student</th><th className="p-3">Activity</th><th className="p-3">File</th><th className="p-3 text-right">Action</th></tr></thead>
      <tbody>
         {evidenceHistory.filter(i => i.status === 'Pending').length === 0 ? (
            <tr><td colSpan="4" className="text-center py-4 text-gray-500">No pending reports.</td></tr>
         ) : (
            evidenceHistory.filter(i => i.status === 'Pending').map(item => (
              <tr key={item.id}>
                <td className="p-3 font-medium">{item.student || 'Student'}</td>
                <td className="p-3">
                  <div className="font-bold">{item.activity}</div>
                  <div className="text-xs text-gray-500">{item.type}</div>
                </td>
                <td className="p-3 text-blue-600 underline cursor-pointer text-xs">{item.file}</td>
                <td className="p-3 text-right"><Button className="text-xs py-1 h-auto bg-green-600" onClick={() => onVerifyEvidence(item.id, item.category)}>Verify</Button></td>
              </tr>
            ))
         )}
      </tbody></table></div>
    </Card>
  </div>
);

const AdminSystemOversight = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{['Total Users', 'Pending Disputes', 'Avg Score', 'Active Events'].map((label, i) => (<Card key={i} className="p-4"><div className="text-gray-500 text-xs font-bold uppercase">{label}</div><div className="text-2xl font-bold text-[#B40000]">{[1240, 12, '89%', 45][i]}</div></Card>))}</div>
    <div className="grid lg:grid-cols-2 gap-6"><Card><h3 className="font-bold mb-4">Participation</h3><NativeBarChart /></Card><Card><h3 className="font-bold mb-4">Breakdown</h3><NativeDonutChart /></Card></div>
  </div>
);

const AdminDisputes = () => (<div className="space-y-6"><Card><h2 className="font-bold text-lg text-gray-800 mb-6">Dispute Management Queue</h2><div className="text-center text-gray-500 py-10">No active disputes.</div></Card></div>);
const AdminPolicies = () => (<div className="space-y-6"><Card><h2 className="font-bold text-lg text-gray-800 mb-6">Score Policies</h2><div className="text-center text-gray-500 py-10">Policy configuration panel.</div></Card></div>);

// --- MAIN APP ---

const Sidebar = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = {
    student: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
      { id: 'evidence', label: 'Evidence & Reports', icon: FilePlus },
      { id: 'qr-checkin', label: 'Event Check-in', icon: QrCode },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    organizer: [
      { id: 'org-events', label: 'Event Management', icon: Calendar },
      { id: 'attendance', label: 'Attendance', icon: Users },
      { id: 'members', label: 'Club Members', icon: UserPlus }, 
      { id: 'score-submit', label: 'Score Submission', icon: CheckSquare },
    ],
    admin: [
      { id: 'oversight', label: 'System Oversight', icon: BarChart2 },
      { id: 'approvals', label: 'Approvals', icon: CheckSquare }, 
      { id: 'disputes', label: 'Dispute Management', icon: AlertCircle },
      { id: 'policies', label: 'Score Policies', icon: Settings },
    ]
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 hidden md:flex flex-col z-10">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <img src="/FTU_logo_2020.svg.jpg" alt="FTU" className="w-10 h-10 object-contain rounded-full" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/B40000/FFFFFF?text=F"; }} />
        <span className="text-xl font-bold text-[#B40000]" style={{ fontFamily: "'Montserrat', sans-serif" }}>FTU-Engage</span>
      </div>
      <div className="p-4 flex-1">
        <div className="text-xs font-semibold text-gray-400 mb-4 px-4 uppercase tracking-wider">{role} Portal</div>
        <nav className="space-y-1">
          {menuItems[role]?.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-red-50 text-[#B40000]' : 'text-gray-600 hover:bg-gray-50'}`}>
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100">
        <button onClick={onLogout} className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 w-full p-2 rounded-lg transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [role, setRole] = useState('student');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [evidenceHistory, setEvidenceHistory] = useState(INIT_EVIDENCE_HISTORY);
  const [studentScores, setStudentScores] = useState(INITIAL_SCORES);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, eventId: null });
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, eventId: null });

  // HANDLERS
  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setActiveTab(selectedRole === 'student' ? 'home' : selectedRole === 'organizer' ? 'org-events' : 'oversight');
  };

  const handleAddEvent = (newEvent) => {
    const eventObj = { 
      id: events.length + 1, 
      ...newEvent, 
      status: 'Pending Review',
      image: '📅' 
    };
    setEvents([...events, eventObj]);
  };

  const handleVerifyEvent = (id) => {
    setEvents(events.map(e => e.id === id ? { ...e, status: 'Open' } : e));
    alert("Event Verified and Launched for Students!");
  };

  const handleSubmitEvidence = (newEntry) => {
    setEvidenceHistory([newEntry, ...evidenceHistory]);
  };

  const handleVerifyEvidence = (id, category) => {
    setEvidenceHistory(evidenceHistory.map(e => e.id === id ? { ...e, status: 'Verified' } : e));
    if (category && studentScores[category] !== undefined) {
        setStudentScores(prev => ({ ...prev, [category]: prev[category] + 5 }));
    }
    alert("Evidence Verified! 5 points added to student score.");
  };

  const handleRequestChange = (id, feedback) => {
    alert(`Feedback sent to organizer: ${feedback}`);
    setFeedbackModal({ isOpen: false, eventId: null });
  };

  const initiateRegister = (id) => setConfirmModal({ isOpen: true, eventId: id });
  
  const confirmRegister = () => {
    setEvents(events.map(e => e.id === confirmModal.eventId ? { ...e, registered: true } : e));
    setConfirmModal({ isOpen: false, eventId: null });
    // Auto add points for internal events (simulated)
    const event = events.find(e => e.id === confirmModal.eventId);
    if(event) {
       setStudentScores(prev => ({ ...prev, [event.category]: prev[event.category] + event.points }));
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <StudentHome events={events} onRegister={initiateRegister} />;
      case 'dashboard': return <StudentDashboard scores={studentScores} />;
      case 'evidence': return <EvidencePage onSubmitEvidence={handleSubmitEvidence} evidenceHistory={evidenceHistory} />;
      case 'events': return <EventsPage events={events} onRegister={initiateRegister} />; 
      case 'qr-checkin': return <CheckInPage />;
      case 'org-events': return <OrganizerPortal onAddEvent={handleAddEvent} />;
      case 'members': return <MemberManagement />; 
      case 'oversight': return <AdminSystemOversight />;
      case 'approvals': return <AdminApprovals events={events} evidenceHistory={evidenceHistory} onVerifyEvent={handleVerifyEvent} onVerifyEvidence={handleVerifyEvidence} onRequestChange={(id) => setFeedbackModal({isOpen: true, eventId: id})} />;
      case 'disputes': return <AdminDisputes />;
      case 'policies': return <AdminPolicies />;
      case 'profile': return <ProfilePage />;
      default: return <div className="p-10 text-center text-gray-500">Page under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans text-gray-900 relative">
      <Sidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)} />
      <div className="md:ml-64 p-6 pt-20 md:pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#B40000] focus:ring-1 focus:ring-[#B40000]" /></div>
          <div className="flex items-center gap-3"><span className="text-sm font-bold text-gray-700 capitalize bg-white px-3 py-1 rounded-full border border-gray-200">{role} view</span><div className="w-8 h-8 bg-[#B40000] text-white rounded-full flex items-center justify-center font-bold">{role[0].toUpperCase()}</div></div>
        </div>
        <div className="animate-fade-in">{renderContent()}</div>
      </div>
      
      <button className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform" onClick={() => alert("Feedback form would open here.")} title="Beta Feedback"><MessageSquare size={24} /></button>

      <ConfirmationModal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ isOpen: false, eventId: null })}
        onConfirm={confirmRegister}
        title="Confirm Registration"
        message="Are you sure you want to join this event? This will be added to your schedule."
      />

      <FeedbackModal 
         isOpen={feedbackModal.isOpen}
         onClose={() => setFeedbackModal({ isOpen: false, eventId: null })}
         onSubmit={(msg) => handleRequestChange(feedbackModal.eventId, msg)}
      />
    </div>
  );
};

export default App;