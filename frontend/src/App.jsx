import { useState, useRef, useEffect } from 'react';
import NeuralOrb from './components/NeuralOrb.jsx';
import './index.css';

// API Configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// ── INLINE SVG ICONS ──
const IconEye = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconCamera = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const IconMonitor = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);
const IconGlobe = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconCalendar = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const IconMail = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconSend = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconTerminal = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
);
const IconMic = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const IconMicOff = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const IconTrash2 = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const IconSmartphone = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);


// ── CONFIGURATION & TOOLS ──
const CORE_PLUGINS = [
  { id: 'vision', label: '(V)ision Eye', status: 'ACTIVE', color: '#ff3c3c' },
  { id: 'search', label: '(W)eb Search', status: 'STANDBY', color: '#3b82f6' },
  { id: 'workspace', label: '(W)orkspace', status: 'CONNECTED', color: '#a855f7' },
  { id: 'imap', label: '(Email) IMAP', status: 'SYNCED', color: '#00d4ff' },
  { id: 'terminal', label: '(T)erminal', status: 'READY', color: '#10b981' },
];

const TOOLS = [
  { id: 'screenshot', icon: IconMonitor, color: '#a855f7', label: 'Pantalla', sub: 'Captura', action: 'screenshot' },
  { id: 'webcam', icon: IconCamera, color: '#ec4899', label: 'Visión', sub: 'IA Cámara', action: 'webcam' },
  { id: 'search', icon: IconGlobe, color: '#3b82f6', label: 'Buscar', sub: 'Tavily AI', cmd: 'Busca en internet últimas noticias de IA' },
  { id: 'calendar', icon: IconCalendar, color: '#10b981', label: 'Agenda', sub: 'Google', cmd: '¿Qué tengo hoy en mi Google Calendar?' },
  { id: 'email', icon: IconMail, color: '#0078d4', label: 'Correo', sub: 'Outlook', cmd: 'Léeme mis últimos correos de Hotmail' },
  { id: 'telegram', icon: IconSend, color: '#0ea5e9', label: 'Telegram', sub: 'Bot API', cmd: 'Envíame un mensaje por Telegram' },
];

function App() {
  const [orbState, setOrbState] = useState('ready');
  const [volume, setVolume] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Advanced State
  const [transcript, setTranscript] = useState(null);
  const [visionImage, setVisionImage] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showTools, setShowTools] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleAudioPlayback = async (url) => {
    if (!url) { setOrbState('ready'); return; }
    try {
      initAudio();
      const res = await fetch(url);
      if (!res.ok) throw new Error("Audio fetch failed");
      const buffer = await audioContextRef.current.decodeAudioData(await res.arrayBuffer());
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      setOrbState('speaking');
      source.start(0);
      
      const updateVolume = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const vol = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
          setVolume(vol / 255); // Normalize 0-1
          requestAnimationFrame(updateVolume);
        }
      };
      updateVolume();
      source.onended = () => { setOrbState('ready'); setVolume(0); };
    } catch (err) {
      console.error("Audio err:", err);
      setOrbState('ready');
    }
  };

  const sendCommand = async (endpoint, payload, isJson = true) => {
    initAudio();
    setOrbState('processing');
    setVisionImage(null);
    try {
      const options = { 
        method: 'POST', 
        headers: { 'x-api-key': API_KEY }, 
        body: payload 
      };
      if (isJson) options.headers['Content-Type'] = 'application/json';
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      const res = await fetch(fullUrl, options);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      
      if (data.vision_url) setVisionImage(data.vision_url);

      const responseText = data.response || data.error || data.transcript || '';
      
      // Intercept __VISION_REQUEST__ markers from the backend
      if (responseText.startsWith('__VISION_REQUEST__:')) {
        const visionType = responseText.split(':')[1];
        setTranscript({ type: 'system', text: visionType === 'webcam' ? '◈ ACTIVANDO WEBCAM...' : '◈ CAPTURANDO PANTALLA...' });
        if (visionType === 'webcam') {
          await captureWebcam();
        } else {
          await captureScreenshot();
        }
        return;
      }

      setTranscript({ type: 'bot', text: responseText });
      handleAudioPlayback(data.audio_url);
    } catch (err) {
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error: ${err.message}` });
    }
  };

  // ═══ VISION: Capture screenshot via getDisplayMedia ═══
  const captureScreenshot = async () => {
    try {
      setOrbState('processing');
      setTranscript({ type: 'system', text: '◈ SELECCIONA LA PANTALLA A CAPTURAR...' });
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' } });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      track.stop();

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      setTranscript({ type: 'system', text: '◈ ANALIZANDO PANTALLA...' });
      await sendVisionToBackend(base64, 'screenshot');
    } catch (err) {
      console.error('Screenshot error:', err);
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error captura pantalla: ${err.message}` });
    }
  };

  // ═══ VISION: Capture webcam photo via getUserMedia ═══
  const captureWebcam = async () => {
    let stream = null;
    try {
      setOrbState('processing');
      setTranscript({ type: 'system', text: '◈ ACTIVANDO CÁMARA...' });
      
      const constraints = { 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      stream = await navigator.mediaDevices.getUserMedia(constraints);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = reject;
      });

      // Wait for focus/lighting stabilization
      await new Promise(r => setTimeout(r, 800));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);

      setTranscript({ type: 'system', text: '◈ ANALIZANDO IMAGEN...' });
      await sendVisionToBackend(base64, 'webcam');
    } catch (err) {
      console.error('Webcam error:', err);
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error cámara: ${err.name === 'NotAllowedError' ? 'Permiso denegado' : err.message}` });
    } finally {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  // ═══ Send captured image to backend for AI analysis ═══
  const sendVisionToBackend = async (base64Image, source) => {
    try {
      const res = await fetch(`${API_BASE_URL}/vision-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ image: base64Image, source })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.vision_url) setVisionImage(data.vision_url);
      setTranscript({ type: 'bot', text: data.response });
      handleAudioPlayback(data.audio_url);
    } catch (err) {
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error análisis: ${err.message}` });
    }
  };

  const handleToolAction = (tool) => {
    if (tool.action === 'screenshot') {
      captureScreenshot();
    } else if (tool.action === 'webcam') {
      captureWebcam();
    } else if (tool.cmd) {
      handleTextInput(tool.cmd);
    }
  };

  const handleTextInput = (text) => {
    if (!text.trim()) return;
    setTranscript({ type: 'user', text });
    setUserInput('');
    setShowTools(false);
    setTimeout(() => sendCommand('/text-command', JSON.stringify({ text })), 400);
  };

  const clearMemory = async () => {
    try {
      await fetch(`${API_BASE_URL}/clear-memory`, { 
        method: 'POST',
        headers: { 'x-api-key': API_KEY }
      });
      setTranscript({ type: 'system', text: '◈ MEMORIA PURGADA.' });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMic = async () => {
    initAudio();
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          setOrbState('processing');
          setTranscript({ type: 'system', text: '◈ PROCESANDO AUDIO...' });
          setVisionImage(null);
          
          const type = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? 'audio/mp4' : 'audio/wav';
          const audioBlob = new Blob(chunksRef.current, { type });
          const formData = new FormData();
          formData.append('audio_file', audioBlob); // Backend expects 'audio_file' due to routes.py
          await sendCommand('/voice-command', formData, false);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setOrbState('listening');
        setTranscript({ type: 'system', text: '◈ ESCUCHANDO...' });
      } catch (err) {
        console.error("Mic error:", err);
        setOrbState('error');
        setTranscript({ type: 'error', text: `Mic: ${err.message}` });
      }
    } else {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="premium-container">
      {/* Background Ambient Particles */}
      <div className="ambient-background" />
      
      {/* Top Contextual Info & Tools Button (Mobile) */}
      <div className="top-info-bar flex justify-between items-center w-full px-4">
        <span>Hoy es {formatDate(currentTime)}. Son las {formatTime(currentTime)}.</span>
        <button 
          onClick={() => setShowTools(!showTools)}
          className="md:hidden w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50"
        >
          <IconSmartphone className="w-4 h-4" />
        </button>
      </div>

      <main className="main-interface">
        {/* Left Panel (Tools - Desktop) */}
        <div className="side-panel left-panel hidden md:flex flex-col justify-center gap-3 w-48 z-40 relative">
          <div className="panel-header text-center w-full">ACCESO RÁPIDO</div>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => handleToolAction(t)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <t.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" style={{ color: t.color }} />
              <div className="flex flex-col items-start select-none">
                <span className="text-[11px] font-bold text-white/70">{t.label}</span>
                <span className="text-[9px] text-white/40">{t.sub}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Center Panel (Orb, Neural Title & Transcript) */}
        <div className="center-panel relative w-full h-full">
          <div className="orb-wrapper w-full h-full flex flex-col items-center justify-center">
            
            {/* The Animated Plasma Orb */}
            <NeuralOrb audioLevel={volume} orbState={orbState} />
            
            <div className="neural-title-v7 mt-8">CENTRAL DE INTELIGENCIA V7.0</div>

            {/* Transcript overlay — only show system/error/user/vision, NOT bot text responses */}
            {transcript && (transcript.type === 'system' || transcript.type === 'error' || transcript.type === 'user' || visionImage) && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-lg z-20 pointer-events-none px-4">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto">
                  {visionImage && (
                    <div className="mb-3 w-32 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg">
                      <img src={visionImage} alt="Vision" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {transcript.type === 'user' ? (
                    <div>
                      <span className="text-[10px] text-white/30 tracking-wider font-mono">TÚ</span>
                      <p className="text-sm text-white/70 mt-1">{transcript.text}</p>
                      <span className="text-[10px] text-purple-400 animate-pulse mt-2 block font-mono">◈ PROCESANDO...</span>
                    </div>
                  ) : transcript.type === 'system' ? (
                    <span className={`text-sm font-bold tracking-wider animate-pulse font-mono ${orbState === 'listening' ? 'text-red-400' : 'text-purple-400'}`}>
                      {transcript.text}
                    </span>
                  ) : transcript.type === 'error' ? (
                    <span className="text-sm text-red-400 font-bold">{transcript.text}</span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel (Core Plugins) */}
        <div className="side-panel right-panel">
          <div className="panel-header">CORE PLUGINS</div>
          <div className="plugins-list">
            {CORE_PLUGINS.map(plugin => (
              <div key={plugin.id} className="plugin-item">
                <span className="plugin-label">{plugin.label}</span>
                <span className="plugin-status" style={{ color: plugin.color }}>[{plugin.status}]</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── MOBILE TOOLS DRAWER ── */}
      {showTools && (
        <div className="fixed inset-x-0 bottom-[100px] z-50 p-4 md:hidden">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TOOLS.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleToolAction(t)}
                  className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10"
                >
                  <t.icon className="w-6 h-6" style={{ color: t.color }} />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-white/70 font-bold">{t.label}</span>
                    <span className="text-[8px] text-white/30 truncate w-full text-center">{t.sub}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTools(false)}
              className="w-full mt-4 py-3 rounded-xl bg-white/5 text-[11px] font-bold text-white/40 tracking-wider hover:bg-white/10 uppercase"
            >
              Cerrar Panel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Interface (Mic, Input, Memory) */}
      <footer className="interface-footer relative z-50">
        <div className="controls-center flex items-center justify-center gap-4 w-full max-w-2xl px-4">
          
          <button
            onClick={clearMemory}
            className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-[#151515] border border-white/10 items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-all group pointer-events-auto"
            title="Purgar Memoria"
          >
            <IconTrash2 className="w-5 h-5 text-white/30 group-hover:text-red-400" />
          </button>

          <button 
            className={`mic-trigger flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${orbState === 'listening' ? 'active bg-red-500/20 border-red-500/50' : 'bg-[#151515] border-white/10'}`}
            onClick={toggleMic}
          >
            {orbState === 'listening' ? <IconMicOff className="text-red-400 w-6 h-6" /> : <IconMic className="text-white/70 w-6 h-6" />}
          </button>
          
          <div className="cmd-line flex-1 w-full bg-[#151515] border border-white/10 rounded-full overflow-hidden flex items-center px-4 h-12 pointer-events-auto">
            <span className="prompt text-white/30 mr-3 font-mono text-sm">&gt;</span>
            <input 
              type="text" 
              placeholder="Escribe un comando o petición..." 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextInput(userInput);
              }}
              className="w-full bg-transparent border-none outline-none text-white/80 text-sm placeholder:text-white/20"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
