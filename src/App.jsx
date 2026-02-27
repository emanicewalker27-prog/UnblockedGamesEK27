import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, X, Maximize2, ExternalLink, FileText, Shield, Ghost, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import studyData from './data/resources.json';

const STEALTH_PRESETS = {
  default: { title: 'CalcStudy', icon: '/vite.svg' },
  googleDocs: { title: 'Google Docs', icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' },
  googleDrive: { title: 'My Drive - Google Drive', icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png' },
  classroom: { title: 'Classes', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
  canvas: { title: 'Dashboard', icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e106157072.ico' }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stealthMode, setStealthMode] = useState('default');
  const [safePath, setSafePath] = useState(false);

  useEffect(() => {
    const preset = STEALTH_PRESETS[stealthMode];
    document.title = preset.title;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = preset.icon;
  }, [stealthMode]);

  useEffect(() => {
    if (safePath) {
      window.history.replaceState({}, '', '/edu/math/calc/unit4/review');
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [safePath]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        window.location.href = 'https://classroom.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openStealth = () => {
    const win = window.open();
    if (!win) {
      alert("Please allow popups!");
      return;
    }
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = window.location.href;
    win.document.body.appendChild(iframe);
    window.location.replace('https://google.com');
  };

  const filteredItems = useMemo(() => {
    return studyData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans selection:bg-blue-100">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedItem(null); setSearchQuery(''); }}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Calc<span className="text-blue-600">Study</span>
              </h1>
            </div>

            <div className="hidden sm:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl transition-all outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider hidden lg:block">Settings</span>
              </button>
              <div className="w-px h-6 bg-slate-200 hidden md:block" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest hidden md:block">
                {filteredItems.length} Resources
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -4 }} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedItem(item)}>
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No resources available</h3>
            <p className="text-slate-500">Check back later for updates.</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg"><Shield className="w-5 h-5 text-blue-600" /></div>
                  <h2 className="font-bold text-slate-900">Settings</h2>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Display Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STEALTH_PRESETS).map(([key, value]) => (
                      <button key={key} onClick={() => setStealthMode(key)} className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm ${stealthMode === key ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                        <img src={value.icon} alt="" className="w-4 h-4" referrerPolicy="no-referrer" />
                        <span className="truncate">{key === 'default' ? 'Default' : value.title.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Ghost className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Stealth Window</h4>
                      <p className="text-xs text-slate-500">Hides the URL entirely by opening in an empty tab.</p>
                    </div>
                  </div>
                  <button onClick={openStealth} className="w-full py-2.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-xl text-sm font-bold transition-all shadow-sm">Launch Window</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-start gap-3">
                    <EyeOff className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Path Mask</h4>
                      <p className="text-xs text-slate-500">Makes the URL look like a specific resource.</p>
                    </div>
                  </div>
                  <button onClick={() => setSafePath(!safePath)} className={`w-12 h-6 rounded-full transition-colors relative ${safePath ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${safePath ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <p className="text-xs text-blue-700">Press the <strong>backtick (`)</strong> key at any time to instantly redirect to Google Classroom.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full max-w-6xl ${isFullScreen ? 'h-full' : 'aspect-video max-h-[85vh]'}`}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <h2 className="font-bold text-slate-900 leading-tight">{selectedItem.title}</h2>
                    <p className="text-xs text-slate-500 hidden sm:block">Educational Resource</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Toggle Fullscreen"><Maximize2 className="w-5 h-5" /></button>
                  <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500" title="Open in new tab"><ExternalLink className="w-5 h-5" /></a>
                  <div className="w-px h-6 bg-slate-200 mx-1" />
                  <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-500"><X className="w-6 h-6" /></button>
                </div>
              </div>
              <div className="flex-1 bg-slate-900 relative">
                <iframe src={selectedItem.url} className="w-full h-full border-none" title={selectedItem.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-900 p-1.5 rounded-lg"><BookOpen className="w-5 h-5 text-white" /></div>
              <span className="text-lg font-bold tracking-tight text-slate-900">CalcStudy</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Resources</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            </div>
            <div className="text-sm text-slate-400">&copy; {new Date().getFullYear()} CalcStudy. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
